const router = require("express").Router()
const { messages, createMessage, deleteMessage, getMessage, deleteMultipleMessages } = require("../controllers/Message")

router.route("/:id").get(messages).delete(deleteMessage)
router.route("/single/:id").get(getMessage)
router.route("/").post(createMessage).delete(deleteMultipleMessages)
module.exports = router