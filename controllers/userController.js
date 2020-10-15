const userController = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const CustomError = require('../utils/customError')

userController.post('/', async (request, response, next) => {
  try {
    if (!request.body.password) 
      throw CustomError('MissingData', '`password` property not found in request body', 400)

    const user = new User({
      username: request.body.username,
      name: request.body.name,
      password: await bcrypt.hash(request.body.password, 10)
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

userController.get('/', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.status(200).json(users)
  } catch (error) {

  }
})

module.exports = userController