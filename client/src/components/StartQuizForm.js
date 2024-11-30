// Import necessary modules and packages
import React from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap


//StartQuizForm function component
export default function StartQuizForm(//Export the default StartQuizForm function component
    {//PROPS PASSED FROM PARENT COMPONENT
        quiz,
        quizTimer,// Boolean state indicating whether the quiz timer is active
        setQuizTimer,
        quizStarted,// Boolean state to check if quiz has started
        handleQuizStart
    }) {

    //=======JSX RENDERING=============
  return (
    // Form to start quiz
      <form  onSubmit={handleQuizStart} id='startQuizForm'>
          <Row className='startQuizRow'>
              <Col md={12} className='quizNameCol'>
                  <h3 className='quizName'>
                    {/* Display the quiz name */}
                      {quiz ? quiz.name : ''}
                      {/* If the quiz does not exist display an empty string */}
                      </h3>
              </Col>
          </Row>
          {/* Row containing a checkbox for adding 
          a timer and the start button */}
          <Row className='startQuizRow'>
              <Col xs={6} md={4}></Col>
              <Col xs={6} md={4} className='timerCol'>
              {/* Label for addTimer checkbox */}
                  <label id='addTimerLabel' htmlFor='addQuizTimer'>
                      <p className='labelText'>ADD TIMER:</p>
                  </label>
                  {/* Checkbox to add timer based on the quizTimer state */}
                  <input
                      type='checkbox'
                      checked={quizTimer}//Current state of the timer 
                      // Update the timer state when toggled
                      onChange={(e) => setQuizTimer(e.target.checked)}
                      id='addQuizTimer'
                      // Disable checkbox if the quiz has started
                      disabled={quizStarted} 
                  />
              </Col>
              <Col xs={6} md={4} className='startQuizBtnCol'>
                  {/* Button to start quiz */}
                  <Button variant='primary' type='submit' id='startQuizBtn' aria-label='Start Quiz'>
                    START QUIZ
                </Button>
              </Col>
          </Row>
      </form>
  )
}
