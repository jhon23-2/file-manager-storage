const pool = require('../config/db')
const HttpError = require('../models/error-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

class UserController {
  static async register(request, response, next) {
    // at this point request.body has been validated
    const { firstName, lastName, email, username, password } = request.body

    try {

      const hashedPassword = await bcrypt.hash(password, 10); // 10 -> pow(2, 10) 1024 bytes

      const result = await pool.query('INSERT INTO users (first_name, last_name, email, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, username',
        [firstName, lastName, email, username, hashedPassword])

      response.status(StatusCodes.CREATED).json({
        data: result.rows[0]
      })

    } catch (error) {
      return next(new HttpError('an error unexpected ' + error, StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  static async login(request, response, next) {
    // at this point request.body is validated 
    const { email: username, password } = request.body

    try {
      // validated if user isExist inside database 

      const result = await pool.query('SELECT * FROM users WHERE email=$1', [username])

      if (result.rows.length === 0) {
        return next(new HttpError('user with is not exist ' + username, StatusCodes.NOT_FOUND))
      }

      // validate if password is correct 

      const hashedPassword = result.rows[0].password;
      const isMatch = await bcrypt.compare(password, hashedPassword)

      if (!isMatch) return next(new HttpError('invalid credentials', StatusCodes.BAD_REQUEST))


      // generate token   

      const { id, email, first_name, last_name } = result.rows[0]
      const payload = { id, email, first_name, last_name }

      const jwtToken = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )

      // response token and message 
      response.status(StatusCodes.OK).json({
        message: 'Login successfully',
        token: jwtToken
      })

    } catch (error) {
      return next(new HttpError('an unexpected error ' + error, StatusCodes.INTERNAL_SERVER_ERROR))
    }

  }
}

module.exports = UserController