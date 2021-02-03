const blogController = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const authUtils = require('../utils/authUtils')
const CustomError = require('../utils/customError')


blogController.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs.sort((a, b) => a.likes - b.likes))
  } catch (error) {
    next(error)
  }
})

blogController.post('/', async (request, response, next) => {
  try {
    if (!request.token) throw CustomError('Unauthorized', 'Authorization header missing', 401)

    const verifiedToken = authUtils.verifyToken(request.token)
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
    const verifiedToken = authUtils.verifyToken(request.token)
    await authUtils.authorizeUserOperation(verifiedToken.id, Blog.findById(request.params.id))
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogController.put('/:id', async (request, response, next) => {

  const newBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true }).populate('user', { username: 1, name: 1, id: 1 })
    response.json(updatedBlog.toJSON())
  } catch (error) {
    next(error)
  }
})

module.exports = blogController