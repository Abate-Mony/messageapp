const User = require("../models/User")
const Message = require("../models/Message")
const { BadErrorRequest } = require("../errors/index")
const Image = require("../models/Image")
const createMessage = async(req, res) => {
    const { userId } = req.userInfo
    const { sentTo, message } = req.body
    const isSentTo = await User.findOne({ _id: sentTo })
    if (!isSentTo) {
        throw new BadErrorRequest("there use does not exist in the dataase")
    }
    const object = {
        createdBy: userId,
        message,
        sentTo
    }
    const _message = await Message.create({...object })
    res.status(200).json({ message: _message })
}
const deleteMessage = async(req, res) => {
    const { userId } = req.userInfo
    const { id } = req.params

    const message = await Message.deleteOne({ createdBy: userId, _id: id })
    if (!message) {
        throw new BadErrorRequest("fail to delete message with id " + id)
    }
    console.log(message)
    res.status(200).json({ status: true })

}

const deleteMultipleMessages = async(req, res) => {
    const { list } = req.body
    if (!(list && list.length >= 1)) {
        if (list == null) {
            throw new BadErrorRequest("send a truthy value ")
        }
        throw new BadErrorRequest("list must be greater than or equals to zero but got ")
    }
    console.log(list)

    const deleteallselectedmessage = await Promise.all(
            list.map((item) => {
                return Message.findOneAndDelete({ _id: item }).then((data) => data).catch(error => `${error} fail to delete message with id : ${item}`)
            })
        )
        // console.log(deleteallselectedmessage)
    return res.status(200).json({ status: true })
}




const messages = async(req, res) => {
    const { userId } = req.userInfo
    const { id } = req.params
        // console.log(userId,id)
    const message = await Message.find({ createdBy: userId, sentTo: id })
    const _message = await Message.find({ createdBy: id, sentTo: userId })
    const image = await Image.find({ createdBy: id, sentTo: userId })
    const _image = await Image.find({ createdBy: userId, sentTo: id })
    const images = await Image.find({})
        // console.log([..._image, ...image].length)
    const user_messages = [...message, ..._message, ...image, ..._image].sort((a, b) => a.createdAt - b.createdAt)

    // send the users 100 message to help the frontend bread
    res.status(200).json({
        message: user_messages,
        nHits: user_messages.length
    })
}
const getMessage = async(req, res) => {
    const _id = req.params.id
    const message = await Message.find({ _id }, { message: 1, _id: 0 })
    if (!message) {
        res.status(404).json({ fail: "fail" })
        return
    }
    res.status(200).json({ message })
}
module.exports = {
    messages,
    deleteMessage,
    createMessage,
    getMessage,
    deleteMultipleMessages
}