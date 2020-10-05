const blogController = require('express').Router()
const Blog = require('../models/blog')

blogController.get('/', (request, response, next) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})

blogController.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  if (!blog.likes) blog.likes = 0;

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

blogController.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }

})

module.exports = blogController