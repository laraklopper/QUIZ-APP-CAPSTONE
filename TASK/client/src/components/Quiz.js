// Import necessary modules and packages
import React from 'react';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button';

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

     //================EVENT LISTENERS========================

  return (
    <div id='quizDisplay'>
      <Row>
        <Col>
          <h3 className='h3'>{quizName}</h3>
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
            {quizTimer && <div id='timer'>TIMER: {timer}</div>}
          </Col>
        </Row>
        <div>
    <Row>
        <Col md={2}></Col>
        <Col md={7}>
          <h2>{questions[questionIndex].questionText}</h2>
        </Col>
        <Col md={3}></Col>
      </Row>
          {questions[questionIndex].options.map((option, index) => (
            <div key={index}>
            <input 
            type='radio' 
              name='answer' 
                value={option} 
              onClick={() => handleAnswerClick(e, questionIndex)}
                 checked={answers[questionIndex] === option}
            >
              {option}
            </div>
          ))}
        </div>
        <Row>
          <Col xs={6} md={4}>
            <div>
              <p>RESULT: {score} of {selectedQuiz.questions.length}</p>
            </div>
          </Col>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4}>
            <Button
              variant='primary'
              type='button'
              onClick={handleNextQuestion}
            >
              NEXT QUESTION
            </Button>
            <Button
              variant='primary'
              type='reset'
              onClick={handleRestart}
            >
              RESTART
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
