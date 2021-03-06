const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const {newPostValidation, updatePostValidation} = require('../utils/validation');
const verify = require('../utils/privateRoutes');
const mongoose = require('mongoose');

//CREATE NEW POST
router.post('/', verify, async (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({errorMessage: "You are not logged in"});
    const validUser = jwt.verify(token, process.env.JWT_SECRET);
    const postiInfo =  {author:validUser.id, ...req.body};

    const {error} = newPostValidation(postiInfo);
    if(error) return res.status(400).json(error.details[0].message);

    const newPost = new Post(postiInfo);

    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch(err) {
        if (err.code === 11000) return res.status(400).json({message:"A Post with that title already exists"});
        res.status(500).json(err);
    }
});

//UPDATE POST
router.put('/:id', verify, async (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({errorMessage: "You are not logged in"});
    const validUser = jwt.verify(token, process.env.JWT_SECRET);

    const validID = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!validID) return res.status(404).json({message: "That is not a valid ID"});

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({message:"That post cannot be found"});

    const canEdit = (validUser.id.toString() === post.author.toString());
    
    if(!canEdit) return res.status(401).json({message: "You can only edit your own post!"});

    const {error} = updatePostValidation(req.body);
    if(error) return res.status(400).json(error.details[0].message);

    try{
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
            $set:req.body
        }, {new: true});
        res.status(200).json(updatedPost);
    } catch(err) {
        res.status(500).json(err);
    }
});

//DELETE A POST
router.delete('/:id', verify, async (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({errorMessage: "You are not logged in"});
    const validUser = jwt.verify(token, process.env.JWT_SECRET);

    const validID = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!validID) return res.status(404).json({message: "That is not a valid ID"});
    
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({message:"That post cannot be found"});

    const canEdit = (validUser.id.toString() === post.author.toString());
    if(!canEdit) return res.status(401).json({message:"You can only delete your own posts!"});

    try{
        await post.delete();
        res.status(200).json({message: "The post has been deleted"});
    } catch(err) {
        res.status(500).json(err);
    }
});

//GET A SINGLE POST
router.get('/:id', async (req, res) => {
    try{
        const validID = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!validID) return res.status(404).json({message: "That is not a valid ID"});
        
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({message:"That post cannot be found"});

        res.status(200).json(post);
    } catch(err) {
        res.status(500).json(err);
    }
});

//GET ALL POSTS WITH AUTHOR AND CATEGORY CONDITION OPTION
router.get('/', async (req, res) => {
    const author = req.query.author;
    const category = req.query.cat;

    try{
        let posts;

        if(author) posts = await Post.find({author});
        if(category) posts = await Post.find({categories:{$in:[category]}});
        if (!author && !category) posts = await Post.find();
        
        res.status(200).json(posts);
    } catch(err) {
        res.status(500).json(err);
    }
});


module.exports = router;