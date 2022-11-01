const router = require("express").Router()
const uploads = require("../controllers/Profile")
router.route("/").post(uploads)
module.exports = router