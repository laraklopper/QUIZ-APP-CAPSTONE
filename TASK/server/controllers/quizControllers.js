const Quiz = require('../models/quizModel');

//=============CRUD OPERATIONS==================
/*
|============================|
| CRUD OPERATION | HTTP VERB |
|================|===========|
|CREATE          | POST      | 
|----------------|-----------|
|READ            | GET       |  
|----------------|-----------|     
|UPDATE          | PUT       |
|----------------|-----------|
|DELETE          | DELETE    |
|================|===========|
*/

//-----------POST---------------------
//Controller function to create a new quiz
const addQuiz = async (req, res) => {
    console.log(req.body);//Log the request body in the console for debugging purposes
    try {
        const {name, questions} = req.body


        if (!quizName || !questions) {
            return res.status(400).json({ message: 'Quiz name and questions are required' });
        }

        const newQuiz = new Quiz({quizName, questions});

        const savedQuiz = await newQuiz.save()

        
        res.status(201).json({ message: 'Quiz successfully created', quiz: savedQuiz })
        console.log(savedQuiz);

    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ error: 'Error creating quiz' })
    }
}

//-----------GET-----------------------

    //Controller function to get a single quiz
    const getQuiz = async (req, res) => {
        try {
            const { id } = req.params;
            const quiz = await Quiz.findOne(id);
            if (!quiz) {
                return res.status(404).json({ error: 'Quiz not found' });
            }
            res.status(200).json(quiz);
            console.log(quiz);
        } catch (error) {
            console.error('Error finding quiz:', error);
            res.status(500).json({ error: 'Error finding quiz' });
        }
    }

//Controller function to fetch all quizzes
const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({});
        res.status(200).json(quizzes);
        console.log(quizzes)
    }
    catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Error fetching quizzes' });
    }
};

//============PUT==================
//Controller function to edit a quiz
const editQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { quizName, questions } = req.body;

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id,
            { quizName, questions },
            { new: true }
        );
        if (!updatedQuiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.status(200).json(updatedQuiz);
        console.log(updatedQuiz)
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ error: 'Error updating quiz' });
    }
};

//====================DELETE============================
//Controller function to delete a quiz by Id
const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        if (!deletedQuiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        res.status(200).json({ message: 'Quiz deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ error: 'Error deleting quiz' });
    }
};
//-----------------EXPORT FUNCTIONS----------------

module.exports = { addQuiz, getQuiz, getQuizzes, editQuiz, deleteQuiz };
