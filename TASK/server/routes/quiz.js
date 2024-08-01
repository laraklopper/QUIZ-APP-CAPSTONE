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
router.get('/quizId/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('user', 'username');
        if (!quiz) {
            return res.status(404).json({ message: 'quiz not found' });
        }
        res.json({ quiz });
    } catch (error) {
        console.error('Error finding quiz:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Route to fetch all the quizzes from the database

router.get('/findQuizzes', async (req, res) => {
    console.log('Finding Quizzes')
    try {
        const quizzes = await Quiz.find({}).populate('user', 'username');
        res.status(200).json(quizzes);
        console.log(quizzes);
    } 
    catch (error) {
        console.error('Error finding quizzes:', error.message);
        res.status(500).json({ message: error.message });
    }
});

//------------POST--------------
//Route to add new quiz
router.post('/addQuiz', async (req, res) => {
  const { name, questions, userId } = req.body;
    console.log('Add Quiz'); 

  if (!name || !questions || !userId) {
    return res.status(400).json({ message: 'Quiz name, questions, and user ID are required' });
  }

  try {
    const existingQuiz = await Quiz.findOne({ name });
    if (existingQuiz) {
      return res.status(400).json({ message: 'Quiz name already exists' });
    }

    const newQuiz = new Quiz({ name, questions, user: userId });
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
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
