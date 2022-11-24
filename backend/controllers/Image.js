const path = require("path")
const Image = require("../models/Image")
const { BadErrorRequest, UnethicatedError } = require("../errors/index")

const GOOGLE_API_FOLDER_ID = "1fVCp7jsPIZmAY4GiHS-AjraRvp839apd"
const fs = require("fs")
const { google } = require("googleapis")
const images = async(req, res) => {

    async function uploadFile(file_name, file_path) {
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
                "name": file_name,
                "parents": [GOOGLE_API_FOLDER_ID]
            }
            const media = {
                mimType: "image/png",
                body: fs.createReadStream(file_path)
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















    const createdBy = req.userInfo.userId
    const { sentTo } = req.body
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
            file.file.mv(absolutePath + `\\${filename}`, async function(err) {
                if (err) {
                    console.log(err)
                    throw new BadErrorRequest("internal sever error")
                } else {
                    console.log("move to folder")
                    const file_path = path.join(absolutePath, filename)
                    uploadFile(filename, file_path).then(async(data) => {
                        console.log(data)
                        if (!data) {
                            const error = new Error("fail to save the image ")
                            error.statusCode = 500
                            throw new error
                        }
                        console.log("move into google drive folder !!")
                        const image = await Image.create({
                            createdBy: createdBy,
                            sentTo: sentTo,
                            url: data
                        })

                        if (image) {
                            try {
                                fs.unlinkSync(file_path)
                                console.log("delete file successfully !!")
                            } catch (error) {
                                console.log("fail to delete file")
                                console.log(error)
                            }
                        }
                        return res.status(200).json({ status: true })

                    })
                }
            })
        } else {
            throw new BadErrorRequest("Please Upload a file with extensions : " + extensions.join(" "))
        }
    } else {
        throw new BadErrorRequest("server error")
    }
}
module.exports = images