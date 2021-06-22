const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

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
        type: ObjectId,
        required: true
    },
    categories: {
        type: Array,
        default: []
    }
}, {timestamps: true});

module.exports = mongoose.model('Post', PostSchema);