const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const CustomError = require('../utils/customError')

loginRouter.post('/', async (request, response, next) => {
  try {
    if (!request.body.username) throw CustomError('MissingData', '`username` property not found in request body', 400)
    if (!request.body.password) throw CustomError('MissingData', '`password` property not found in request body', 400)

    const user = await User.findOne({ username: request.body.username })

    const loginSuccess = user === null
      ? false
      : await bcrypt.compare(request.body.password, user.password)
    
    if (!(user && loginSuccess)) response.status(401).json({
      error: 'invalid username or password'
    })

    const userForToken = {
      username: user.username,
      id: user.id,
    }

    const token = await jwt.sign(userForToken, process.env.TOKEN_KEY)

    response.status(200).send({token, username: user.username, name: user.name, id: user.id})
  } catch (error) {
    next(error)
  }
})

module.exports = loginRouter