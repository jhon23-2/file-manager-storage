const sequelize = require('../config/db')
const HttpError = require('../models/error-model')
const { FileUpload } = require('../models/realationship')
const { StatusCodes } = require('http-status-codes')


class FileManagerController {

  // Buffer is too long fix it
  static async uploadFile(request, response, next) {
    try {

      const { userId } = request.user // this is setted from token validation middleware
      

      if (!userId) return next(new HttpError("userId cannot be null", StatusCodes.BAD_REQUEST ))

      const file = await FileUpload.create({
        ...request.file, // -> At this point, request.file has already been validated by validateFileUpload middleware
        userId
      })

      response.status(StatusCodes.CREATED).json({
        message: "File upload succesfully",
        data: {
          id: file.id,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          userId: file.userId,
          updated_on: file.updated_on,
          created_on: file.created_on
        }
      })

    } catch (error) {
      console.log(error);
      return next(new HttpError(error.message, StatusCodes.BAD_REQUEST))
    }
  }

  static async getAllFiles(request, response, next) {
    try {
      const URL = `${request.protocol}://${request.get('host')}/api/v1/file/manager`; // constans url 

      const { page = 1, limit = 10, orderBy = 'updated_on', direction = 'ASC' } = request.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let totalFiles = null;
      let files, totalPages = null;

      const { count, rows } = await FileUpload.findAndCountAll({
        order: [[orderBy, direction.toUpperCase()]],
        limit: parseInt(limit),
        offset: offset
      });

      totalFiles = count;
      files = rows;
      totalPages = Math.ceil(totalFiles / limit); // total pages files


      // Find all file with pagination params 
      
      const result = await FileUpload.findAll(
        {
          limit: limit,
          offset: offset,
          order: [[orderBy, direction]]
        }
      );
      const data = FileManagerController.getFullResponse(result, totalFiles, page, limit, totalPages, URL)

      // Response ...
      return response.status(StatusCodes.OK).json(data);

    } catch (error) {
      console.error(error);
      return next(new HttpError(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  static async downloadFile(request, response, next) {
    const id = request.params.id

    try {
      const result = await FileUpload.findOne({where: {id}})

      if (!result) {
        return next(new HttpError(`File not Found make sure to send correct id`, StatusCodes.NOT_FOUND))
      }


      response.setHeader("Content-Type", result.mimetype)
      response.setHeader("Content-Disposition", `attachment; filename="${result.name}"`)
      response.send(result.buffer)

    } catch (error) {
      console.log(error);
      return next(new HttpError(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  static async previewFile(request, response, next) {
    const id = request.params.id

    try {
        const result = await FileUpload.findOne({where: {id}})

      if (!result) {
        return next(new HttpError(`File not Found make sure to send correct id`, StatusCodes.NOT_FOUND))
      }

      response.setHeader("Content-Type", result.mimetype)
      response.setHeader("Content-Disposition", `inline; filename="${result.name}"`)
      response.send(result.buffer)

    } catch (error) { 
      console.log(error);
      return next(new HttpError(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }

  static async deleteFile(request, response, next) {
    const id = request.params.id

    try {
      const result = await FileUpload.findOne({where: {id}})

      if (!result) {
        return next(new HttpError(`File not Found make sure to send correct id`, StatusCodes.NOT_FOUND))
      }

      await result.destroy() // remove file found 

      return response.status(StatusCodes.OK).json({
        message: `File deleted ${id} successfully`
      })
    } catch (error) {
      console.log(error);
      return next(new HttpError(error.message, StatusCodes.INTERNAL_SERVER_ERROR))
    }
  }


  // tool for to get full data 
  static getFullResponse(data = [], totalFiles, page, limit, totalPages, url) {
    return {
      amount: data.length,
      data: data.map(file => ({
        id: file.id,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        created_on: file.created_on,
        updated_on: file.updated_on,
        downloadUrl: `${url}/download/${file.id}`,
        previewUrl: `${url}/preview/${file.id}`,
      })),
      pagination: {
        totalFiles,
        currentPage: page,
        limit,
        totalPages
      }
    }
  }


}

module.exports = FileManagerController
