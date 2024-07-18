import React, { useState } from 'react';// Import the React module to use React functionalities
// Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//EditQuizFunction
export default function EditQuiz(
  { //PROPS PASSED FROM PARENT COMPONENT
    quiz,
    setError,
    setQuizList,
    quizList
    // newQuizName,
    // editQuiz,
    // setNewQuestion,
    // setNewQuizName,
    // newQuestion
  }
) {
//=============STATE VARIABLES======================
  const [newQuizName, setNewQuizName] = useState(quiz.name);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [newQuestion, setNewQuestion] = useState(quiz.questions[currentQuestionIndex]);
  
  //==================EVENT LISTENERS===========================

   const handleEditQuestion = () => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[currentQuestionIndex] = newQuestion;
    setQuizList(
      quizList.map(q =>
        q._id === quiz._id ? { ...q, questions: updatedQuestions, name: newQuizName } : q
      )
    );
  };

  //=================PUT REQUEST=================
/*
//Function to edit a quiz
    const editQuiz = async () => {
    const updatedQuiz = { name: newQuizName, questions: quiz.questions };
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/quiz/editQuiz/${quiz._id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedQuiz)
      });

      if (response.ok) {
        alert('Quiz successfully updated');
      } else {
        throw new Error('There was an error updating the quiz');
      }
    } catch (error) {
      console.error('There was an error updating the quiz:', error);
      setError('There was an error updating the quiz:', error);
    }
  };
*/
  //==========JSX RENDERING===========================

   return (
    <div>
      <Row className='formRow'>
        <Col>
            <label className='editQuizLabel'>
              <p className='labelText'>NEW QUIZ NAME:</p>
              <input 
                type='text'
                value={newQuizName} 
                name='newQuizName'
                onChange={(e) => setNewQuizName(e.target.value)}
                autocomplete='off'
                placeholder='QUIZ NAME'
              />
            </label>
             {/* Map over newQuestion array to render input fields for each question */}
            {newQuestion.map((question, index) => (
              <div key={index}>
                <label>
                  <p className='labelText'>NEW QUESTION TEXT:</p>
                  <input
                    type="text"
                    name="newQuestionText"
                    value={question.newQuestionText}
                    onChange={(event) => handleQuestionChange(index, event)}
                  />
                </label>
                <label>
                  <p>NEW CORRECT ANSWER:</p>
                  <input
                    type="text"
                    name="newCorrectAnswer"
                    value={question.newCorrectAnswer}
                    onChange={(event) => handleQuestionChange(index, event)}
                  />
                </label>
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex}>
                    <p>New Option {optionIndex + 1}:</p>
                    <input
                      type="text"
                      name={`option.${optionIndex}`}
                      value={option}
                      onChange={(event) => handleQuestionChange(index, event)}
                    />
                  </label>
                ))}
              </div>
            ))}
            {/* Buttons for adding a new question, moving to the next question, and submitting the form */}
            <Button type="button" onClick={handleAddNewQuestion}>Add New Question</Button>
            <Button type="button" onClick={handleNewNextQuestion}>Next Question</Button>
            <Button type="submit">EDIT</Button>
          </form>
        </Col>
      </Row>
    </div>
  );
}
