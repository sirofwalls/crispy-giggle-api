const Joi = require('@hapi/joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(4).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(8).required()
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        password: Joi.string().min(8).required()
    });
    return schema.validate(data);
};

const updateValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3),
        email: Joi.string().min(6).email(),
        password: Joi.string().min(8),
        profilePic: Joi.string()
    });
    return schema.validate(data);
};

const newPostValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        description: Joi.string().min(8).required(),
        author: Joi.string().required(),
        categories: Joi.array()
    });
    return schema.validate(data);
};

const updatePostValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3),
        description: Joi.string().min(8),
        categories: Joi.array()
    });
    return schema.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation,
    updateValidation,
    newPostValidation,
    updatePostValidation
}