const express = require("express")
const GOOGLE_API_FOLDER_ID = "1fVCp7jsPIZmAY4GiHS-AjraRvp839apd"
const fs = require("fs")
const { google } = require("googleapis")
async function uploadFile() {
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
            "name": "snow.png",
            "parents": [GOOGLE_API_FOLDER_ID]
        }
        const media = {
            mimType: "image/png",
            body: fs.createReadStream('snow.png')
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
// uploadFile().then((data) => {
//     console.log(data)
// })










const serverImage = require("./backend/routes/ServerImages")



require("dotenv").config()
require("express-async-errors")
const path = require("path")
const app = express()
const cors = require("cors")
const whitelist = ["http://localhost:3000", "*"]
const corsOptions = {
    origin: function(origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}
app.use(cors(corsOptions))


const port = process.env.PORT || process.env.port
app.use(express.json())

const auth = require("./backend/middlewares/Auth")
const userRouter = require("./backend/routes/User")
const messageRouter = require("./backend/routes/Message")
const notfound = require("./backend/middlewares/notfound")
const imageUploadRouter = require("./backend/routes/Image")
const error = require("./backend/middlewares/error")
const fileup = require("express-fileupload")
app.use(fileup())
app.use("/auth", userRouter)
app.use("/images", express.static(path.join(__dirname, "backend/Images")))
app.use("/profile/image", express.static(path.join(__dirname, "backend/Profile_pictures")))
app.use("/", serverImage)
app.use("/message", auth, messageRouter)
app.use("/upload", auth, imageUploadRouter)
app.use(express.urlencoded({ extended: false }))
app.use(error)
app.get("/", (req, res) => {
    res.send("hello new user")
})
app.use(notfound)

const start = async() => {
    try {
        const httpServer = app.listen(port, () => {
                console.log("app is running on port " + port)
            })
            // var connectUsers = []
        const WebSocket = require("ws")
        const wss = new WebSocket.Server({ server: httpServer })
        wss.on("connection", function connection(ws) {
            // console.log("new client connected")
            ws.send("welcome new client hahha")
            ws.on("message", function incoming(message) {
                // console.log(message.toString())
                // const userId = message.toString()
                // const regex = /user_id/
                // if (userId.match(regex)) {
                //     const id = userId.split(":")[1]
                //     console.log(id)
                //     if (!connectUsers.includes(message)) {
                //         connectUsers.push(
                //             id
                //         )
                //         console.log("addded to connected users !!!")
                //     }
                // }
                wss.clients.forEach(function each(client) {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(message.toString())
                    }
                })
            })


            // ws.on("LOGIN", function handleLogin() {
            //     console.log("connected with the id and the user aand tg")
            // })

        })


        require("./backend/db/connections")
    } catch (error) {
        console.log(error)
    }
}
start()