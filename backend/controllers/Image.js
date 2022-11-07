const path = require("path")
const Image = require("../models/Image")
const { BadErrorRequest } = require("../errors/index")
const images = async(req, res) => {


    const GOOGLE_API_FOLDER_ID = "1fVCp7jsPIZmAY4GiHS-AjraRvp839apd"
    const fs = require("fs")
    const { google } = require("googleapis")








    async function uploadFile(file, filename) {
        try {
            const auth = new google.auth.GoogleAuth({
                keyFile: "./googlekey.json",
                scopes: ["https://www.googleapis.com/auth/drive"]
            })
            const driveService = google.drive({
                version: "v3",
                auth
            })
            const fileMethaData = {
                "name": filename,
                "parents": [GOOGLE_API_FOLDER_ID]
            }
            const media = {
                mimType: "image/png",
                body: fs.createReadStream(file)
            }
            const response = await driveService.files.create({
                resource: fileMethaData,
                media: media,
                field: "id"
            })
            return response.data.id
        } catch (error) {
            console.log("upload file error", error)
        }
    }

    const { sentTo } = req.body
    const createdBy = req.userInfo.userId
    console.log(req.body, createdBy)
    if (!sentTo || !createdBy) {
        throw new BadErrorRequest("please provide a sender and reciever id")
    }
    if (req.files) {
        var file = req.files
        var filename = file.file.name
        const fileextension = path.extname(filename)
        const extensions = [".jpeg", ".jpg", ".jfif", ".png"]
        const absolutePath = path.resolve(__dirname, "../Images/")
        return res.send(200)
        if (extensions.includes(fileextension)) {
            const _file_name = Date.now() + filename
            file.file.mv(absolutePath + `\\${_file_name}`, async function(err) {
                if (err) {
                    console.log(err)
                    throw new BadErrorRequest("internal sever error")
                } else {
                    console.log("move to folder")
                    const _file_path = path.resolve(__dirname, "../Images", _file_name)
                    uploadFile(_file_path, `${_file_name}`).then(async(data) => {
                        console.log(data)
                        const image = await Image.create({
                            createdBy: createdBy,
                            sentTo: sentTo,
                            url: `http://www.googledrive.com/uc?view=&id=${data}`
                        })
                        try {
                            fs.unlinkSync(_file_path)
                        } catch (error) {
                            console.log(error)
                        }
                    })
                    return res.status(200).json({ status: true })
                }
            })
        } else {
            // await Image.findOneAndDelete({ _id })
            throw new BadErrorRequest("Please Upload a file with extensions : " + extensions.join(" "))
        }
    } else {
        // await Image.findOneAndDelete({ _id })
        throw new BadErrorRequest("server error")
    }
}
module.exports = images