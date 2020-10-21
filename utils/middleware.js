const logger = require('./logger')

const requestLogger = (request, response, next) => {
  if (request.body.hasOwnProperty('password')) request.body.password = '***secret***'

  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


const errorHandler = (error, request, response, next) => {
  if (process.env.NODE_ENV !== 'test') logger.error(error.message)
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MissingData') {
    return response.status(error.status).json({error: error.message})
  }

  next(error)
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }