const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Post = require('../models/Post');
const {updateValidation} = require('../utils/validation');
const verify = require('../utils/privateRoutes');
const mongoose = require('mongoose');

//UPDATE THE USER
router.put('/:id', verify, async (req, res) => {
    const validUser = req.user._id;

    const validID = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!validID) return res.status(404).json("That is not a valid ID");

    const foundUser = await User.findById(req.params.id);
    if(!foundUser) return res.status(404).json("That user cannot be found");

    const canEdit = (validUser === req.params.id);
    if(!canEdit) return res.status(401).json("You can only edit your own account!");

    const {error} = updateValidation(req.body);
    if(error) return res.status(400).json(error.details[0].message);

    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true});
        const {password, ...others} = updatedUser._doc;
        res.status(200).json(others);
    } catch(err) {
        res.status(500).jason(err)
    }
});

//DELETE USER
router.delete('/:id', verify, async (req, res) => {
    const validUser = req.user._id;

    const validID = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!validID) return res.status(404).json("That is not a valid ID");

    const foundUser = await User.findById(req.params.id);
    if(!foundUser) return res.status(404).json("That user cannot be found");

    const canEdit = (validUser === req.params.id);
    if(!canEdit) return res.status(401).json("You can only edit your own account!");

    try{
        await Post.deleteMany({author: foundUser.username});
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User and posts have been deleted");
    } catch(err) {
        res.status(500).jason(err)
    }
    
});

//GET SINGLE USER
router.get('/:id', async (req, res) =>{
    const validID = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!validID) return res.status(404).json("That is not a valid ID");

    try{
        const foundUser = await User.findById(req.params.id);
        if(!foundUser) return res.status(404).json("That user cannot be found");

        const {password, ...others} = foundUser._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).jason(err)
    }
});

module.exports = router;