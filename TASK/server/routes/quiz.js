// Import necessary modules and packages
const express = require('express'); 
const router = express.Router(); 
const cors = require('cors');
// Import JSON Web Token for authentication
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
//Schemas
const Quiz = require('../models/quizModel');
// const {checkJwtToken} = require('./middleware')


//=======SETUP MIDDLEWARE===========
mongoose.set('strictPopulate', false)//Optional boolean, set to false to allow populating paths that aren't in the schema
/*The populate method in Mongoose is used to replace the 
specified path in the document with other documents from another collection.*/
router.use(cors()); // Enable CORS for all routes
router.use(express.json());//Built-in middleware to parse incoming requests with JSON payloads

//==============CUSTOM MIDDLEWARE======================
// Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, 'secretKey');
        req.user = decoded;
        console.log('Token provided');
        next();
    } catch (error) {
        console.error('No token attached to the request');
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
router.get('/findQuiz/:id', checkJwtToken, async (req, res) => {
    console.log('Finding Quiz');
    try {
        const quiz = await Quiz.findById(req.params.id).populate('user', 'username');
     

        if (!quiz) {
            return res.status(404).json({ message: 'quiz not found' });
        }
        res.json({ quiz }); 
        console.log(quiz);
    } catch (error) {
        console.error('Error finding quiz:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Route to fetch all the quizzes from the database
router.get('/findQuizzes', checkJwtToken, async (req, res) => {
    console.log('Finding Quizzes');
    try {
        const quizzes = await Quiz.find({}).populate('user', 'username');
        res.json({quizList : quizzes});
        console.log(quizzes);
    } 
    catch (error) {
        console.error('Error finding quizzes:', error.message);
        res.status(500).json({ message: error.message });
    }
});

const handleError = (res, error) => {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
};
//------------POST--------------
//Route to add new quiz
router.post('/addQuiz', checkJwtToken, async (req, res) => {
   console.log(req.body); 
    console.log('Add Quiz'); 
     
     const { name, questions } = req.body;   
    // const userId = req.user.id;// Retrieve user ID from the JWT token
    if (!name || !questions /*|| !userId */) {      
        return res.status(400).json(
            { message: 'Quiz name, questions and user ID are required' }
        )
    } 
    
  try {
           // Create a new quiz object
        const newQuiz = new Quiz( { 
            name, 
            questions, 
            // user: userId
        });

      const existingQuiz = await Quiz.findOne({ name });
        if (existingQuiz) {
            return res.status(400).json(
                { message: 'Quiz name already exists' });
        }
    
    const savedQuiz = await newQuiz.save();
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

    // if (!name || !questions || questions.length !== 5) {        
    //     return res.status(400).json(
    //         { message: 'Quiz name and exactly 5 questions are required' });
    // }

    // for (const question of questions) {
    //     if (!question.questionText || !question.correctAnswer || !question.options || question.options.length !== 3) {
    //         return res.status(400).json(
    //             { message: 'Each question must have a question, a correct answer, and exactly 3 options' });
    //     }
    // }
   if (!name || !questions) {
        return res.status(400).json({ message: 'Quiz name and questions are required' });
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
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        
        if (!deletedQuiz) {
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
