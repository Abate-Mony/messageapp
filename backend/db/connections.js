const mongoose = require("mongoose")
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
    // useFindAndModify: false
}
const LOCAL_URI = "mongodb://localhost:27017/MESSAGEAPP"
const uri = "mongodb+srv://messageapp:messageapp@cluster0.tuv2t50.mongodb.net/?retryWrites=true&w=majority"
const connectWithDB = (uri) => {
    mongoose.connect(uri, options, (err, db) => {
        if (err) console.error(err);
        else console.log("database connection")
    })
}
connectWithDB(uri)
module.exports = connectWithDB