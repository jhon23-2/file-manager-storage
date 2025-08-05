const express = require('express')
const app = express()
const validateTokenMiddleware = require('./middleware/token-validation')
const cors = require('cors')
require("dotenv").config()

const handlerRouterFileManager = require('./router/router')
const handlerRouterAuthManager = require('./router/auth-routes')

const handlerErrorMiddleware = require('./middleware/handler-error')
const handlerNotFound = require('./middleware/not-found')

app.disable('x-powered-by')
app.use(express.json())
app.use(cors()) // allow all routes from whatever domain to access this backend application 

app.use('/api/v1/file/manager', validateTokenMiddleware, handlerRouterFileManager)
app.use('/api/v1/auth', handlerRouterAuthManager)

app.use(handlerErrorMiddleware)
app.use(handlerNotFound)

const port = process.env.PORT || 3000

app.listen(port, console.log(`Listening http://localhost:${port}`))