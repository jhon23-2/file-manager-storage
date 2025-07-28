const HttpError = require('../models/error-model')

const validateIdMiddleware = (request, response, next) => {
  const fileId = request.params.id
  const numId = Number.parseInt(fileId, 10)

  if (isNaN(numId) || numId <= 0) {
    return next(new HttpError("Invalid file ID. ID must be a positive integer.", 400))
  }

  next()
}

module.exports = validateIdMiddleware