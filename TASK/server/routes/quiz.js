// Import necessary modules and packages
const express = require('express');// Import Express to handle routing
const router = express.Router();// Create a new router object
const mongoose = require('mongoose');// Import Mongoose for MongoDB interaction
//Schemas
const Quiz = require('../models/quizModel');// Import the Quiz model
const Score = require('../models/scoreSchema');//Import the Score model
const User = require('../models/userSchema');//Import the User model
//Custom middleware
const { checkJwtToken, quizAuthorization} = require('./middleware');//Import Custom middleware

//===================ROUTES====================
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
    try {
        const { id } = req.params;// Retrieve the quiz ID from the request parameters
       
       //Conditional rendering to check if the quizId is a valid MongoDB ObjectId
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            // Respond with a 400 Bad Request status and an error message
            return res.status(400).json({success: false, message: 'Invalid or missing quiz ID'});
        }
        
        const quiz = await Quiz.findById(id)// Find the quiz by its ID and populate the 'userId' field with the 'username'        
            .populate('userId', 'username')// Populate the 'userId' field with the associated 'username' from the User collection
            .exec()//Execute the query
        
        //Conditional rendering to check if the quiz is found
        if (!quiz) {
            // If the quiz is not found, respond with a 404 Not Found status and an error message
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json(quiz); // If the quiz is found, send it as the JSON response
        console.log(quiz);// Log the quiz in the console for debugging purposes
    }
    catch (error) {
        console.error('Error finding quiz:', error.message); // Log an error message in the console for debugging purposes
        res.status(500).json({ message: error.message });// Respond with a 500 Internal Server Error status and the error message
    }
});

// Route to fetch all the quizzes from the database
router.get('/findQuizzes',  async (req, res) => {
    try {  
        const quizzes = await Quiz.find({})// Query the database for all quizzes
            .populate('userId', 'username')// Populate the 'userId' field with the 'username' from the User collection 
            .exec();  //Execute the query

         res.status(200).json({ success: true, quizList: quizzes});//Return the list of quizzes
         console.log(quizzes); // Log the quizzes for debugging purposes
    } catch (error) {
        //Error handling
        console.error('Error finding quizzes:', error.message);// Log an error message in the console for debugging purposes
        res.status(500).json({ message: error.message });// Send 500(Internal server error) status code and error message in JSON response
    }
});


//------------POST--------------
//Route to add new quiz
router.post('/addQuiz',  checkJwtToken, async (req, res) => {
    console.log(req.body);//Log the request body in the console for debugging purpose
    const { name, username, questions } = req.body;// Extract the quiz details from the request body

    // Conditional rendering to check that the quiz has a name and exactly 5 questions
    if (!name || !questions || questions.length !== 5) {
        // Respond with a 400 Bad Request status and an error message
        return res.status(400).json({message: 'Quiz name and exactly 5 questions are required'});
    }

    try {           
        const existingQuiz = await Quiz.findOne({ name });//Find the quiz in the database based on the quiz name
        
        // Conditional rendering to check if a quiz with the same name already exists
        if (existingQuiz) {
            //Return a 400(Bad request) response status if the quiz name already exists
            return res.status(400).json({message: 'Quiz name already exists'})
        }        
        
        // Create a new Quiz document with the provided details
        const newQuiz = new Quiz({
            name ,         // The name of the quiz
            username,     //Username of the user who created the quiz
            questions,    // Array of questions for the quiz          
        });

        const savedQuiz = await newQuiz.save();// Save the new quiz to the database

        
        res.status(201).json(savedQuiz);// Send the saved quiz as a response with a 201 Created status
        console.log(savedQuiz);;//Log the saved quiz in the console for debugging purposes
    } 
    catch (error) {
        console.error('Error occurred while adding new quiz:', error);//Log an error message in the console for debugging purposes
        res.status(500).json({ error: error.message });// Respond with a 500 Internal Server Error status and the error message
    }
})


