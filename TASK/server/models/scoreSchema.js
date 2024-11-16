// Import necessary modules and packages
const mongoose = require('mongoose');// Import the Mongoose library

// Function to adjust to GMT+2 and format the date as dd/mm/yyyy
const formatDateToGMT2 = (date) => {
    const gmt2Date = new Date(date.getTime() + 2 * 60 * 60 * 1000);// Convert the given date to GMT+2 by adding 2 hours (2 * 60 * 60 * 1000 milliseconds)
    const day = String(gmt2Date.getUTCDate()).padStart(2, '0');// Extract and format the day as a two-digit string
    const month = String(gmt2Date.getUTCMonth() + 1).padStart(2, '0');// Extract and format the month as a two-digit string (months are 0-indexed, so add 1)
    const year = gmt2Date.getUTCFullYear();// Extract the four-digit year
    return `${day}/${month}/${year}`;// Return the formatted date string in dd/mm/yyyy format
};

//Define the score schema
const scoreSchema = new mongoose.Schema({
    // Field for the name of the quiz taken
    name: {
        type: String,//Specify the data type as a string
        required: [true, 'Quiz name is required'],//Mark the field as required
        set: (v) => v.toUpperCase(),// Automatically convert to uppercase before saving
        unique: false,//Specify the unique option as false
        trim: true,// Remove leading and trailing whitespace
    },
    //Field for username of the user who took the quiz
     username: {
        type: String,//Specify the data type as a 
        required: [true, 'username is required'],
         trim: true,// Remove leading and trailing whitespace
    },
    //Field for the score
    score: {
        type: Number,// Define the type as Number
        default: 0, // Set default value to 0
        required: true,//Mark the field as required 
        set: (v) => Math.floor(v),//Ensure the score is an integer
        /*Validate to ensure the score is a valid integer*/
        validate: {
            validator: Number.isInteger,// Custom validator to enforce integer values
            message: 'Score must be an integer',// Custom error message for validation failure
        },
    },
    //Field for the number of times the user has attempted the quiz
    attempts: {
        type: Number,  // Define the data type as Number
        default: 1,// Set the default value to 1 for the first attempt
        set: (v) => Math.floor(v),
    },
 //Field for the date of the current attempt
    date: {
        type: Date,//Define the dataType as a date
        default: Date.now, // Set the default to the current date and time
        // default: () => formatDateToGMT2(new Date()),// Set the default date to GMT+2 
        required: true,// Mark the field as required
    },
},{timestamps:true});// Add timestamps for createdAt and updatedAt fields

// Pre-save middleware to ensure the date is formatted correctly
scoreSchema.pre('save', function (next) {  
    this.date = formatDateToGMT2(new Date());// Reformat the date to GMT+2 before saving the document
    next(); // Proceed with saving the document
});

// Export the score model based on the scoreSchema
module.exports = mongoose.model('Score', scoreSchema);
