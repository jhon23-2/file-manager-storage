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


const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .refine((val) => val > 0, { message: "Page must be a positive integer" }),

  limit: z
    .string()
    .optional()
    .default("10")
    .transform(Number)
    .refine((val) => val > 0 && val <= 100, { message: "Limit must be between 1 and 100" }),

  direction: z.string()
    .transform(val => val.trim().toUpperCase())
    .pipe(z.enum(['ASC', 'DESC']))
    .default('DESC'),

  orderBy: z.string()
    .transform(val => val.trim().toLowerCase())
    .pipe(z.enum(['name', 'size', 'uploaded_at']))
    .default('uploaded_at')
})


module.exports = {
  fileUploadSchema,
  paginationSchema
}