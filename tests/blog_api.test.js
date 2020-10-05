const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blog = require('../models/blog')
const helper = require('./test_helper')
const _ = require('lodash')

const api = supertest(app)

// init test db
beforeEach(async () => {
  await blog.deleteMany({})
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
      .send(helper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterPost = await helper.blogsInDb()

    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length+1)
    expect(blogsAfterPost.map(b => _.omit(b, 'id'))).toContainEqual(helper.newBlog)
  })

  test('blog without likes defaults to 0', async () => {
    const response = await api
      .post('/api/blogs')
      .send(helper.newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
  })

  test('should return 400 Bad Request', async () => {
    await api
      .post('/api/blogs')
      .send(helper.newInvalidBlog)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})