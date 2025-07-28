const { z } = require("zod")

// Schema for file upload validation
const fileUploadSchema = z.object({
    originalname: z.string().min(1, "Filename is required").max(255, "Filename too long"),
    mimetype: z.string().min(1, "MIME type is required"),
    size: z
        .number()
        .positive("File size must be positive")
        .max(5 * 1024 * 1024, "File size cannot exceed 5MB"),
    buffer: z.instanceof(Buffer, "File data must be a buffer"),
})


// export upload response and upload request validation
module.exports = {
    fileUploadSchema,
}