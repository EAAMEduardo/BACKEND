const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body)
        next()
    } catch (error) {
        res.status(401).json([error.errors.map(e=> {
            return e.message
        })])
        console.log(error.errors.message)
         }
    }



module.exports = validateSchema