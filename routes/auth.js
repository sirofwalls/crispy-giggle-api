const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../utils/validation');

//REGISTER THE USER
router.post('/register', async (req, res) => {

    const {error} = registerValidation(req.body);
    if(error) return res.status(400).json(error.details[0].message);

    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).json({message: 'A User with that email already exists'});

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashPass
    })

    try{
        const user = await newUser.save();
        const {password, ...others} = user._doc;
        res.status(200).json(others)
    } catch (err) {
        res.status(500).json(err)
    }
});

//LOGIN THE USER (JWT ADDED)
router.post('/login', async (req, res) =>{
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).json(error.details[0].message);

    const user = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).json({message: "The login credentials are wrong"});

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(401).json({message: "The login credentials are wrong"});

    try {
        const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        res.header('auth-token', token).json({message:"You are now logged in!", token});
    } catch(err) {
        res.status(500).json(err);
    }
})


module.exports = router;
