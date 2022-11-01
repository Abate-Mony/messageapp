const customApiError = require("./custom-error")
class BadErrorRequest extends customApiError {
    constructor(msg) {
        super(msg)
        this.statusCode = 404
    }
}

module.exports = BadErrorRequest