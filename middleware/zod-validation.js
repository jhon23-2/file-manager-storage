const { fileUploadSchema } = require('../schemas/file-schemas')
const HttpError = require('../models/error-model')

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


module.exports = validateFileUploadMiddleware