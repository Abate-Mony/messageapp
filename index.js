const express = require("express")
require("dotenv").config()
require("express-async-errors")
const path = require("path")
const app = express()
const port = process.env.PORT || process.env.port
app.use(express.json())
const cors = require("cors")
app.use(cors())
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
app.use("/profile", express.static(path.join(__dirname, "backend/Profile_pictures")))
    // app.use("/dashboard", express.static(path.join(__dirname, "public")))

app.use("/message", auth, messageRouter)
app.use("/upload", imageUploadRouter)
app.use(express.urlencoded({ extended: false }))
    // app.get("/", (req, res) => {
    //     res.send("hello new user")
    // })
app.use(notfound)

const start = async() => {
    try {
        const httpServer = app.listen(port, () => {
            console.log("app is running on port " + port)
        })
        const WebSocket = require("ws")
        const wss = new WebSocket.Server({ server: httpServer })
        wss.on("connection", function connection(ws) {
            // console.log("new client connected")
            ws.send("welcome new client hahha")
            ws.on("message", function incoming(message) {
                wss.clients.forEach(function each(client) {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(message.toString())
                    }
                })
            })
        })

        require("./backend/db/connections")
    } catch (error) {
        console.log(error)
    }
}
start()