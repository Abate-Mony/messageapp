module.exports = async(error, req, res, next) => {
    if (error) {
        console.log(error)
        console.log(error.message, "this is the error and the error is the main error")
        res.status(500).json({ msg: error.message })
    }
}