const User = require("../models/User")
const Message = require("../models/Message")
const jwt = require("jsonwebtoken")
const { BadErrorRequest, UnethicatedError } = require("../errors/index")

const Users = async(req, res) => {
    const searchvalue = req.params.search
    var users = null
    if (searchvalue === "*") {
        users = await User.find({}, { name: 1, _id: 1 }).limit(100)
    } else {
        users = await User.find({
            name: {
                $regex: searchvalue,
                $options: "i"
            }
        })
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
            return User.findOne({ _id: user }, { _id: 1, name: 1 }).then(
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
                                    return { message: first.message, createdAt: first.createdAt, name: userInfo[index].name, _id: userInfo[index]._id }
                                }
                            )
                    }
                )
        })
    )
    res.json({ users: message.sort((a, b) => b.createdAt - a.createdAt), nHits: message.length })
}
const SignUp = async(req, res, next) => {
    const { email, password, password1, name } = req.body
    console.log(req.body, req.files)
    const _email = await User.findOne({ email })
    if (_email) {
        throw new BadErrorRequest("email already exist")
    }
    const user = await User.create({ email, password, name })
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
        throw new BadErrorRequest(" please password ,email is needed")
    }
    var user = await User.findOne({ email })
    if (!user) {
        throw new BadErrorRequest("no corresponding email " + email)
    }
    const decodePassword = await user.comparePassword(password)
    if (!decodePassword) {
        throw new UnethicatedError("password is wrong try again later")
    }
    const token = await user.createJWT()
    res.status(200).json({
        userInfo: {
            name: user.name,
            _id: user._id
        },
        token
    })

}
const getUser = async(req, res) => {
    const id = req.params.id
    const user = await User.findOne({
        _id: id
    }, { name: 1, _id: 0 })
    res.status(200).json(user)
}
module.exports = {
    login: Login,
    signup: SignUp,
    getUsers,
    getUser,
    Users
}