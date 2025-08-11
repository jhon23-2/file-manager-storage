const sequelize = require('../config/db')
const HttpError = require('../models/error-model')
const { FileUpload } = require('../models/realationship')
const { StatusCodes } = require('http-status-codes')


class FileManagerController {

  // Buffer is too long fix it
  static async uploadFile(request, response) {
    try {

      const { userId } = request.user

      if (!userId) return response.status(StatusCodes.BAD_REQUEST).json({ error: "userId cannot be null" })

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
      return response.status(500).json({ error: error.message })
    }
  }

  static async getAllFiles(req, res) {
    try {
      const URL = `${req.protocol}://${req.get('host')}/api/v1/file/manager`; // constans url 

      const { page = 1, limit = 10, orderBy = 'updated_on', direction = 'ASC' } = req.query;
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

      const result = await FileUpload.findAll();
      const data = FileManagerController.getFullResponse(result, totalFiles, page, limit, totalPages, URL)

      // Response ...
      return res.status(200).json(data);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  static async downloadFile(request, response, next) {
    const id = request.params.id

    try {
      const result = await pool.query("SELECT name, mimetype, data FROM files WHERE id = $1", [id])

      if (result.rows.length === 0) {
        return next(new HttpError(`File not Found make sure to send correct id`, 404))
      }

      const file = result.rows[0]

      response.setHeader("Content-Type", file.mimetype)
      response.setHeader("Content-Disposition", `attachment; filename="${file.name}"`)
      response.send(file.data)

    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: error.message })
    }
  }

  static async previewFile(request, response, next) {
    const id = request.params.id

    try {
      const result = await pool.query("SELECT name, mimetype, data FROM files WHERE id = $1", [id])

      if (result.rows.length === 0) {
        return next(new HttpError(`File not Found make sure to send correct id`, 404))
      }

      const file = result.rows[0]

      response.setHeader("Content-Type", file.mimetype)
      response.setHeader("Content-Disposition", `inline; filename="${file.name}"`)
      response.send(file.data)

    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: error.message })
    }
  }

  static async deleteFile(request, response, next) {
    const id = request.params.id

    try {
      const result = await pool.query("SELECT name, mimetype, data FROM files WHERE id = $1", [id])

      if (result.rows.length === 0) {
        return next(new HttpError(`File not Found make sure to send correct id`, 404))
      }

      await pool.query("DELETE FROM files WHERE id = $1", [id])

      return response.status(200).json({
        message: `File deleted ${id} successfully`
      })
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: error.message })
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
