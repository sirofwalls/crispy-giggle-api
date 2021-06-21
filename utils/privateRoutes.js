const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({errorMessage: "Access Denied"});

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const existingUser = await User.findOne({_id: verified.id});
        if (!existingUser) return res.send(400).json({errorMessage: "Access Denied"});
        req.user = verified.id;
        next();
    } catch(err) {
        res.send(400).json({errorMessage: "Access Denied"});
    }
}