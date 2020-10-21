const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const user = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)


//init
beforeEach(async () => {
  await user.deleteMany({})
  await user.insertMany(helper.initialUsers)
})


describe('POST /api/users', () => {
  test('User without password returns error', async () => {
    await api
      .post('/api/users')
      .send({
        username: 'DummyUser',
        name: 'Dummy User'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const usersAfterPost = await helper.usersInBd()
    expect(usersAfterPost).toHaveLength(helper.initialUsers.length)
  }),

  test('User without username returns error', async () => {
    await api
      .post('/api/users')
      .send({
        name: 'Dummy User',
        password: 'mypassword123'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfterPost = await helper.usersInBd()
    expect(usersAfterPost).toHaveLength(helper.initialUsers.length)
  }),

  test('User username length lt 3 returns error', async () => {
    await api
      .post('/api/users')
      .send({
        name: 'Dummy User',
        password: 'mypassword123',
        username: '12'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfterPost = await helper.usersInBd()
    expect(usersAfterPost).toHaveLength(helper.initialUsers.length)
  }),

  test('User name length lt 4 returns error', async () => {
    await api
      .post('/api/users')
      .send({
        name: 'Dum',
        password: 'mypassword123',
        username: '123'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfterPost = await helper.usersInBd()
    expect(usersAfterPost).toHaveLength(helper.initialUsers.length)
  }),

  test('Non unique User username returns error', async () => {
    await api
      .post('/api/users')
      .send({
        name: 'Dummy User',
        password: 'mypassword123',
        username: 'root'
      })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfterPost = await helper.usersInBd()
    expect(usersAfterPost).toHaveLength(helper.initialUsers.length)
  })
})


afterAll(() => {
  mongoose.connection.close()
})