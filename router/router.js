const express = require('express')
const multer = require('multer')
const router = express.Router()

const FileManagerController = require('../controllers/file-controller')
const validateFileUploadMiddleware = require('../middleware/zod-validation')
const validateIdMiddleware = require('../middleware/id-validation')

// upload files in memory to do validation 
const upload = multer({ storage: multer.memoryStorage() })

router.route('/')
  .get(FileManagerController.getAllFiles)
  .post(
    upload.single('file'), // middleware Multer validates file sended with multipart/form-data type 
    validateFileUploadMiddleware, // middleware zod validation so that validates types and how coming file 
    FileManagerController.uploadFile) // controller

router.route('/download/:id')
  .get(
    validateIdMiddleware,
    FileManagerController.downloadFile
  )

router.route('/preview/:id')
  .get(
    validateIdMiddleware,
    FileManagerController.previewFile
  )

router.route('/:id')
  .delete(
    validateIdMiddleware,
    FileManagerController.deleteFile
  )

module.exports = router