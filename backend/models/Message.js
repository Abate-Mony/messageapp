const { model, Schema } = require("mongoose")


const MessageSchema = new Schema({
    createdBy: {
        type: Schema.ObjectId,
        required: [true, "please an id is needed"],
        ref: "user"
    },
    message: {
        type: String,
        required: [true, "please provide an email"],
    },
    sentTo: {
        type: Schema.ObjectId,
        required: [true, "please an id is needed"],
        ref: "user"
    }
}, {
    timestamps: true
})
module.exports = model("message", MessageSchema)