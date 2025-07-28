const express = require('express')
const app = express()

const handlerRouterFileManager = require('./router/router')
const handlerErrorMiddleware = require('./middleware/handler-error')
const handlerNotFound = require('./middleware/not-found')

app.disable('x-powered-by')
app.use(express.json())

app.use('/api/v1/file/manager', handlerRouterFileManager)

app.use(handlerErrorMiddleware)
app.use(handlerNotFound)

const port = process.env.PORT || 3000

app.listen(port, console.log(`Listening http://localhost:${port}`))