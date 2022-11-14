 const { model, Schema } = require("mongoose")
 const bcryptjs = require("bcryptjs")
 const jwt = require("jsonwebtoken")
 const UserSchema = new Schema({
     first_name: {
         type: String,
         required: [true, "please provide a name "],
         minLength: 2,
         maxLength: 50
     },
     second_name: {
         type: String,
         required: [true, "please provide a name "],
         minLength: 2,
         maxLength: 50
     },
     full_names: {
         type: String,
         default: "the user name was not provided by the systenm",
     },
     email: {
         type: String,
         required: [true, "please provide an email"],
         match: [
             /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
             'Please provide a valid email',
         ],
         unique: true
     },
     password: {
         type: String,
         required: [true, "please provide a password"],
         minLength: 3,
     }
 }, {
     timestamps: true
 })
 UserSchema.pre("validate", async function(next) {
     const salt = await bcryptjs.genSalt(10);
     this.password = await bcryptjs.hash(this.password, salt);
     this.full_names = this.first_name + " " + this.second_name
     next()
 })

 UserSchema.methods.createJWT = async function() {
     return (jwt.sign({ _id: this._id, email: this.email },
         "myfirstbilliondollar", { expiresIn: "10d" }))
 }
 UserSchema.methods.comparePassword = async function(candidatePassword) {
     const isMatch = await bcryptjs.compare(candidatePassword, this.password)
     return isMatch
 }
 module.exports = model("user", UserSchema)