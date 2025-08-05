const HttpError = require('../models/error-model')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')


const validateTokenMiddleware = (request, response, next) => {
  try {
    const { authorization } = request.headers

    if (!authorization || !authorization.startsWith('Bearer')) {
      return next(new HttpError('invalid headers', StatusCodes.BAD_REQUEST))
    }

    const token = authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    request.user = decoded; // wrap inside request an attribute called user (request.user) all controllers will has access to that 
    next();

  } catch (error) {
    return next(new HttpError('an unexpected error ' + error, StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

module.exports = validateTokenMiddleware