// Import necessary modules and packages
const express = require('express'); // Import Express framework
const router = express.Router(); // Create a router object
const cors = require('cors');
// Import JSON Web Token for authentication
const jwt = require('jsonwebtoken'); 
//Schemas
const Quiz = require('../models/quizModel');
const User = require('../models/userSchema');

//=======SETUP MIDDLEWARE===========
router.use(express.json()); 
router.use(cors());

//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        // console.log('Unauthorized: token missing');
        return res.status(401).json(
            { message: 'Access denied. No token provided.' }
        );
    }
    try {
        const decoded = jwt.verify(
            token,
            'Secret-Key',//SecretKey
            /*process.env.JWT_SECRET*/
        );
        req.user = decoded;
        next();//Call the next middleware function
    } catch (ex) {
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
router.get('/quizId/:id', async (req, res) => {
    console.log('Finding Quiz');
    try {
        //Find the quiz by its ID from the request parameters
        const quiz = await Quiz.findById(req.params.id); 

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
        res.status(500).json(// Send 500 status code and error message in JSON response
            { message: error.message });       
    }
});

/* 
// Route to fetch all the quizzes from the database
router.get('/findQuizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find({}).populate('user', 'username');
        res.status(200).json(quizzes);
    } catch (error) {
        console.error('Error finding quizzes:', error.message);
        res.status(500).json({ message: error.message });
    }
});*/
// Route to fetch all the quizzes from the database
router.get('/findQuizzes', async (req, res) => {
    //console.log('Finding Quizzes')
    try {
        const quizzes = await Quiz.find({});//Find all quizzes
        res.status(200).json(quizzes); 
    } 
    catch (error) {
        console.error('Error finding quizzes:', error.message);
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
    console.log(req.body); 
    console.log('Add Quiz'); 
    const { name, questions } = req.body;

      if (!name || ! questions) {
            return res.status(400).json(
                {message: 'Quiz name and questions are required'})
        } 
    try {
        // Create a new quiz instance with the provided name and questions
    const newQuiz = new Quiz(
        { 
            name, 
            questions,
            createdBy: req.user.username
        }
    );
    
        const savedQuiz = await newQuiz.save();// Save the new quiz to the database
        res.status(201).json(savedQuiz);
        // console.log(savedQuiz);

    } catch (error) {
        console.error('Error occurred while adding new quiz:', error);
        res.status(400).json({ error: error.message });
    }
})

//---------PUT-----------

// Route to edit a quiz
router.put('/editQuiz/:id', checkJwtToken, async (req, res) => {
    const {id} = req.params;// Extract the quiz ID from the request parameters
    try {
        //Extract the name and questions from the request body
        const {name, questions} = req.body;
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id, 
            {name, questions},
            { new: true }); // Return the updated document

        if (!updatedQuiz) {
       
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(updatedQuiz);
    } 
    catch (error) {
        console.error('Error editing quiz:', error);
        return res.status(400).json({ error: error.message });
    }
});


//--------DELETE---------------
// Route to delete a quiz
router.delete('/deleteQuiz/:id', async (req, res) => {
    // Extract the quiz ID from the request parameters
    const { id } = req.params; 
    try {
        const quiz = await Quiz.findByIdAndDelete(id);

        if (!quiz) {
            return res.status(404).json(
                { message: 'Quiz not found' }); 
        }

        
        res.status(200).json({ message: 'Quiz successfully deleted' });
        res.json({ message: 'Quiz successfully deleted', quiz }); 
    } catch (error) {
        console.error('Error deleting quiz:', error);
        // Return a 500 status if there is a server error
        return res.status(500).json({ message: 'Internal Server Error' }); 
    }
});


module.exports = router; // Export the router to be used in other parts of the application
