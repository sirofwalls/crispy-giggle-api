const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
    },
    author: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        default: []
    }
}, {timestamps: true});

module.exports = mongoose.model('Post', PostSchema);