const router = require("express").Router()
const image = require("../controllers/Image")
router.route("/").post(image)
module.exports = router