// Import necessary modules and packages
const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
//Schemas
const Quiz = require('../models/quizModel');


//=======SETUP MIDDLEWARE===========
router.use(cors())
router.use(express.json())

//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
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
    } catch (error) {
        console.error('No token attatched to the request');
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
router.get('/:id', checkJwtToken, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        //Conditional rendering
        if (!quiz) {
            return res.status(404).json({message: 'quiz not found'})
            
        }
        res.json({quiz});
        // console.log(quiz);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to fetch all the quizzes from the database
router.get('/findQuizzes', async (req, res) => {

    try {
        const {name} = req.query;
        const query = quizName ? {quizName} : {};
        const quizzes = await Quiz.find(query);
        res.status(200).json(quizzes);
        
    } 
    catch (error) {
        console.error('Error finding quizzes:', error.message); 
        res.status(500).json(
            { message: error.message }
        );
    }
});


//------------POST--------------
//Route to add new quiz
router.post('/addQuiz', checkJwtToken, async (req, res) => {
   
    console.log(req.body);
    console.log('Add Quiz');
    const { name, questions } = req.body;

      if (!name || ! questions) {
            return res.status(400).json({message: 'Quiz name and questions are required'})
        } 
    try {
    const newQuiz = new Quiz({ name, questions });
            
        const savedQuiz = await newQuiz.save();

        res.status(201).json(savedQuiz);
        console.log(savedQuiz);

    } catch (error) {
        console.error('Error occurred while adding new quiz:', error);
        res.status(400).json({ error: error.message });
    }
})

//---------PUT-----------
// Route to edit a quiz
router.put('/editQuiz/:id', checkJwtToken, async (req, res) => {
    const {id} = req.params;
    const { quizName, questions } = req.body;
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id, 
            {quizName, questions},
            { new: true });

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
router.delete('/deleteQuiz/:id', checkJwtToken, async (req, res) => {
    const {id} =req.params;
    try {
       const quiz = await Quiz.findByIdAndDelete(id);

        if (!quiz) {
            return res.status(404).json({message: 'Quiz not found'})
        }

        res.status(200).json({ message: 'Quiz successfully deleted' });
        res.json({message: 'Quiz successfully deleted', quiz})
    } 
    catch (error) {
        console.error('Error deleting quiz:', error);
        return res.status(500).json({ message: 'Internal Server Error'});
    }
});

// Export the router to be used in other parts of the application
module.exports = router; 
