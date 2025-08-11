const sequelize = require('../config/db')
const { User } = require('../models/realationship')
const HttpError = require('../models/error-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

class UserController {
  static async register(request, response, next) {
    // at this point request.body has been validated
    const { firstName: firstname, lastName: lastname, email, username, password } = request.body

    try {

      const hashedPassword = await bcrypt.hash(password, 10); // 10 -> pow(2, 10) 1024 bytes


      const user = await User.create({
        firstname,
        lastname,
        email,
        username,
        password: hashedPassword
      })

      response.status(StatusCodes.CREATED).json(user)

    } catch (error) {
      return next(new HttpError('an error unexpected ' + error, StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  static async login(request, response, next) {
    // at this point request.body is validated 
    const { email , password } = request.body

    try {
      // validated if user isExist inside database 

      const result = await User.findOne({where: {email}})

      if (!result) {
        return next(new HttpError('user with is not exist ' + email, StatusCodes.NOT_FOUND))
      }

      // validate if password is correct 

      const hashedPassword = result instanceof User ? result.password: null;
      if(!hashedPassword) throw new Error("something went wrong try again");
      

      const isMatch = await bcrypt.compare(password, hashedPassword)
      if (!isMatch) return next(new HttpError('invalid credentials', StatusCodes.BAD_REQUEST))


      // generate token   
      const {id: userId, firstname, lastname, email: username} = result
      const payload = {userId, firstname, lastname, username} 

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