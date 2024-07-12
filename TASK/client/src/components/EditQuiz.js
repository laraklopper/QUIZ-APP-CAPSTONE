import React from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//EditQuizFunction
export default function EditQuiz(
  { //PROPS PASSED FROM PARENT COMPONENT
    quiz,
    newQuizName,
    editQuiz,
    setNewQuestion,
    setNewQuizName,
    newQuestion
  }
) {

  //==================EVENT LISTENERS===========================
  // Function to changing question details
  const handleQuestionChange = (index, event) => {
    const {name, value} = event.target;
    setNewQuestion(prevQuestions => {
      const updatedQuestions = [...prevQuestions]
      if (name === 'newQuestionText' || name === 'newCorrectAnswer') {
        updatedQuestions[index][name] = value
        
      } else if(name.startsWith('option')){
        const optionIndex = parseInt(name.split('.')[1]);
        updatedQuestions[index].options[optionIndex] = value;
      }
      return updatedQuestions
    })
  };

  // Function to update a question
  const handleAddNewQuestion = () => {
    if (newQuestion.length >= 5) {
      alert('You cannot add more than 5 questions.');
      return;
    }
    setNewQuestion([
      ...newQuestion,
      { newQuestionText: '', newCorrectAnswer: '', options: ['', '', '', ''] }
    ]);
  };

  // Function to move to the next question
  const handleNewNextQuestion = () => {
    const lastQuestion = newQuestion[newQuestion.length - 1];
    if (!lastQuestion.newQuestionText || !lastQuestion.newCorrectAnswer || lastQuestion.options.some(option => !option)) {
      alert('Please fill out all fields of the current question before moving to the next one.');
      return;
    }
    if (newQuestion.length >= 5) {
      alert('You cannot add more than 5 questions.');
      return;
    }
    setNewQuestion([
      ...newQuestion,
      { newQuestionText: '', newCorrectAnswer: '', options: ['', '', '', ''] }
    ]);
  };
  //==========JSX RENDERING===========================

   return (
    <div>
      <Row className='formRow'>
        <Col>
          <form onSubmit={(event) => { event.preventDefault(); editQuiz(quiz._id); }}>
            <label className='editQuizLabel'>
              <p className='labelText'>NEW QUIZ NAME:</p>
              <input 
                type='text'
                value={newQuizName} 
                name='newQuizName'
                onChange={(e) => setNewQuizName(e.target.value)}
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