const { fileUploadSchema } = require('../schemas/file-schemas')
const HttpError = require('../models/error-model')
const {paginationSchema} = require('../schemas/file-schemas')

const validateFileUploadMiddleware = (request, response, next) => {
  try {
    if (!request.file) {
      return next(new HttpError("Missing file", 400))
    }
    
    const dataValidated = fileUploadSchema.parse(request.file)
    request.file = dataValidated // overwrite data only to send to controller dataValidated 

    next()
  } catch (error) {
    if (error.name === "ZodError") {
      return next(new HttpError(JSON.parse(error)[0].message, 400))
    }
    return next(new HttpError(error.message, 400))
  }
}

const validatePaginationMiddleware = (request, response, next) => {
  try {

    const result = paginationSchema.safeParse(request.query)

     if (!result.success) { 
      return next(new HttpError(`Pagination parameters validation failed: ${JSON.parse(result.error)[0].message}`, 400))
    }
    
    request.query = result.data
    
    next()

  } catch (error) {
    return next(new HttpError("An unexpected error occurred during pagination validation.", 500))
  }
}


module.exports = {
  validateFileUploadMiddleware,
  validatePaginationMiddleware
}