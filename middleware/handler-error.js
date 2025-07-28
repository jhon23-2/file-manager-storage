const HttpError = require('../models/error-model')

const handlerErrorMiddleware = (error, request, response, next) => {
  if(error instanceof HttpError) {
    return response.status(error.code).json({error: error.message})
  }
}

module.exports = handlerErrorMiddleware