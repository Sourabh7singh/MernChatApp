const express = require('express');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { configDotenv } = require('dotenv');
configDotenv();
const cloudinary = require('cloudinary').v2;
const Token = require('../Models/Token');
const crypto = require('crypto');
const EmailVerification = require('../Utils/EmailVerification');
const GenerateOtp = require('../Utils/GenerateOtp');
const Code = require('../Models/Code');
const ForgetPass = require('../Utils/ForgetPass');
const { log } = require('console');
const AuthMiddleWare = require('../Middlewares/AuthMiddleWare');
// Return "https" URLs by setting secure: true
cloudinary.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.Cloud_ApiKey,
    api_secret: process.env.Cloud_ApiSecret,
    secure: true
});

router.use(express.static('../public'));

const saltRounds = Number(process.env.SaltRounds);
// Route is /api/user
router.post("/signup", [
    body('email').exists().isEmail(),
    body('name').exists().isLength({ min: 5 }),
    body('username').exists().isLength({ min: 7 }),
    body('password').exists().isLength({ min: 7 })
], async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const { name, email, username, password } = req.body;
        //check if user exists if not create one and return the result here
        try {
            let user = await User.findOne({
                $or: [
                    { email: email },
                    { username: username }
                ]
            });
            if (user) {
                res.json({ msg: "User Already Exist" })
            }
            else {
                bcrypt.hash(password, saltRounds, async function (err, hash) {
                    user = await User.create({ name, email, username, password: hash, profile: `https://avatar.iran.liara.run/public/boy?username=${username}` })
                    const token = await new Token({ userId: user._id, token: crypto.randomBytes(32).toString("hex") }).save();
                    const url = `${process.env.BASE_URL}/api/user/${user._id}/verify/${token.token}`;
                    await EmailVerification(email, user.name, url);
                    res.json({ msg: "An Email has been sent to your account for verification, please Check spam folder if not received in inbox" });
                });
            }
        } catch (error) {
            console.error("Error", error);
            res.status(500).json({ msg: "Some error occurred" });
        }
    }
})


router.post("/login", [
    body('username').exists().isLength({ min: 7 }),
    body('password').exists().isLength({ min: 7 })
], async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.json({ msg: "Invalid Credentials", Success: false })
        }
        //compare password using bcrypt
        bcrypt.compare(password, user.password, async function (err, result) {
            if (result) {
                if (!user.verified) {
                    let token = await Token.findOne({ userId: user._id });
                    if (!token) {
                        token = await new Token({ userId: user._id, token: crypto.randomBytes(32).toString("hex") }).save();
                    }
                    const url = `${process.env.BASE_URL}/api/user/${user._id}/verify/${token.token}`;
                    await EmailVerification(user.email, user.name, url);
                    res.json({ msg: "Verification Link has been sent to your email please verify your account, if not received in inbox please check spam folder", Success: false });
                }
                else {
                    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, username: user.username }, process.env.JWT_SECRET);
                    res.json({ msg: "Login Successful", Success: true, token:token });
                }
            }
            else {
                res.json({ msg: "Invalid Credentials", Success: false })
            }
        });
    } catch (error) {
        console.error("Error", error);
        res.status(500).json({ msg: "Some error occurred", Success: false });
    }
})


router.post("/updateProfile", async (req, res) => {
    try {
        const { id, image } = req.body;
        const result = await cloudinary.uploader.upload(image);
        await User.findByIdAndUpdate(id, { profile: result.secure_url });
        res.json({ msg: "Details updated Successfully", Success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred", Success: false });
    }
})

//Fetch All users except logged in user from DB

router.get("/fetchusers", AuthMiddleWare,async (req, res) => {
    const userId = req.user.id;
    try {
        let Allusers = [];
        let users = await User.find();
        users = users.filter((user) => user._id.toString() !== userId.toString());
        users.forEach((user) => {
            Allusers.push({ id: user._id, name: user.name, username: user.username, profile: user.profile });
        })
        res.json(Allusers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred" });
    }
})

//Fetch logged in user
router.get("/fetchuser/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        res.json({ id: user._id, name: user.name, email: user.email, username: user.username, profile: user.profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred" });
    }
})

//Search Users 
router.get("/searchusers", async (req, res) => {
    try {
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { username: { $regex: req.query.search, $options: "i" } },
            ]
        } : {}
        let users = await User.find(keyword).select("-password");
        let allusers = users.filter((user) => user._id.toString() !== req.query.userId.toString());
        let newusers = allusers.map((user) => ({ id: user._id, name: user.name, username: user.username, profile: user.profile }));
        res.json(newusers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred" });
    }
});

//Email Verification Route
router.get("/:id/verify/:token", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).send("Invalid link");
        }
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        });
        if (!token) {
            return res.status(400).send("Invalid link");
        }
        await User.updateOne({ _id: user._id }, { verified: true });
        await Token.deleteOne({ _id: token._id });
        res.status(200).send("Email verified successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Some error occurred" });
    }
})

//Forget Password
router.get("/resetpassword/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.json({ msg: "User does not exist", Success: false });
        }
        let code = await Code.findOne({ userId: user._id });
        if (code){
            await code.deleteOne();
        }
        code = await new Code({ userId: user._id, code: GenerateOtp() }).save();
        await ForgetPass(user.email, user.name, code.code);
        res.json({ msg: "OTP has been sent to your email address, please Check spam folder if not received in inbox", Success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred", Success: false });
    }
})

router.post("/verifyotp", async (req, res) => {
    const { id, code } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.json({ msg: "User does not exist", Success: false });
        }
        const code1 = await Code.findOne({ userId: user._id });
        if (code1.code == code) {
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({ userId: user._id, token: crypto.randomBytes(32).toString("hex") }).save();
            }
            return res.json({ token: token.token, Success: true });
        }
        else {
            return res.json({ msg: "Invalid code", Success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred", Success: false });
    }
})
// for token create to reset password
router.get("/:id/verifytoken/:token", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).json({ msg: "Invalid link", Success: false });
        }
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        });
        if (!token) {
            return res.status(400).json({ msg: "Invalid link", Success: false });
        }
        res.json({ msg: "Token verified successfully", Success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred", Success: false });
    }
})

router.post('/:id/changepassword/:token', async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
    try {
        const user = await User.findById(id);
        const code = await Code.findOne({ userId: user._id });
        if (!user) {
            return res.status(400).json({ msg: "Invalid link", Success: false });
        }
        const token1 = await Token.findOne({
            userId: user._id,
            token: token
        });
        if (!token1) {
            return res.status(400).json({ msg: "Invalid link", Success: false });
        }

        bcrypt.hash(password, saltRounds, async function (err, hash) {
            await User.updateOne({ _id: user._id }, { password: hash });
        });
        await Token.deleteOne({ userId: user._id });
        await Code.deleteOne({ userId: user._id });
        res.json({ msg: "Password changed successfully", Success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred", Success: false });
    }
})
module.exports = router;