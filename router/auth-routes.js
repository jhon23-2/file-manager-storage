const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user-controller')
const { validateUserSchemaMiddleware, loginMiddleware } = require('../middleware/zod-validation')

router.post('/register', validateUserSchemaMiddleware, UserController.register)
router.post('/login', loginMiddleware, UserController.login)

module.exports = router