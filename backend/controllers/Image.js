const path = require("path")
const Image = require("../models/Image")
const { BadErrorRequest } = require("../errors/index")
const images = async(req, res) => {
    const createdBy = req.userInfo.userId
    const { sentTo } = req.body
    console.log(req.body)
    if (!sentTo || !createdBy) {
        throw new BadErrorRequest("please provide a sender and reciever id")
    }
    if (req.files) {
        var file = req.files
        var filename = file.file.name
        const fileextension = path.extname(filename)






        const extensions = [".jpeg", ".jpg", ".jfif", ".png"]
        const absolutePath = path.resolve(__dirname, "../Images/")

        if (extensions.includes(fileextension)) {
            const image = await Image.create({
                createdBy: createdBy,
                sentTo: sentTo,
                name: fileextension
            })
            const _id = image._id

            file.file.mv(absolutePath + `\\${_id}${fileextension}`, async function(err) {
                if (err) {
                    console.log(err)
                    await Image.findOneAndDelete({ _id })
                    throw new BadErrorRequest("internal sever error")
                } else {
                    const _file_name = _id + fileextension
                    console.log("move to folder")
                    return res.status(200).json({ status: true })
                }
            })
        } else {
            await Image.findOneAndDelete({ _id })
            throw new BadErrorRequest("Please Upload a file with extensions : " + extensions.join(" "))
        }
    } else {
        await Image.findOneAndDelete({ _id })
        throw new BadErrorRequest("server error")
    }
}
module.exports = images