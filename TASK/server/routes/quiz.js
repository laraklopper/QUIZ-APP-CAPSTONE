// Import necessary modules and packages
const express = require('express'); // Import Express framework
const router = express.Router(); // Create a router object
const cors = require('cors'); // Import CORS middleware to enable cross-origin requests
const jwt = require('jsonwebtoken'); // Import JSON Web Token for authentication
//Schemas
const Quiz = require('../models/quizModel'); // Import the Quiz model
// const User = require('../models/userSchema');//Import userSchema
//const Score = require('../models/scoreSchema')//Import scoreSchema

//=======SETUP MIDDLEWARE===========
router.use(cors()); // Enable CORS for all routes
router.use(express.json()); // Parse incoming JSON requests

//=========CUSTOM MIDDLEWARE================
//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');// Extract the token from the Authorization header
// Conditional rendering to check if JWT token is present
    if (!token) {
        // console.log('Unauthorized: token missing');
        return res.status(401).json(
            { message: 'Access denied. No token provided.' }
        );
    }
    try {
         // Verify the token using the secret key
        const decoded = jwt.verify(
            token,
            'Secret-Key',//SecretKey
            /*process.env.JWT_SECRET*/
        );
        req.user = decoded;// Attach the decoded token to the request object
        next();//Call the next middleware function
    } 
    catch (error) {
        //Error handling
        console.error('No token attatched to the request');//Log an error message in the console for debugging purposes
        res.status(400).json({ message: 'Invalid token.' });// Respond with a 400 status code if the token is invalid
    }
}
/*
// Function to format the quiz data
const formatQuestionData = (quiz) => {
// Map through each question in the quiz
    return quiz.questions.map(question => {
            // For each question, create an object with the question text and formatted options
        return {
            questionText: question.questionText, // The text of the question
            optionsWithAnswer: question.options.map(option => ({
                option,// Each option text
                isCorrect: option === question.correctAnswer // Boolean indicating if this option is the correct answer
            }))
        };
    });
};
*/
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
    console.log('Finding Quiz'); // Log message in the console for debugging purposes
    try {
        //Find the quiz by its ID from the request parameters
        const quiz = await Quiz.findById(req.params.id); 

        //Conditional rendering to check if the quiz exists
        if (!quiz) {
            /*If no quiz is found with the given ID, return
                a 404(Not Found) status code with a JSON response*/
            return res.status(404).json({message: 'quiz not found'})
            
        }
        // const formattedData = formatQuestionData(quiz); // Format the quiz data
        // res.json({ quiz: formattedData }); // Return the formatted quiz data
        res.json({quiz});// If the quiz data is return quiz data JSON format
        console.log(quiz);// Log quiz in the console for debugging purposes
    }
    catch (error) {
        console.error('Error finding quiz:', error.message); // Log an error message in the console for debugging purposes
        res.status(500).json(// Send 500(Internal Server Error) status code and error message in JSON response
            { message: error.message });       
    }
});

// Route to fetch all the quizzes from the database
router.get('/findQuizzes', async (req, res) => {
    //console.log('Finding Quizzes')
    try {
                // Retrieve all quizzes from the database
        const quizzes = await Quiz.find({})// Empty query object returns all documents
        // const quizzes = await Quiz.find({}).populate('user', 'username');
        res.status(200).json(quizzes); // Respond with the retrieved quizzes and a 200 status code       
        // console.log(quizzes);//Log the quizzes in the database for debugging purposes
    } 
    catch (error) {
        //Error handling
        console.error('Error finding quizzes:', error.message);// Log an error message in the console for debugging purposes 
        res.status(500).json(// Send 500(Internal Server Error) status code and error message in JSON response
            { message: error.message });
    }
});

//------------POST--------------
// Route to save quiz results
/*router.post('/:id/result', async (req, res) => {
    try {
        const { quizId, score } = req.body;
        const result = new Result({ user: req.user.id, quiz: quizId, score });
        await score.save();
        res.status(200).json({ message: 'Result saved successfully' });
        res.json({score})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});*/


//Route to add new quiz
router.post('/addQuiz', async (req, res) => {
    //Debugging
    console.log(req.body); // Log the request body in the console for debugging purposes.
    console.log('Add Quiz'); // Log a static message in the console to indicate that the "Add Quiz" endpoint 
    
    const { name, questions } = req.body;//Extract the name and question from the request body

      if (!name || ! questions) {
          // Respond with a 400 status code and an error message if validation fails
            return res.status(400).json(
                {message: 'Quiz name and questions are required'})
        } 
    try {
         // Create a new quiz instance with the provided name and questions
        const newQuiz = new Quiz({ name, questions });
     /*  const newQuiz = new Quiz(
        { 
            name, 
            questions,
            createdBy: req.user.username
        }
    );*/

         // Conditional rendering to check if a quiz with the same name already exists in the database
        const existingQuiz = await Quiz.findOne({ name });
        if (existingQuiz) {
            // Respond with a 400 status code and an error message if the quiz name already exists
            return res.status(400).json({ message: 'Quiz name already exists' });
        }
        const savedQuiz = await newQuiz.save();// Save the new quiz to the database
        // Respond with a 201 status code and the saved quiz data if successful
        res.status(201).json(savedQuiz);
        // console.log(savedQuiz);// Log the saved quiz in the console for debugging purposes

    } catch (error) {
        console.error('Error occurred while adding new quiz:', error);//Log an error message in the console for debugging purposes
        // Respond with a 500 status code and a generic error message if an error occurs
        // res.status(500).json({ message: 'Internal Server Error' });//? status 400(Bad Request) or 500(Internal Server Error)
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
            {name, questions},// Fields to update
            { new: true }); // Return the updated document
        // Conditional rendering to check if the quiz was found and updated
        if (!updatedQuiz) {
            // Return a 404 error if the quiz does not exist
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(updatedQuiz);// Respond with the updated quiz data
    } 
    catch (error) {
        console.error('Error editing quiz:', error);//Log an error message in the console for debugging purposes
        return res.status(400).json({ error: error.message });// Respond with a 400(Bad Request) status code and the error message
    }
});


//--------DELETE---------------
// Route to delete a quiz
router.delete('/deleteQuiz/:id', async (req, res) => {
    // Extract the quiz ID from the request parameters
    const { id } = req.params; 
    try {
        const quiz = await Quiz.findByIdAndDelete(id); // Attempt to find and delete the quiz by ID

        // Conditional rendering to check if the quiz was found and deleted
        if (!quiz) {
            return res.status(404).json(
                // Return a 404 error if the quiz does not exist
                { message: 'Quiz not found' }); 
        }

        // Respond with a success message and the deleted quiz data
        res.status(200).json({ message: 'Quiz successfully deleted' });
        // res.json({ message: 'Quiz successfully deleted', quiz }); 
    } catch (error) {
        console.error('Error deleting quiz:', error);
        // Return a 500 status if there is a server error
        return res.status(500).json({ message: 'Internal Server Error' }); 
    }
});


module.exports = router; // Export the router to be used in other parts of the application
