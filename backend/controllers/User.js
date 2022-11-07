const User = require("../models/User")
const Message = require("../models/Message")
const Image = require("../models/Image")
const jwt = require("jsonwebtoken")
const { BadErrorRequest, UnethicatedError } = require("../errors/index")

const Users = async(req, res) => {
    const searchvalue = req.params.search
    var users = null
    if (searchvalue === "*") {
        users = await User.find({}, { password: 0, email: 0 }).limit(100)
    } else {
        users = await User.find({
            full_names: {
                $regex: searchvalue,
                $options: "i"
            }
        }, {
            password: 0,
        })
        console.log(users, searchvalue)
    }
    res.status(200).json({
        users
    })
}
const getUsers = async(req, res) => {
    const { userId } = req.userInfo
    const haveText = await Message.find({
        createdBy: userId
    }, {
        sentTo: 1,
        _id: 0,
        createdAt: 1
    })
    const theyHaveTexted = await Message.find({
        sentTo: userId
    }, {
        createdBy: 1,
        _id: 0,
        createdAt: 1

    })
    const _ids = [...theyHaveTexted.map(({ createdBy }) => String(createdBy)), ...haveText.map(({ sentTo }) => String(sentTo))]
    const users = [...new Set(_ids)]
    const userInfo = await Promise.all(
        users.map(user => {
            return User.findOne({ _id: user }, { _id: 1, first_name: 1, second_name: 1 }).then(
                i => i
            )
        })
    )
    const message = await Promise.all(
        users.map((user, index) => {
            return Message.find({ createdBy: userId, sentTo: user }, { message: 1, createdAt: 1, _id: 0 })
                .sort({ createdAt: -1 }).limit(1).then(
                    function(i) {
                        return Message.find({ createdBy: user, sentTo: userId }, { message: 1, createdAt: 1, _id: 0 })
                            .sort({ createdAt: -1 }).limit(1).then(
                                function(j) {
                                    const first = [...i, ...j].sort((a, b) => b.createdAt - a.createdAt).slice(0, 1)[0]
                                    return { message: first.message, createdAt: first.createdAt, name: `${userInfo[index].first_name+" "+userInfo[index].second_name}`, _id: userInfo[index]._id }
                                }
                            )
                    }
                )
        })
    )
    res.json({ users: message.sort((a, b) => b.createdAt - a.createdAt), nHits: message.length, nHits: message.length })
}
const SignUp = async(req, res, next) => {
    const { email, password, first_name, second_name } = req.body
    console.log(req.body)
    const _email = await User.findOne({ email })
    if (_email) {
        throw new UnethicatedError("Email already exist")
    }
    const user = await User.create({ email, password, first_name, second_name })
    const token = jwt.sign({ _id: user._id, email: user.email }, process.env.jwtSecret, { expiresIn: "10d" })
    req.userInfo = {
        files: req.files,
        id: user._id,
        token
    }
    next()
}
const Login = async(req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadErrorRequest(" Please Provide password ,Email")
    }
    var user = await User.findOne({ email })
    if (!user) {
        throw new BadErrorRequest("no corresponding email " + email)
    }
    const decodePassword = await user.comparePassword(password)
    if (!decodePassword) {
        throw new UnethicatedError("password is wrong try again !!!")
    }
    const token = await user.createJWT()
    res.status(200).json({
        userInfo: {
            name: `${user.first_name +user.second_second}`,
            _id: user._id
        },
        token
    })

}
const getUser = async(req, res) => {
    const id = req.params.id
    const { first_name, second_name, createdAt, email, full_names } = await User.findOne({
        _id: id
    }, { first_name: 1, second_name: 1, _id: 0, email: 1, createdAt: 1, full_names: 1 })
    res.status(200).json({
        user_names: {
            first_name,
            second_name,
            full_names
        },
        email,
        createdAt
    })
}

const getUserInfo = async(req, res) => {
    const { userId } = req.userInfo
    const haveText = await Message.find({
        createdBy: userId
    }, {
        sentTo: 1,
        _id: 0,
        createdAt: 1
    })
    const theyHaveTexted = await Message.find({
        sentTo: userId
    }, {
        createdBy: 1,
        _id: 0,
        createdAt: 1

    })

    const haveImage = await Image.find({
        createdBy: userId
    }, {
        sentTo: 1,
        _id: 0,
        createdAt: 1
    })
    const theyHaveImage = await Image.find({
        sentTo: userId
    }, {
        createdBy: 1,
        _id: 0,
        createdAt: 1

    })
    const totalMessages = [...haveText, ...theyHaveTexted, ...theyHaveImage, ...haveImage].length
    const totalMessagesSent = [...haveText].length
    const totalMessagesRecieved = [...theyHaveTexted].length
    const totalImages = [...theyHaveImage, ...haveImage].length
    const totalImagesSent = [...haveImage].length
    const totalImagesRecieved = [...theyHaveImage].length
    res.status(200).json({
        totalMessages,
        totalMessagesSent,
        totalMessagesRecieved,
        totalImagesSent,
        totalImages,
        totalImagesRecieved
    })
}
module.exports = {
    login: Login,
    signup: SignUp,
    getUsers,
    getUser,
    Users,
    getUserInfo
}