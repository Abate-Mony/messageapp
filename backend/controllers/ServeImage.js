const fs = require("fs")
const path = require("path")
    // import {BadRequestError} from '../errors'
const { BadErrorRequest } = require("../errors/index")

const serveImage = async(req, res) => {
    const { id } = req.params
    return res.status(404).json({ status: false })
        // console.log(id)
    const abs = path.resolve(__dirname, "../Profile_pictures")
    fs.readdir(abs, (err, files) => {
        if (err) {
            throw new BadErrorRequest("something went wrong !!!")
        }
        var myfile = null
        for (let file of files) {
            if (file.includes(id)) {

                myfile = file
                break
            }
        }
        if (!myfile) {
            return res.status(404).json({ fail: "" })
        }
        res.status(200).json({
            image: myfile
        })
    })

}
module.exports = serveImage