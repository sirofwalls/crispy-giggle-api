const router = require('express').Router();
const Category = require('../models/Category');
const {newCategoryValidation} = require('../utils/validation');

//SAVE NEW CATEGORY (can only save one at a time currently)
router.post('/', async (req, res) => {

    const {error} = newCategoryValidation(req.body);
    if(error) return res.status(400).json(error.details[0].message);

    const foundCat = await Category.findOne({name:req.body.name});
    if(foundCat) return res.status(404).json("That category already exists");

    const newCategory = new Category(req.body)

    try {
        const saveCategory = await newCategory.save();
        res.status(200).json(saveCategory);
    } catch(err) {
        res.status(500).json(err);
    }
});

//GET ALL CATEGORIES
router.get('/', async (req, res) => {

    try{
        const categories = await Category.find();
        res.status(200).json(categories);

        //If I only want to return the category names in an array...
        // res.status(200).json(categories.map((item) => `${item.name}`));
    } catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;