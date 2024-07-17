// Import necessary modules and packages
const express = require('express'); // Import Express framework
const router = express.Router(); // Create a router object
const cors = require('cors'); // Import CORS for enabling Cross-Origin Resource Sharing
const jwt = require('jsonwebtoken'); // Import JSON Web Token for authentication
// JSON Web Token is a standard used to create access tokens for an application
//Schemas
const Quiz = require('../models/quizModel');// Import Quiz model
/*Mongoose model that represents the Schema for quizzes in the database*/
//Import custom middleware
// import { checkJwtToken } from './middleware';

//=======SETUP MIDDLEWARE===========
router.use(express.json()); // Parse incoming request bodies in JSON format
/*Built-Middleware function used to parse incoming requests with JSON payloads.
Returns middleware that only parses JSON and only looks at requests where the
Content-Type header matches the type option.*/
router.use(cors()); //Enable Cross-Origin Resource sharing 

//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');// Get token from Authorization header

        //Conditional rendering to check if the token is present
    if (!token) {
        // console.log('Unauthorized: token missing');
        return res.status(401).json(// Return 401 (Unauthorised) if no token is provided
            { message: 'Access denied. No token provided.' }
        );
    }
    try {
        const decoded = jwt.verify(//Verify the JWT token
            token,
            'Secret-Key',//SecretKey
            /*process.env.JWT_SECRET*/
        );
        req.user = decoded;
        next();//Call the next middleware function
    } catch (ex) {
         //ex is the variable that holds the caught exception or error
        console.error('No token attatched to the request');// Log the error message in the console for debugging purposes
        // If token verification fails, respond with a 400 status code and an error message
        res.status(400).json({ message: 'Invalid token.' });
    }
}


//=============ROUTES=====================

/*
|================================================|
| CRUD OPERATION | HTTP VERB | EXPRESS METHOD    |
|================|===========|===================|
|CREATE          | POST      |  router.post()    |
|----------------|-----------|-------------------|
|READ            | GET       |  router.get()     |  
|----------------|-----------|-------------------|     
|UPDATE          | PUT       |  router.put()     |
|----------------|-----------|-------------------|
|DELETE          | DELETE    |  router.delete()  |
|================|===========|===================|
*/
//------------------GET---------------
//Route to GET a specific quiz using the quiz Id
router.get('/:id', async (req, res) => {
    // console.log('Finding Quiz');//Log a message in the console for debugging purposes
    try {
        const quiz = await Quiz.findById(req.params.id); //Find the quiz by its ID from the request parameters

        //Conditional rendering to check if the quiz exists
        if (!quiz) {
            /*If no quiz is found with the given ID, return
                a 404 status code with a JSON response*/
            return res.status(404).json({message: 'quiz not found'})
            
        }

        res.json({quiz});// If the quiz data is return quiz data JSON format
        console.log(quiz);// Log quiz in the console for debugging purposes
    }
    catch (error) {
        res.status(500).json({ message: error.message });// Send 500 status code and error message in JSON response
        console.log
    }
});

// Route to fetch all the quizzes from the database
router.get('/findQuizzes', async (req, res) => {
    //console.log('Finding Quizzes');//Log a message in the console for debugging purposes
    try {
        const quizzes = await Quiz.find({});//Find all quizzes
                // If quizzes are found, return them with a 200 status code
        res.status(200).json(quizzes); // Return all quizzes in JSON format
    } 
    catch (error) {
        console.error('Error finding quizzes:', error.message); // Log the error to the console for debugging purposes
        //Respond with a 500 status code (Internal Server Error) and the error message as JSON in the response body
        res.status(500).json({ message: error.message });
    }
});


//------------POST--------------
// Save quiz results
/*router.post('/:id/result', async (req, res) => {
    try {
        const { quizId, score } = req.body;
        // Logic to save results in the database
        res.status(200).json({ message: 'Result saved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});*/

//Route to add new quiz
router.post('/addQuiz', async (req, res) => {
    console.log(req.body); // Log request body to the console for debugging
    console.log('Add Quiz'); // Log 'Add Quiz' to the console for debugging
    const { name, questions } = req.body;// Extract the name and questions from request body

    // Conditional rendering to check if both name and questions are provided
      if (!name || ! questions) {
            return res.status(400).json(
                {message: 'Quiz name and questions are required'})
        } 
    try {
        // Create a new quiz instance with the provided name and questions
    const newQuiz = new Quiz(
        { name, questions }
    );
            
        const savedQuiz = await newQuiz.save();// Save the new quiz to the database

        res.status(201).json(savedQuiz);// Respond with a 201 status code and the saved quiz object as JSON
        console.log(savedQuiz);//Log the new quiz in the console for debugging purposes

    } catch (error) {
        console.error('Error occurred while adding new quiz:', error);// Log the error for debugging
        // Return 400 if there's a validation error or other client-side error
        res.status(400).json({ error: error.message });
    }
})

//---------PUT-----------

// Route to edit a quiz
router.put('/editQuiz/:id', checkJwtToken, async (req, res) => {
    const {id} = req.params;// Extract the quiz ID from the request parameters
    try {
        const {name, questions} = req.body;//Extract the name and questions from the request body
                // Find the quiz by ID and update it with the new name and questions
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id, 
            {name, questions},
            { new: true }); // Return the updated document

        //Conditional rendering to check if the updated quiz exists
        if (!updatedQuiz) {
            // If no quiz is found with the given ID, return a 404 status and a "Quiz not found" message
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(updatedQuiz);//Return the updated quiz object as a JSON response
    } 
    catch (error) {
        console.error('Error editing quiz:', error);// Log error message in the console for debugging purposes
        // If there's a validation error or other client-side error, return a 400 status with the error message
        return res.status(400).json({ error: error.message });// Return 400 if validation error
    }
});


//--------DELETE---------------
// Route to delete a quiz
router.delete('/deleteQuiz/:id', checkJwtToken, async (req, res) => {
    const { id } = req.params; // Extract the quiz ID from the request parameters
    try {
        const quiz = await Quiz.findByIdAndDelete(id);// Find and delete the quiz by its ID

        // If the quiz is not found, return a 404 status with a message
        if (!quiz) {
            // If no quiz is found with the given ID, return a 404 status and a "Quiz not found" message
            return res.status(404).json(
                { message: 'Quiz not found' }); 
        }

        
        res.status(200).json({ message: 'Quiz successfully deleted' });// Return success message and status 200
        res.json({ message: 'Quiz successfully deleted', quiz }); // Return success message and deleted quiz
    } catch (error) {
        console.error('Error deleting quiz:', error);// Log the error to the console for debugging purposes
        // Return a 500 status if there is a server error
        return res.status(500).json({ message: 'Internal Server Error' }); // Return 500 if server error
    }
});


module.exports = router; // Export the router to be used in other parts of the application
