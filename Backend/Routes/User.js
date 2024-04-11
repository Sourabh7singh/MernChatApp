const express = require('express');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const User = require('../Models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// Route is /api/user
router.post("/signup",[
    body('email').exists().isEmail(),
    body('name').exists().isLength({min:5}),
    body('username').exists().isLength({min:7}),
    body('password').exists().isLength({min:7})
], async(req, res) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const {name,email,username,password,profile}=req.body;
        //check if user exists if not create one and return the result here
        try {
            let user = await User.findOne({username});
            if(user){
                res.json({ msg:"User Already Exist"})  
            } 
            else{
                //Hash password and then save it
                bcrypt.hash(password, saltRounds, async function(err, hash) {
                    // Store hash in your password DB.
                    const user = await User.create({name,email,username,password:hash,profile})
                    res.json({ msg :"User Registered Successfully"})
                });
            }
        } catch (error) {
            console.log("Error",error);
            res.status(500).json({ msg: "Some error occurred" });
        }
    }
})

router.post("/login",[
    body('username').exists().isLength({min:7}),
    body('password').exists().isLength({min:7})
],async(req,res)=>{
    const {username,password} = req.body;
    try {
        const user = await User.findOne({username})
        if(!user){
            return res.json({msg:"Invalid Credentials",Success:false})
        }
        //compare password using bcrypt
        if(user.password===password){
            res.json({msg:"Login Successfull",Success:true,user:{id:user._id,name:user.name,email:user.email,username:user.username}})
        }
        else{
            res.json({msg:"Invalid Credentials",Success:false})
        }
    } catch (error) {
        console.log("Error",error);
        res.status(500).json({ msg: "Some error occurred",Success:false});
    }
})

router.get("/fetchusers/:userId",async(req,res)=>{
    const {userId} = req.params;
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
module.exports = router;