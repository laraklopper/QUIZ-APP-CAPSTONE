import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//Quiz function component
export default function Quiz({
  selectedQuiz,
  timer,
  currentQuestion,
  handleAnswerClick,
  quizTimer,
  handleNextQuestion,
  handleRestart
}) {

  //============EVENT LISTENERS=============
   // Function to randomize the answer options
  const randomizeOptions = (options) => {
    return options.sort(() => Math.random() - 0.5);
  };


  //================JSX RENDERING======================

  return (
    //Selected Quiz
    <div id='quizDisplay'>
      {/* Selected Quiz Name*/}  
           <Row id='quizNameRow'>
              <Col id='quizNameCol'>
              {/* SelectedQuiz name */}
                <h3 className='h3'>{selectedQuiz.name}</h3>
              </Col>
            </Row>   
      {/*Quiz*/}
      <div id='quiz'>
       <Row id='questionRow'>
        <Col xs={6} md={4} id='questionCol'>
        {/*Question*/}
            <div>
              <h3 id='question'>
                QUESTION {currentQuestion + 1} of {selectedQuiz.questions.length}
              </h3>
            </div>
            <div>
              <p className='questionText'>{selectedQuiz.questions[currentQuestion].questionText}</p>
            </div>
            </Col>
                <Col xs={6} md={4}></Col>
              {/*Timer display*/}
                <Col xs={6} md={4} id='timerCol'>
                  {quizTimer && <div>TIMER: {timer}</div>}
                </Col>
      </Row>
        <div className='questions'>
          {/* Map through and randomize options */}
                {randomizeOptions(selectedQuiz.questions[currentQuestion].options).map(
                  (option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswerClick
                     (option === selectedQuiz.questions[currentQuestion].correctAnswer)}
                    >
                      {option}
                    </Button>
                  )
                )}
          </div>
             <Row>
                <Col xs={6} md={4}>
                  <div className='score'>
                    <p className='result'>Result: {score} of {selectedQuiz.questions.length}</p>
                  </div>
                </Col>
                <Col xs={6} md={4}></Col>
                <Col xs={6} md={4}>
                  {/* Button to move to next question */}
                  <Button type='button' onClick={handleNextQuestion}>
                    Next Question
                  </Button>
                  {/* Button to restart quiz */}
                  <Button type='reset' onClick={handleRestart}>Restart</Button>
                </Col>
             </Row>
        </div>
    </div>
  );
}
