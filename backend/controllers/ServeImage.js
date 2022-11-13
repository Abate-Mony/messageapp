const fs = require("fs")
const path = require("path")
const serveImage = async(req, res) => {
    const { id } = req.params
    console.log(id)
    const abs = path.resolve(__dirname, "../Profile_pictures")
    fs.readdir(abs, (err, files) => {
        if (err) {
            throw new err
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