const handlerNotFound = (request, response) => {
  return response.status(404).json({
    path: `Path url not found ${request.originalUrl}`
  })
}

module.exports = handlerNotFound