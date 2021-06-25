const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
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
        res.status(200).json({message: 'You have been regitered.'})
    } catch (err) {
        res.status(500).json({errorMessage: 'There was an error. Contact the developer.'})
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
        const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET);
        res.status(200).cookie('token', token,
        {httpOnly: true,
        sameSite: process.env.ENV_DEVELOPMENT === 'true' ?'lax' : 'none',
        secure: process.env.ENV_DEVELOPMENT === 'true' ? false : true}).json({message:"You are now logged in!"});
    } catch(err) {
        res.status(500).json(err);
    }
});

//Check if logged In properly
router.get('/loggedIn', (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) return res.json(null);
        const validUser = jwt.verify(token, process.env.JWT_SECRET);
        res.json(validUser.id)
    } catch (err) {
        return res.json(null)
        
    }
});

//Logout by sending empty replacement cookie that is expired
router.get('/logout', (req, res) => {
    try {
        res.status(200).cookie('token', '',
            {httpOnly: true,
            sameSite: process.env.ENV_DEVELOPMENT === 'true' ? 'lax' : 'true',
            secure: process.env.ENV_DEVELOPMENT === 'true' ? false : true,
            expires: new Date(0)}).json({message: 'You have been logged out!'})
    } catch (err) {
        return res.json(null);
    }
})


module.exports = router;
