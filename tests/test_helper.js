const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)


const loginApiUser = async () => {
  const data = {
    "username": initialUsers[0].username,
    "password": initialUsers[0].password
  }

  const response = await api
    .post('/api/login')
    .send(data)
  
  return response.body
}

const initialBlogs = [
  {
    title: 'Blog about nonsense',
    author: 'Ville Tuomaala',
    url: 'https://google.com/villetuomaala',
    likes: 121212
  },
  {
    title: 'Blog about awesome things',
    author: 'Ville Tuomaala',
    url: 'https://google.com/villetuomaalakk',
    likes: 3
  }
]

const initialUsers = [
  {
    username: 'admin',
    password: process.env.TEST_USER_PASSWORD,
    name: 'The true admin'
  },
  {
    username: 'root',
    password: process.env.TEST_USER_PASSWORD,
    name: 'The root user'
  }
]

const newBlog = {
  title: 'Blog about Java5',
  author: 'Java Dude',
  url: 'https://oracle.com',
  likes: 0
}

const updateBlog = {
  title: 'Blog about Java6',
  author: 'Java6 Dude',
  url: 'https://oracle.com/6',
  likes: 1
}

const newBlogWithoutLikes = {
  title: 'Blog about...',
  author: 'The Dude',
  url: 'https://oracle.com'
}

const newInvalidBlog = {
  author: "Cromet Monster",
  likes: 0
 }

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInBd = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { 
  initialBlogs, 
  newBlog, 
  blogsInDb, 
  newBlogWithoutLikes, 
  newInvalidBlog, 
  updateBlog, 
  initialUsers, 
  usersInBd,
  loginApiUser
}