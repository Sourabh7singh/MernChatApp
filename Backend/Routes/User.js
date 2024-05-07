const express = require('express');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const User = require('../Models/User');
const bcrypt = require('bcrypt');
const { configDotenv } = require('dotenv');
const cloudinary = require('cloudinary').v2;
// Return "https" URLs by setting secure: true
cloudinary.config({
    cloud_name: process.env.Cloud_name,
    api_key: process.env.Cloud_ApiKey,
    api_secret: process.env.Cloud_ApiSecret,
    secure: true
});
configDotenv();
const saltRounds = 10;
// Route is /api/user
router.post("/signup", [
    body('email').exists().isEmail(),
    body('name').exists().isLength({ min: 5 }),
    body('username').exists().isLength({ min: 7 }),
    body('password').exists().isLength({ min: 7 })
], async (req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const { name, email, username, password, profile } = req.body;
        //check if user exists if not create one and return the result here
        try {
            let user = await User.findOne({ username });
            if (user) {
                res.json({ msg: "User Already Exist" })
            }
            else {
                //Hash password and then save it
                bcrypt.hash(password, saltRounds, async function (err, hash) {
                    // Store hash in your password DB.
                    const user = await User.create({ name, email, username, password: hash, profile })
                    res.json({ msg: "User Registered Successfully" })
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
        bcrypt.compare(password,user.password, function(err, result) {
            if (result) {
                res.json({ msg: "Login Successfull", Success: true, user: { id: user._id, name: user.name, email: user.email, username: user.username } })
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
    const {id, image } = req.body;
    // return console.log(id,image);
    try {
        const result = await cloudinary.uploader.upload(image);
        await User.findByIdAndUpdate(id, { profile: result.secure_url });
        res.json({ msg: "Profile Updated Successfully", Success: true});
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Some error occurred", Success: false });
    }
})
router.get("/fetchusers/:userId", async (req, res) => {
    const { userId } = req.params;
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

module.exports = router;