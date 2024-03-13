const jwb = require("jsonwebtoken")
const TOKEN_KEY = require("../confi")

function createToken(payload) {

   return new Promise((resolve, reject ) => {

    jwb.sign(
        payload,
        TOKEN_KEY,
    {
        expiresIn: "1d"
    }, (error, token) => {

        if(error) {
            reject(error)
        } else {
            resolve(token)
        }
    })
    })
}

module.exports = createToken