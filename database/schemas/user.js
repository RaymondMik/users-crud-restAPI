const mongoose = require('mongoose');
const validator = require('validator');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    role: {
        type: String,
        enum: ['admin', 'user'], 
        required: true
    }
});

module.exports.UserSchema = UserSchema;