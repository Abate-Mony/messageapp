const Auth = require("../middlewares/Auth")
const { login, signup, getUsers, getUser, Users, getUserInfo } = require("../controllers/User")
const router = require("express").Router()
const uploads = require("../controllers/Profile")
router.route("/login").post(login)
router.route("/signup").post(signup, uploads)
router.route("/users").get(Auth, getUsers)
router.route("/allusers/:search").get(Users)
router.route("/user/:id").get(getUser)
router.route("/userinfo").get(Auth, getUserInfo)
module.exports = router