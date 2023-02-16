const brcypt = require("bcrypt")
const User = require("../model/userModel")

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username: username })
        if (usernameCheck) {
            return res.status(201).json({ msg: "Username already exists!", status: false })
        }
        const salt = 10;
        const hashedPassword = await brcypt.hash(password, salt)
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })
        delete user.password
        return res.status(201).json({ status: true, user })
    } catch (error) {
        next(error)
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(201).json({ msg: "Incorrect username or password!", status: false })
        }
        const isPasswordValid = await brcypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(201).json({ msg: "Incorrect username or password!", status: false })
        }
        delete user.password
        return res.status(201).json({ status: true, user })
    } catch (error) {
        next(error)
    }
}

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        })
        return res.status(201).json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage })
    } catch (error) {
        next(error)
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "_id",
            "email",
            "username",
            "avatarImage"
        ])
        return res.status(201).json({ users })
    } catch (error) {
        next(error)
    }
}