const mongoose = require('mongoose'); // Import the Mongoose library

// Define the schema for quizzes
const quizSchema = new mongoose.Schema({
    //Field for the name of the quiz
    name: {
        type: String,
        required: true,
        unique: true,
    },
    //Field for questions containing an array of objects
    questions: {
        type: [
            {
                //Specify the question text(Question)
                questionText: {
                    type: String,
                    required: true,
                },
                //Specify the correct answer
                correctAnswer: {
                    type: String,
                    required: true,
                },
                //Specify the answer options for the questions
                options: {
                    type: [String],
                    required: true,
                    validate: [arrayLimit, '{PATH} must have exactly 3 options']
                }
            }
        ],
        required: true,
        validate: [arrayLimit5, '{PATH} must have exactly 5 questions']
    }//,
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'user',
    //     required: true
    // }
}, { timestamps: true }
    /*Enable timestamps to automatically add createdAt
           and updatedAt fields*/
);

// Custom validation function to ensure each question has exactly 3 options
function arrayLimit(val) {
    return val.length === 3;
}

// Custom validation function to ensure each quiz has exactly 5 questions
function arrayLimit5(val) {
    // Check if the length of the array 'val' is exactly 5
    return val.length === 5;
}

// // Create a virtual field for username
// quizSchema.virtual('username').get(function () {
//     return this.user.username;
// });

// Export the mongoose model for 'Quiz' using the defined schema
module.exports = mongoose.model('quiz', quizSchema);
