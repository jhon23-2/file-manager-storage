const { z } = require("zod")

const userSchema = z.object({
  firstName:
    z.string()
      .trim()
      .min(2, "First name is required")
      .max(100, "First name is too long"),
  lastName:
    z.string()
      .trim()
      .min(2, "Last name is required")
      .max(100, "Last name is too long"),
  email:
    z.email("Email is not valid")
      .trim()
      .min(2, "Email is required")
      .max(100, "email is too long"),
  username:
    z.string()
      .trim()
      .min(2, "Username is required")
      .max(100, "Username is too long"),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
})

module.exports = userSchema