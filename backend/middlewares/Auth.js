const jwt = require("jsonwebtoken")
const { BadErrorRequest, UnethicatedError } = require("../errors/index")
const auth = async(req, res, next) => {
    // console.log()
    const authHeader = req.headers.authorization
    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith("doris")) {
        throw new BadErrorRequest("bad token ")
    }
    const token = authHeader.split(" ")[1]

    try {
        const payload = await jwt.verify(token, process.env.jwtSecret)
        const { _id, email } = payload
        req.userInfo = {
            userId: _id,
            email
        }
        next()
    } catch (error) {
        throw new error
    }
}
module.exports = auth