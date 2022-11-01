const path = require("path")
const User = require("../models/User")
const { BadErrorRequest } = require("../errors/index")
const uploads = async(req, res) => {
    const id = req.userInfo.id
    const token = req.userInfo.token
    const file = req.userInfo.files || req.files
    if (file) {
        var filename = file.file.name
        const fileextension = path.extname(filename)
        const extensions = [".jpeg", ".jpg", ".jfif", ".png"]
        const absolutePath = path.resolve(__dirname, "../Profile_pictures")
        if (extensions.includes(fileextension)) {
            file.file.mv(absolutePath + `\\${id}${fileextension}`, function(err) {
                if (err) {
                    console.log(err)
                    throw new BadErrorRequest("internal sever error")
                } else {
                    console.log("move to folder")
                    return res.status(200).json({
                        token,
                        _id: id
                    })
                }
            })
        } else {
            await User.findOneAndDelete({ _id: id })
            throw new BadErrorRequest("Please Upload a file with extensions : " + extensions.join(" "))
        }
    } else {
        await User.findOneAndDelete({ _id: id })
        throw new BadErrorRequest("server error")
    }
}
module.exports = uploads