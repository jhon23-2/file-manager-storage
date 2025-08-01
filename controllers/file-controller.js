const pool = require('../config/db')
const HttpError = require('../models/error-model')

class FileManagerController {

  static async uploadFile(request, response) {
    try {
      // At this point, request.file has already been validated by validateFileUpload middleware
      const { originalname, mimetype, size, buffer } = request.file

      const result = await pool.query(
        "INSERT INTO files (name, mimetype, size, data) VALUES ($1, $2, $3, $4) RETURNING id, name, mimetype, size",
        [originalname, mimetype, size, buffer],
      )

      return response.status(201).json({
        message: "File uploaded successfully",
        data: result.rows[0]
      })

    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: error.message })
    }
  }

  static async getAllFiles(request, response) {

    try {
      const result = await pool.query("SELECT id,name, mimetype, size, uploaded_at FROM files")

      return response.status(200).json({
        amount: result.rowCount,
        data: result.rows?.map(file => {
          return {
            ...file,
            downloadUrl: `${request.protocol}://${request.get('host')}/api/v1/file/manager/download/${file.id}`,
            previewUrl: `${request.protocol}://${request.get('host')}/api/v1/file/manager/preview/${file.id}`,
          }
        })
      })
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: error.message })
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

}

module.exports = FileManagerController