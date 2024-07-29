// Import necessary modules and packages
import React from 'react'; // Import React to create functional components
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import Row component from Bootstrap for layout
import Col from 'react-bootstrap/Col'; // Import Col component from Bootstrap for layout
import Button from 'react-bootstrap/Button'; // Import Button component from Bootstrap

//Quiz function component
export default function Quiz(
  {//PROPS PASSED FROM PARENT COMPONENT
  selectedQuiz,
  quizIndex,
  handleAnswerClick,
  handleNextQuestion,
  handleRestart,
  score,
  quizTimer,
  timer,
}) {

//==================JSX RENDERING======================
  
  return (
    <div id='quizDisplay'>
      <Row>
        <Col>
          <h3 className='h3'>{selectedQuizName}</h3>
        </Col>
      </Row>
      <div>
        <Row>
          <Col xs={6} md={4} id='questionCol'>
            <div>
              <h3 className='h3'>QUESTION {quizIndex + 1} of {selectedQuiz.questions.length} </h3>           
            </div>
          </Col>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4} id='timerCol'>
    {/* Conditionally display the timer */}
            {quizTimer && <div id='timer'>TIMER: {timer}</div>}
          </Col>
        </Row>
        <div>
    <Row>
        <Col md={2}></Col>
        <Col md={7}>
    {/* Display current question text */}
          <h3 className='h3'>{questions[questionIndex].questionText}</h3>
        </Col>
        <Col md={3}></Col>
      </Row>
    // Map over each option in the current question to render radio buttons
           {questions[quizIndex].options.map((option, index) => (
            <div key={index}>
              <input
                type='radio'//Input type
                name='answer'// All radio buttons share the same name to ensure only one can be selected
                value={option}
            checked={selectedAnswer === option} // Use state to manage selected option
                onClick={() => handleAnswerClick(option === questions[quizIndex].correctAnswer)}
              />
              {option}
            </div>
          ))}
        </div>
        <Row>
          <Col xs={6} md={4}>
            <div>
            {/* Display the current score */}
              <p>RESULT: {score} of {selectedQuiz.questions.length}</p>
            </div>
          </Col>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4}>
          {/* Buttons for moving to the next question and restarting the quiz */}
            <Button variant='primary' type='button' onClick={handleNextQuestion}>NEXT QUESTION</Button>
            <Button variant='primary' type='reset' onClick={handleRestart}>RESTART</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
