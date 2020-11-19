const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const blog = require('../models/blog')
const user = require('../models/user')
const helper = require('./test_helper')
const _ = require('lodash')

const api = supertest(app)

let loginUser
let users


beforeAll(async () => {
  const hashedPassword = await bcrypt.hash(process.env.TEST_USER_PASSWORD, 10)
  await user.deleteMany({})
  users = await user.insertMany(helper.initialUsers.map(u => ({ username: u.username, password: hashedPassword, name: u.name })))
  loginUser = await helper.loginApiUser()
})

// init test db
beforeEach(async () => {
  await blog.deleteMany({})
  helper.initialBlogs.map(b => b.user = users[0]._id)
  await blog.insertMany(helper.initialBlogs)
})

describe('GET /api/blogs', () => {
  test('Blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns amount of initial blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('returns id as identifier', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(element => {
      expect(element.id).toBeDefined()
    });
  })
})


describe('POST /api/blogs', () => {
  test('post new blog', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loginUser.token}`)
      .send({ ...helper.newBlog, user: loginUser.id })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterPost = await helper.blogsInDb()

    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length+1)
    expect(blogsAfterPost.map(b => _.omit(b, 'id')).map(b => _.omit(b, 'user'))).toContainEqual(helper.newBlog)
  })

  test('blog without likes defaults to 0', async () => {
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loginUser.token}`)
      .send({ ...helper.newBlogWithoutLikes, user: loginUser.id })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
  })

  test('should return 400 Bad Request', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loginUser.token}`)
      .send(helper.newInvalidBlog)
      .expect(400)
  })

  test('should return Unauthorized 401 if Authorization token is missing', async () => {
    await api
      .post('/api/blogs')
      .send({ ...helper.newBlog, user: loginUser.id })
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

describe('DELETE /api/blogs', () => {
  test('delete blog', async () => {
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loginUser.token}`)
      .send({ ...helper.newBlog, user: loginUser.id})

    await api
      .delete(`/api/blogs/${response.body.id}`)
      .set('Authorization', `bearer ${loginUser.token}`)
      .expect(204)

    const blogsAfterDelete = await helper.blogsInDb()

    expect(helper.initialBlogs).toHaveLength(blogsAfterDelete.length)
    expect(blogsAfterDelete).not.toContain(helper.newBlog)
  })
})

describe('PUT /api/blogs', () => {
  test('update blog', async () => {
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${loginUser.token}`)
      .send(helper.newBlog)

    const updatedBlog = await api
      .put(`/api/blogs/${response.body.id}`)
      .send({ ...helper.updateBlog, user: loginUser.id })
      .expect(200)

      const blogsAfterPost = await helper.blogsInDb()
      expect(blogsAfterPost.map(b => _.omit(b, 'id')).map(b => _.omit(b, 'user'))).toContainEqual(helper.updateBlog)
      expect(blogsAfterPost.map(b => _.omit(b, 'id')).map(b => _.omit(b, 'user'))).not.toContainEqual(helper.newBlog)
  })
})

afterAll(() => {
  mongoose.connection.close()
})