const { model, Schema } = require("mongoose")

const ImageSchema = new Schema({
    url: {
        type: String,
        require: [true, "please provide an image name"]
    },
    createdBy: {
        type: Schema.ObjectId,
        required: [true, "please an id is needed"],
        ref: "user"
    },
    sentTo: {
        type: Schema.ObjectId,
        required: [true, "please an id is needed"],
        ref: "user"
    }
}, {
    timestamps: true
})
ImageSchema.pre("validate", async function(next) {
    this.url = "https://drive.google.com/uc?exportmview&id=" + this.url
    next()
})
module.exports = model("images", ImageSchema)