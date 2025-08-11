const express = require('express')
const app = express()
const validateTokenMiddleware = require('./middleware/token-validation')
const cors = require('cors')
const sequelize = require('./config/db')
require("dotenv").config()
const handlerRouterFileManager = require('./router/router')
const handlerRouterAuthManager = require('./router/auth-routes')

const {FileUpload,User} = require('./models/realationship') // is necesary import but i dont know what is its functions jeje 😁

const handlerErrorMiddleware = require('./middleware/handler-error')
const handlerNotFound = require('./middleware/not-found')

app.disable('x-powered-by')
app.use(express.json())
app.use(cors()) // allow all routes from whatever domain to access this backend application 

app.use('/api/v1/file/manager', validateTokenMiddleware, handlerRouterFileManager)
app.use('/api/v1/auth', handlerRouterAuthManager)

app.use(handlerErrorMiddleware)
app.use(handlerNotFound)



const init = async (port = process.env.PORT || 3000) => {
  try {
    await sequelize.authenticate()
    console.log("DATABSE CONNECTED -> " + process.env.MYSQL_DATABASE + " ✅")

    await sequelize.sync({ alter: true }); // or { force: true } in dev (is like when spin up server tables will be creates and spin down removes)
    console.log("Tables and Relationship creates 📊")

    app.listen(port, console.log(`Listening on ${port} 🦻`))
  } catch (error) {
    console.log(error)
  }
}


init()