//-------------------PUT--------------------------
// Route to edit a quiz
router.put('/edit/:id', checkJwtToken, quizAuthorization,  async (req, res) => {   
    console.log(req.body);//Log the request body in the console for debugging purposes       
    const { id } = req.params; // Extract quiz ID from the request parameters
    const { name , username , questions } = req.body;// Extract name and questions from the request body
    // const userId = req.user.id// Extract user ID from the JWT token
 
    try {    
        const quiz = await Quiz.findById(id)// Find the quiz by ID
        
        console.log(quiz);//Log the quiz in the console for debugging purposes
        
        //Conditional rendering to check that the quiz exists
        if (!quiz) {
            console.error('Quiz not found');//Log an error message in the console for debugging purposes
            return res.status(404).json({ message: 'Quiz not found' });// If the quiz doesn't exist, return a 404(Not found)response
        }  

        // Conditional rendering to check if the logged-in user is the same as the creator of the quiz
        if (quiz.username !== username || username ) {
            console.error('You are unauthorised to edit this quiz');//Log an error message in the console for debugging purposes
                return res.status(401).json({ 
                    success: false, 
                    message: 'Access denied. You are not authorized to edit this quiz.'
                 })
        }


        const updatedQuiz = {}//Create the updated quiz object
   
        //Conditional rendering to check if the name is provided
        if (name) {updatedQuiz.name =name} // Only update the name if provided 

        // Conditional rendering to check that the questions are properly provided
        if (questions && Array.isArray(questions) && questions.length === 5) {
            updatedQuiz.questions = questions
        } else {
            // Return a 400 (Bad Request)
            return res.status(400).json({message: 'No valid fields to update'})
        }

        const existingQuizName = await Quiz.findById(id)//Find the current quiz by ID

        //Conditional rendering to check if the quizName was changed
        if(name && name !== existingQuizName.name){
            //Update the quizName in the Score collection if the quizName is updated
            await Score.updateMany(
                {name: existingQuizName.name},//The existing quiz name
                {$set:{name}}//Set the new quizName 
            )
        }

        // Update the quiz in the database
        const editedQuiz = await Quiz.findByIdAndUpdate(//Find the quiz by its ID and update it
           id, // ID of the quiz to update
            {$set : updatedQuiz},//Set the updated quiz
            { new: true}// Return the updated document
        ); 
 
        // Respond with the updated quiz 
         res.status(200).json({ success: true, editedQuiz});
        console.log(editedQuiz);//Log the updated quiz in the console for debugging purposes      
           }   
    catch (error) {
        console.error('Error editing quiz:', error);//Log an error message in the console for debugging purposes
        // Return a 500 (Internal Server Error )error response with the error message
        return res.status(500).json({success: false, error: error.message });
    };
});

//--------DELETE---------------
// Route to delete a quiz
router.delete('/deleteQuiz/:id' , checkJwtToken,  async (req, res) => {
    const { id } = req.params;// Extract quiz ID from the request parameters
    
    try {
        const quiz = await Quiz.findById(id)// Find the quiz by its ID to check if the quiz exists
        //Conditional rendering to check if the quiz exists
        if (!quiz) {
            // If the quiz is not found, respond with a 404 Not Found status and an error message
            return res.status(404).json({ message: 'Quiz not found' });
        }     

        const deletedQuiz = await Quiz.findByIdAndDelete(id);// Find the quiz by its ID and delete it from the database

        console.log('Deleted Quiz:', deletedQuiz);// Log the deleted quiz in the console for debugging purposes
        res.status(200).json({ success: true, message: 'Quiz successfully deleted' });//Return a 200 OK status with a JSON object containing a success message
    } 
    catch (error) {
        //Error handling
        console.error('Error deleting quiz:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ success: false, error: error.message });// Respond with a 500 (Internal Server Error) status
    }
});

// Export the router to be used in other parts of the application
module.exports = router; 