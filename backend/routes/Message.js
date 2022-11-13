const router = require("express").Router()
const { messages, createMessage, deleteMessage, getMessage } = require("../controllers/Message")

router.route("/:id").get(messages).post(deleteMessage)
router.route("/single/:id").get(getMessage)
router.route("/").post(createMessage)
module.exports = router