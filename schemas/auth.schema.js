const {z} = require("zod")


const registerSchema = z.object({
    username : z.string({
        required_error: "Username is required"
    }),

    email: z.string({
        required_error: "email is required"
    }).email({
        message: "invalid email"
    }),

    password: z.string({
        required_error: "password is required"
    }).min(7 , {
        message: "Password must contain at least 7 characters"
    })
})


const loginSchema = z.object({
    email: z.string({
        required_error: "username is required"
    }).email({
        message: "invalid email"
    }),

    password: z.string({
        required_error: "password is required"
    }).min(7, {
        message: "password must contain at least 7 characters"
    })
})


module.exports = {
    registerSchema,
    loginSchema
}