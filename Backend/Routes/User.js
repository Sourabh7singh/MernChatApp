const express = require('express');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const User = require('../Models/User');

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
                return res.json({ msg:"User Already Exist"})  
            } 
            //Hash password and then save it
            user = await User.create({name,email,username,password,profile})
            user.save();
            return res.json({ msg :"User Registered Successfully"});
        } catch (error) {
            console.log("Error",error);
            res.status(500).json({ msg: "Some error occurred" });
        }
    }
    console.log(result);
    res.json({"msg":"Some Error occured"})
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

module.exports = router;