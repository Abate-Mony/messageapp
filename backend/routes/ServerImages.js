const serveImage = require("../controllers/ServeImage")
const router = require("express").Router()
router.route("/profile/:id").get(serveImage)
module.exports = router