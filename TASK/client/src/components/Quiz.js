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

     //================EVENT LISTENERS=========================
  
  // // Function to shuffle array
  // const shuffleArray = (array) => {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]];
  //   }
  //   return array;
  // };

  // // Function to randomize the answer options
  // const randomizeOptions = () => {
  //   const answers = [...selectedQuiz.questions[quizIndex].options];
  //   answers.push(selectedQuiz.questions[quizIndex].correctAnswer);
  //   return shuffleArray(answers);
  // };

    // Function to randomize the answer options
  const randomizeOptions = (options) => {
    const answers= [...options]
    answers.push(selectedQuiz.questions[quizIndex].correctAnswer);
    const possibleAnswers = Math.random(answers)
    return possibleAnswers
  };
  const currentQuestion = selectedQuiz.questions[quizIndex];

  return (
    <div id='quizDisplay'>
      <Row>
        <Col>
          <h3 className='h3'>{selectedQuiz.name}</h3>
        </Col>
      </Row>
      <div>
        <Row>
          <Col xs={6} md={4} id='questionCol'>
            <div>
              <h3 className='h3'>
                QUESTION {quizIndex + 1} of {selectedQuiz.questions.length}
              </h3>
            </div>
            <div>
              <p>{currentQuestion.questionText}</p>
            </div>
          </Col>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4} id='timerCol'>
            {quizTimer && <div id='timer'>TIMER: {timer}</div>}
          </Col>
        </Row>
        <div>
          {randomizeOptions().map((option, index) => (
            <Button
              variant='primary'
              key={index}
              onClick={() => handleAnswerClick(option === currentQuestion.correctAnswer)}
            >
              {option}
            </Button>
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
