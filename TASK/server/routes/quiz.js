// Import necessary modules and packages
const express = require('express'); // Import Express framework
const router = express.Router(); // Create a router object
const cors = require('cors');// Import CORS middleware to enable cross-origin requests
// Import JSON Web Token for authentication
const jwt = require('jsonwebtoken');
//Schemas
const Quiz = require('../models/quizModel');//Import the QuizSchema

//=======SETUP MIDDLEWARE===========
router.use(cors()); // Enable CORS for all routes
router.use(express.json()); // Parse incoming JSON requests

//==============CUSTOM MIDDLEWARE======================
//Middleware to verify the JWT token
const checkJwtToken = (req, res, next) => {
    // const token = req.header('Authorization')?.replace('Bearer ', '');// Extract the token from the Authorization header
    const token = req.headers.authorization;

    //Conditional rendering to check if JWT token is present
    if (!token) {
        // console.log('Unauthorized: token missing');
        return res.status(401).json(
            { message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify( // Verify the token using a secret key
            token,
            'Secret-Key',//Secret key
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
router.get('/quizId/:id',  async (req, res) => {
    console.log('Finding Quiz');// Log message in the console for debugging purposes
    try {
        // Find the quiz by ID and populate the user field
        const quiz = await Quiz.findById(req.params.id).populate('user', 'username');

        //Conditional rendering to check if the quiz exists
        if (!quiz) {
            /*If no quiz is found with the given ID, return
                a 404(Not Found) status code with a JSON response*/
            return res.status(404).json({message: 'quiz not found'})
        }

        // const formattedData = formatQuestionData(quiz); // Format the quiz data
        // res.json({ quiz: formattedData }); // Return the formatted quiz data
        //res.send({quiz})
        res.json({ quiz });// If the quiz data is return quiz data JSON format
        console.log(quiz);//Log the quiz in the console for debugging purposes
    }
    catch (error) {
        //Error handling
        console.error('Error finding quiz:', error.message);// Log an error message in the console for debugging purposes
        // Send 500(Internal Server Error) status code and error message in JSON response
        res.status(500).json({ message: error.message });
    }
});

// Route to fetch all the quizzes from the database
router.get('/findQuizzes', async (req, res) => {
    console.log('Finding Quizzes')//Log a message in the console for debugging purposes
    try {
        const quizzes = await Quiz.find({}).populate('user', 'username')//Find all quizzes
        res.status(200).json(quizzes);// Respond with the quizzes data in JSON format        
        // console.log(quizzes);//Log the quizzes in the database for debugging purposes
    } 
    catch (error) {
        //Error handling
        console.error('Error finding quizzes:', error.message);//Log an error message in the console for debugging purposes
        // Send 500(Internal Server Error) status code and error message in JSON response
        res.status(500).json({ message: error.message })
    }
});


//------------POST--------------
//Route to add new quiz
router.post('/addQuiz',  async (req, res) => {
    console.log(req.body);// Log the request body in the console for debugging purposes.
    console.log('Add Quiz'); // Log a static message in the console for debugging purposes
     
    const { name, questions, userId } = req.body;//Extract the name and question from the request body

    //  const { name, questions, user } = req.body;
    
    //Conditional rendering to check if the name and questions fields are provided
    if (!name || !questions || !userId) {
        /* Respond with a 400 status code and an error 
        message if they are missing*/
        return res.status(400).json(
            { message: 'Quiz name and questions are required' })
    } 

    try {
        // Create a new quiz instance
        const newQuiz = new Quiz({ name, questions, userId });
        // Create a new quiz instance with the provided name and questions
        // const newQuiz = new Quiz({ name, questions });
        /*  const newQuiz = new Quiz(
      { 
          name, 
          questions,
          createdBy: req.user.username
      }
        );*/
        // Conditional rendering to check if a quiz with the same name already exists
        const existingQuiz = await Quiz.findOne({name});
        if (existingQuiz) {
            return res.status(400).json({message: 'Quiz name already exists'})
        }

        // Respond with a 201 status code and the saved quiz data if successful
        const savedQuiz = await newQuiz.save();
        res.status(201).json(savedQuiz);
        console.log(savedQuiz);// Log the saved quiz in the console for debugging purposes

    } 
    catch (error) {
        console.error('Error occurred while adding new quiz:', error);//Log an error message in the console for debugging purposes
        // Respond with a 500 status code and a generic error message if an error occurs
        // res.status(500).json({ message: 'Internal Server Error' });//? status 400(Bad Request) or 500(Internal Server Error)
        res.status(400).json(// Respond with a 400 status code and an error message if the quiz name already exists
            { error: error.message }
        );
    }
})


//-------------------PUT--------------------------
// Route to edit a quiz
router.put('/editQuiz/:id', checkJwtToken,  async (req, res) => {
    const { id } = req.params;// Extract the quiz ID from the request parameters
    const { name, questions } = req.body//Extract the name and questions from the request body

    // Conditional rendering to check if the  the request body
    if (!name || !questions || questions.length !== 5) {
        
        return res.status(400).json(
            { message: 'Quiz name and exactly 5 questions are required' });
    }

    // Validate each question in the questions array
    for (const question of questions) {
        if (!question.questionText || !question.correctAnswer || !question.options || question.options.length !== 3) {
            return res.status(400).json(
                { message: 'Each question must have a question, a correct answer, and exactly 3 options' });
        }
    }
  
    try {
        // Find the quiz by ID and update it with the new name and questions
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id, 
            { name, questions },// Fields to update
            { new: true })// Return the updated document

        // Conditional rendering to check if the quiz was found and updated
        if (!updatedQuiz) {
            // Return a 404 (Not Found) error if the quiz does not exist
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json(updatedQuiz)// Respond with the updated quiz data in JSON format
    } 
    catch (error) {
        console.error('Error editing quiz:', error);//Log an error message in the console for debugging purposes
        return res.status(400).json(// Respond with a 400(Bad Request) status code and the error message
            { error: error.message });
    }
});

//--------DELETE---------------
// Route to delete a quiz
router.delete('/deleteQuiz/:id', async (req, res) => {
    const { id } = req.params;// Extract the quiz ID from the request parameters
    
    try {
        const quiz = await Quiz.findByIdAndDelete(id);// Find the quiz by ID and delete it
        // Conditional rendering to check if the quiz was found
        if (!quiz) {
            // Return a 404 error if the quiz does not exist
            return res.status(404).json({message: 'Quiz not found'})
        }
// Respond with a 200 status code and success message
        res.status(200).json({ message: 'Quiz successfully deleted' });
    } 
    catch (error) {
        //Error handling
        console.error('Error deleting quiz:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ message: 'Internal Server Error'});}// Respond with a 500 status code and the error message
});

// Export the router to be used in other parts of the application
module.exports = router; 
