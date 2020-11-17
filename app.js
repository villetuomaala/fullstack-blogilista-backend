const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const blogController = require('./controllers/blogController')
const userController = require('./controllers/userController')
const loginController = require('./controllers/loginController')
const db = require('./utils/db')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.extractToken)

app.use('/api/blogs', blogController)
app.use('/api/users', userController)
app.use('/api/login', loginController)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app