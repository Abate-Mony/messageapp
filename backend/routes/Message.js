const router = require("express").Router()
const { messages, createMessage, deleteMessage } = require("../controllers/Message")

router.route("/:id").get(messages).post(deleteMessage)
router.route("/").post(createMessage)
module.exports = router