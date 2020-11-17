const blogController = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const CustomError = require('../utils/customError')

const getTokenFrom = request => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  throw CustomError('Unauthorized', 'Authorization header missing', 401)
}

blogController.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogController.post('/', async (request, response, next) => {
  try {
    const token = getTokenFrom(request)
    const verifiedToken = jwt.verify(token, process.env.TOKEN_KEY)
    if (!token || !verifiedToken.id) throw CustomError('Unauthorized', 'Invalid token', 401)

    const user = await User.findById(verifiedToken.id)
    const blog = new Blog({
      ...request.body,
      user: user.id
    })

    if (!blog.likes) blog.likes = 0;

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogController.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogController.put('/:id', async (request, response, next) => {

  const newNote = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newNote, { new: true })
    response.json(updatedBlog.toJSON())
  } catch (error) {
    next(error)
  }
})

module.exports = blogController