import React, { useState } from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col';// Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//EditQuiz Function component
export default function EditQuiz(
  {//PROPS PASSED FROM PARENT COMPONENT
  quiz, 
  setQuizList,  
  quizList,
  editQuizIndex,
  setEditQuizIndex,
  editQuiz,
  setNewQuizName,
  newQuizName,
  newQuestions, 
  setNewQuestions
}
) {
  //=============STATE VARIABLES======================
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  //============EVENT LISTENERS=================

//Function to edit a question
  const handleEditQuestion = () => {
    const updatedQuestions = [...newQuestions];
    updatedQuestions[currentQuestionIndex] = { ...editQuizIndex };
    setNewQuestions(updatedQuestions);

    setQuizList(
      quizList.map(q =>
        q._id === quiz._id ? { ...q, questions: updatedQuestions, name: newQuizName } : q
      )
    );
  };

  //=========JSX RENDERING===================

 
  return (
    // Form to edit quiz
    <div id='editQuizForm'>
      <Row className='formRow'>
        <Col>
        <h2 className='h2'>EDIT QUIZ</h2>
        </Col>
      </Row>
      <Row className='editQuizRow'>
        <Col xs={6} md={4} className='editQuizCol'>
        <label className='editQuizLabel'>
          {/* Edit quiz name */}
          <p className='labelText'>QUIZ NAME:</p>
          <input
              type='text'// Specifies the input type as text
              name='newQuizName' // The name attribute for identifying this field
              value={newQuizName}// Displays the current value of newQuizName
              onChange={(e) => setNewQuizName(e.target.value)} // Updates the newQuizName state with the input value
              autoComplete='off'// Disables the browser's autocomplete feature
              placeholder={quiz.name}// Shows the current quiz name as placeholder
              className='editQuizInput'// CSS class for styling
          />
        </label>
        </Col>
      </Row>
      {/* EDIT QUESTIONS INPUT */}
      <div className='editQuestions'>
        <Row>
          <Col className='editQuestionHead' >
            <h3 className='h3'>EDIT QUESTIONS</h3>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          {/* EDITED QUIZ QUESTION */}
          <label className='editQuizLabel'>
            <p className='labelText'>QUESTION:</p>
            <input
                type='text' //Specify input type
                name='questionText'// The name attribute for identifying this field
                value={editQuizIndex.questionText}// Displays the current question text
                onChange={(e) =>
                  setEditQuizIndex({
                    ...editQuizIndex, // Preserve other properties
                    questionText: e.target.value // Update questionText with the new value
                  })
                }
                autoComplete='off'// Disable browser autocomplete
                placeholder={quiz.questions[currentQuestionIndex]?.questionText || ''}// Placeholder text
                className='editQuizInput' // CSS class for styling
                id='editQuestionInput'// Unique ID for styling or JavaScript access
            />
          </label>
          </Col>
          <Col xs={6} className='editQuizCol'>
          {/* Edited correct answer */}
          <label className='editQuizLabel'>
              <p className='labelText'>CORRECT ANSWER:</p>
              <input
                type='text'// Specifies the input type as text
                name='correctAnswer'// The name attribute for identifying this field
                value={setEditQuizIndex.correctAnswer} // Displays the current value of correctAnswer, or an empty string if undefined
                onChange={(e) => 
                  setEditQuizIndex({ 
                    ...editQuizIndex, // Spread the current state to retain other properties
                    correctAnswer: e.target.value// Update correctAnswer with the new value
                 })}
                autoComplete='off' // Disables the browser's autocomplete feature
                placeholder={quiz.questions[currentQuestionIndex]?.correctAnswer || ''}
                className='editQuizInput'
                id='correctAnswer' // Unique ID for accessibility
              />
          </label>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          {/* Edited alternative answer */}
          <label className='editQuizLabel'>
            <p className='labelText'>1.ALTENATIVE ANSWER:</p>
            <input
               type='text'//Specify the input type
                name='options[0]'// Input name for identification
                value={editQuizIndex.options[0] || ''}
                onChange={(e) => 
                  setEditQuizIndex({ 
                    ...editQuizIndex, // Spread the current state to retain other properties
                    options: [
                      e.target.value, // Update the first option with the new value
                      editQuizIndex.options[1], // Keep the second option unchanged
                      editQuizIndex.options[2]// Keep the third option unchanged
                  ] 
                })}
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.options[0] || ''}
                className='editQuizInput'
            />
          </label>
          </Col>
          <Col xs={6} className='editQuizCol'>
            <label className='editQuizLabel'>
              {/* Edited Alternative answer input */}
              <p className='labelText'>2.ALTENATIVE ANSWER:</p>
              <input
                type='text'// Specify the input type as text
                name='options[1]'// Input name for identification
                value={editQuizIndex.options[1] || ''} // Display the current value or an empty string if undefined
                onChange={(e) => 
                  setEditQuizIndex({ 
                    ...editQuizIndex, // Spread the current state to retain other properties
                    options: [
                      editQuizIndex.options[0], // Keep the first option unchanged
                      e.target.value,  // Update the second option with the new value
                      editQuizIndex.options[2]// Keep the third option unchanged
                    ] })}
                autoComplete='off'// Disable auto-completion for the input field
                placeholder={quiz.questions[currentQuestionIndex]?.options[1] || ''}// Placeholder for current value or empty string
                className='editQuizInput'
              />
            </label>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6}>         
          </Col>
          <Col xs={6} className='editQuizCol'>
            {/* Edited alternative answer */}
            <label className='editQuizLabel'>
              <p className='labelText'>3.ALTENATIVE ANSWER:</p>
              <input 
              type='text'//Specify the input type
                name='options[2]'// Input name for identification
                value={editQuizIndex.options[2] || ''} // Display the current value or an empty string if undefined
                onChange={(e) => 
                  setEditQuizIndex({ 
                    ...editQuizIndex, 
                    options: [
                      editQuizIndex.options[0],  // Preserve the first option
                      editQuizIndex.options[1], // Preserve the second option
                      e.target.value// Update the third option with the new value
                  ] 
                })}
                autoComplete='off'// Disable auto-completion for the input field
                placeholder={quiz.questions[currentQuestionIndex]?.options[2] || ''} // Placeholder for current value or empty string
                className='editQuizInput'
              />
            </label>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          {/* BUTTONS */}
          <Col xs={6} md={4} className='editQuizCol'>
          {/* Button to edit question */}
            <Button 
              variant="primary"  // Bootstrap primary button variant
              onClick={handleEditQuestion}// Calls the handleEditQuestion function on click
              className='editQuestionBtn' // Custom class for additional styling
            >
              EDIT QUESTION
            </Button>
          </Col>
          <Col xs={6} md={4} className='editQuizCol'>
          {/* Button to move to previous question */}
          <Button 
          variant='secondary' //Bootstrap variant
          onClick={() => {//Event type
            /*/ Conditional rendering to check if the current 
            question index is greater than 0*/
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex(currentQuestionIndex - 1)// Decreases the index to move to the previous question
            }
          }}
              className='previousQuestionBtn' // CSS class for styling
          >
            PREVIOUS QUESTION
          </Button>
          </Col>
          <Col xs={6} md={4} className='editQuizCol'>
          {/* Button to move to next question */}
            <Button
              variant='secondary'//Bootstrap variant
              onClick={() => {//Event type
                /*/ Conditional rendering to check if the current question 
                index is less than the last question index*/
                if (currentQuestionIndex < quiz.questions.length - 1)
                  // Increase the index to move to the next question
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
              }}>
              NEXT QUESTION
            </Button>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={12} className='editQuizCol'>
          {/* Button to edit quiz */}
            <Button 
              variant='primary' //Bootstrap variant
              onClick={() => editQuiz(quiz._id)}// Call the editQuiz function with the quiz ID on click
              >
              EDIT QUIZ
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}
