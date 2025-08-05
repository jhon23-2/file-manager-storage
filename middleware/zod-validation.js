const { fileUploadSchema } = require('../schemas/file-schemas')
const HttpError = require('../models/error-model')
const { paginationSchema } = require('../schemas/file-schemas')
const userSchema = require('../schemas/user-schemas')
const { StatusCodes } = require('http-status-codes')

const validateFileUploadMiddleware = (request, response, next) => {
  try {
    if (!request.file) {
      return next(new HttpError("Missing file", StatusCodes.BAD_REQUEST))
    }

    const dataValidated = fileUploadSchema.parse(request.file)
    request.file = dataValidated // overwrite data only to send to controller dataValidated 

    next()
  } catch (error) {
    if (error.name === "ZodError") {
      return next(new HttpError(JSON.parse(error)[0].message, StatusCodes.BAD_REQUEST))
    }
    return next(new HttpError(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

const validatePaginationMiddleware = (request, response, next) => {
  try {

    const result = paginationSchema.safeParse(request.query)

    if (!result.success) {
      return next(new HttpError(`Pagination parameters validation failed: ${JSON.parse(result.error)[0].message}`, StatusCodes.BAD_REQUEST))
    }

    request.query = result.data

    next()

  } catch (error) {
    return next(new HttpError("An unexpected error occurred during pagination validation.", StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

const validateUserSchemaMiddleware = (request, response, next) => {
  try {

    if (!request.body) {
      return next(new HttpError("Missed body , body must be required", StatusCodes.BAD_REQUEST))
    }

    const result = userSchema.safeParse(request.body)

    if (!result.success) {
      return next(new HttpError(`Body validation error: ${JSON.parse(result.error)[0].message}`, StatusCodes.BAD_REQUEST))
    }

    request.body = result.data

    next()
  } catch (error) {
    if (error.name === "ZodError") {
      return next(new HttpError(JSON.parse(error)[0].message, StatusCodes.BAD_REQUEST))
    }
    return next(new HttpError(error.message, StatusCodes.INTERNAL_SERVER_ERROR))

  }

}

const loginMiddleware = (request, response, next) => {
  if (!request.body) {
    return next(new HttpError("Missed body , body must be required", StatusCodes.BAD_REQUEST))
  }

  try {
    const result = userSchema.partial().safeParse(request.body)

    if (!result.success) {
      return next(new HttpError(`Body validation error: ${JSON.parse(result.error)[0].message}`, StatusCodes.BAD_REQUEST))
    }

    request.body = result.data

    next()
  } catch (error) {
    if (error.name === "ZodError") {
      return next(new HttpError(JSON.parse(error)[0].message, StatusCodes.BAD_REQUEST))
    }
    return next(new HttpError(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

module.exports = {
  validateFileUploadMiddleware,
  validatePaginationMiddleware,
  validateUserSchemaMiddleware,
  loginMiddleware
}