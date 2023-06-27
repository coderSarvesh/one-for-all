const express = require('express');
const User = require('../models/User');
const router = express.Router();
const {body , validationResult} = require('express-validator');

router.post('/createuser',[
    body('name').isLength({min:3}), //express validator used for cleaning inputs before saving in db
    body('email',"Enter Valid email").isEmail(),
    body('password').isLength({min:5})
] ,async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    let user = await User.findOne({email:req.body.email});
    if (user) {
        return res.status(400).json("uSER already exists");
    }
    user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
    
    .then(user=>res.json(user))
    .catch(error => {console.log(error) 
        res.json("Please enter a unique email")})
})


module.exports = router;