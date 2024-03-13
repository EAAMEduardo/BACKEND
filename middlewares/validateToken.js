const jwb = require("jsonwebtoken")
const TOKEN_KEY = require("../confi")

const authRequired = (req, res, next) => {
    try {
        const {token} = req.cookies

        if(!token) return res.status(400).json(["No token, Unauthorized"])


        jwb.verify(token, TOKEN_KEY, (err, user) => {
            if(err) return res.status(400).json(["invalid token"])

            req.user = user

            next()
        } )
        
      
    } catch (error) {
        console.log(error)
    }
}




module.exports = authRequired 