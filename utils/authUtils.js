const jwt = require('jsonwebtoken')
const CustomError = require('../utils/customError')

const verifyToken = token => {
  if (!token) throw CustomError('Unauthorized', 'Authorization token missing', 401)
  const verifiedToken = jwt.verify(token, process.env.TOKEN_KEY)
  if (!verifiedToken.id) throw CustomError('Unauthorized', 'Invalid token', 401)
  return verifiedToken
}

const authorizeUserOperation = async (requestUserId, findOperation) => {
  const object = await findOperation
  if (!object)
    throw CustomError('NoDataFound', 'No data found', 404)
  if (requestUserId.toString() !== object.user.toString())
    throw CustomError('PermissionDenied', 'User is not authorized to access requested object', 401)
  return true
}

module.exports = {
  verifyToken, authorizeUserOperation
}