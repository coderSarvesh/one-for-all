const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
var fetchuser = require('../middleware/fetchUser');

//create user
router.post('/createuser', [
    body('name').isLength({ min: 3 }), //express validator used for cleaning inputs before saving in db
    body('email', "Enter Valid email").isEmail(),
    body('password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email }); // checking if user is already present
        if (user) {
            return res.status(400).json("USER already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data ={
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        // console.log(jwtdata)
        res.json({authToken});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})

// Authenticate user
router.post('/login', [ //express validator used for cleaning inputs before saving in db
    body('email', "Enter Valid email").isEmail(),
    body('password', "Cannot be blank").exists()
] , async (req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Internal Server error"});
        }

    const passwordCompare = await bcrypt.compare(password,user.password);
    if(!passwordCompare){
        return res.status(400).json({error:"Try with correct credentials"});
    }
    const data ={
        user:{
            id:user.id
        }
    }
    const authToken = jwt.sign(data,JWT_SECRET);
    res.json({authToken});
    } 
    
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }

})

//user details
router.post('/getuser',fetchuser ,async (req,res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user); 
    } 
    
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }

})

module.exports = router;