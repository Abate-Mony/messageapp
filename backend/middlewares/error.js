module.exports = async(error, req, res, next) => {
    if (error) {
        console.log(error)
        res.status(error.statusCode).json({ msg: error.message })
    }
}