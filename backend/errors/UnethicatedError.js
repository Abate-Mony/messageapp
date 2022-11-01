const customApiError = require("./custom-error")
class UnethicatedError extends customApiError {
    constructor(msg, statusCode) {
        super(msg)
        this.statusCode = 401
    }
}
module.exports = UnethicatedError