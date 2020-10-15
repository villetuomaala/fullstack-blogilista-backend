const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const blogController = require('./controllers/blogController')
const userController = require('./controllers/userController')
const db = require('./utils/db')

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogController)
app.use('/api/users', userController)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app