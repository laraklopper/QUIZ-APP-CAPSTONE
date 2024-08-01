// Import necessary modules and packages
const express = require('express'); // Import Express framework
const router = express.Router(); // Create a router object
const cors = require('cors');// Import CORS middleware to enable cross-origin requests
// Import JSON Web Token for authentication
const jwt = require('jsonwebtoken');
//Schemas
const Quiz = require('../models/quizModel');
// const {checkJwtToken} = require('./middleware')

//=======SETUP MIDDLEWARE===========
router.use(cors()); // Enable CORS for all routes
router.use(express.json());

//==============CUSTOM MIDDLEWARE======================
//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // const token = req.header('Authorization')?.replace('Bearer ', '');
    // const token = authHeader.split(' ')[1];
    const token = req.headers.authorization;

    if (!token) {
        // console.log('Unauthorized: token missing');
        return res.status(401).json(
            { message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(
            token,
            'Secret-Key',
            /*process.env.JWT_SECRET*/
        );
        req.user = decoded;
        next();
    } 
    catch (error) {
        //Error handling
        console.error('No token attatched to the request');
        res.status(400).json({ message: 'Invalid token.' });
    }
}

// Middleware to add username of the currently logged-in user when creating a quiz
const addUsername = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    req.body.username = req.user.username;
    next();
};
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
router.get('/findQuiz/:id', async (req, res) => {
    console.log('Finding Quiz'); // Log a message in the console for debugging purposes
    try {
        // Find quiz by ID and populate the 'user' field with 'username'
        const quiz = await Quiz.findById(req.params.id).populate('user', 'username');
        /*.populate('user', 'username'): Populates the user field with 
        the username of the user who created the quiz.*/

        //Conditional rendering to check if the quiz exists
        if (!quiz) {
            //If no Quiz is found respond with a 404 response
            return res.status(404).json({ message: 'quiz not found' });
        }
        res.json({ quiz }); // Send the found quiz as a JSON response
        console.log(quiz); // Log the quiz data in the console for debugging purposes
    } catch (error) {
        console.error('Error finding quiz:', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json({ message: error.message });//If an error occurs, respond with a 500 Internal Server Error response.
    }
});

// Route to fetch all the quizzes from the database
router.get('/findQuizzes', async (req, res) => {
    console.log('Finding Quizzes');//Log a message in the console for debugging purposes
    try {
        // Find all quizzes with optional filtering from request body and populate the 'user' field with 'username
        const quizzes = await Quiz.find({}).populate('user', 'username');
        res.json(quizzes);// Send the list of quizzes as a JSON response
        console.log(quizzes);// Log the quizzes data for debugging
    } 
    catch (error) {
        console.error('Error finding quizzes:', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json({ message: error.message });//If an error occurs, it sends a 500 Internal Server Error response.
    }
});

//------------POST--------------
//Route to add new quiz
router.post('/addQuiz', async (req, res) => {
   console.log(req.body); // Log the request body for debugging
    console.log('Add Quiz'); // Log message for debugging
     
    const { name, questions } = req.body;// Extract 'name' and 'questions' from the request body  
    const userId = req.user.id;// Retrieve user ID from the JWT token

     // Conditional rendering to check if 'name', 'questions', and 'userId' are provided
  if (!name || !questions || !userId) {
    return res.status(400).json({ message: 'Quiz name, questions, and user ID are required' });
  }

  try {
        // Create a new quiz object
       const newQuiz = new Quiz({ name, questions, user: userId }); // Save the new quiz to the database
      // Check if a quiz with the same name already exists
        const existingQuiz = await Quiz.findOne({ name });
        if (existingQuiz) {
            return res.status(400).json({ message: 'Quiz name already exists' });
        }
    
    const savedQuiz = await newQuiz.save();// Respond with the saved quiz and a 201 status code
    res.status(201).json(savedQuiz);
      console.log(savedQuiz)
  } catch (error) {
    console.error('Error occurred while adding new quiz:', error);
    res.status(400).json({ error: error.message });
  }
});

//-------------------PUT--------------------------
// Route to edit a quiz
router.put('/editQuiz/:id', checkJwtToken,  async (req, res) => {
    const { id } = req.params;
    const { name, questions } = req.body;
   
    if (!name || !questions || questions.length !== 5) {
        
        return res.status(400).json(
            { message: 'Quiz name and exactly 5 questions are required' });
    }

    for (const question of questions) {
        if (!question.questionText || !question.correctAnswer || !question.options || question.options.length !== 3) {
            return res.status(400).json(
                { message: 'Each question must have a question, a correct answer, and exactly 3 options' });
        }
    }
  
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id, 
            { name, questions },
            { new: true })

        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json(updatedQuiz)
    } 
    catch (error) {
        console.error('Error editing quiz:', error);
        return res.status(400).json({ error: error.message });
    }
});

//--------DELETE---------------
// Route to delete a quiz
router.delete('/deleteQuiz/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const quiz = await Quiz.findByIdAndDelete(id);
        
        if (!quiz) {
            return res.status(404).json({message: 'Quiz not found'})
        }
        res.status(200).json({ message: 'Quiz successfully deleted' });
    } 
    catch (error) {
        //Error handling
        console.error('Error deleting quiz:', error);
        return res.status(500).json({ message: 'Internal Server Error'});
    }
});

// Export the router to be used in other parts of the application
module.exports = router; 
