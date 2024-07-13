const mongoose = require('mongoose');// Import the Mongoose library
// const bcrypt = require("bcryptjs");

// Define the user schema
let userSchema = mongoose.Schema({
    username: { // Field for the username
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    email: {// Field for the email
        type: String,
        required: [true, 'User email is required'],
        unique: true,
    },
    dateOfBirth: {//Field for user date of birth
        type: Date,
        required: [true, 'date of birth is required'],
    },
    admin:{//Optional field for admin status
        type: Boolean,
        required: false,
    },
    password:{//Field for user password
        type: String,
        required: [true, 'Password is required'],
        unique: true
    }
}, {timestamp: true})

// userSchema.pre("save", async function () {
//     this.password = await bcrypt.hash(this.password, 12)
// })

module.exports = mongoose.model('users', userSchema)
