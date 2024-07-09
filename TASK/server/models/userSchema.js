const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    admin:{
        type: Boolean,
        required: false,
    },
    password:{
        type: String,
        required: true,
        unique: true
    }
}, {timestamp: true})

module.exports = mongoose.model('users', userSchema)