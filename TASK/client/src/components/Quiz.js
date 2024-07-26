// Import necessary modules and packages
import React from 'react';
// Bootstrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// Quiz function component
export default function Quiz({
  selectedQuiz,          // The selected quiz data
  quizIndex,             // Current question index
  handleAnswerClick,     // Function to handle answer click
  handleNextQuestion,    // Function to move to the next question
  handleRestart,         // Function to restart the quiz
  score,                 // Current score
  quizTimer,             // Boolean to determine if the timer is enabled
  timer,                 // Current timer value
}) {

  //============EVENT LISTENERS

  // Function to shuffle array
   const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

    // // Function to randomize the answer options
  // const randomizeOptions = (options) => {
  //   return options.sort(() => Math.random() - 0.5); // Shuffle options randomly
  // };

  // Function to randomize the answer options
  // const randomizeOptions = (options) => {
  //   const answers= [...options]
  //   answers.push(selectedQuiz.questions[quizIndex].correctAnswer);
  //   const possibleAnswers = Math.random(answers)
  //   return possibleAnswers
  // };
  // Function to randomize the answer options
   const randomizeOptions = () => {
    const answers = [...selectedQuiz.questions[quizIndex].options];
    answers.push(selectedQuiz.questions[quizIndex].correctAnswer);
    return shuffleArray(answers);
  };


  const currentQuestion = selectedQuiz.questions[quizIndex]; // Get the current question

  // ==========JSX RENDERING==========
  return (
    <div id='quizDisplay'>
      <Row>
        <Col>
          <h3 className='h3'>{selectedQuiz.name}</h3> {/* Display quiz name */}
        </Col>
      </Row>
      <div id='quiz'>
        <Row>
          <Col xs={6} md={4} id='questionCol'>
            <div>
              <h3 className='h3'>
                QUESTION {quizIndex + 1} of {selectedQuiz.questions.length} {/* Display current question number */}
              </h3>
            </div>
            <div>
              <p className='questionText'>{currentQuestion.questionText}</p> {/* Display question text */}
            </div>
          </Col>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4} id='timerCol'>
            {quizTimer && <div>TIMER: {timer}</div>} {/* Display timer if enabled */}
          </Col>
        </Row>
        <div>
          {randomizeOptions(currentQuestion.options).map((option, index) => (
            <Button
              key={index} // Unique key for each option
              onClick={() => handleAnswerClick(option === currentQuestion.correctAnswer)} // Check if the selected option is correct
            >
              {option} {/* Display answer option */}
            </Button>
          ))}
        </div>
        <Row>
          <Col xs={6} md={4}>
            <div>
              <p>Result: {score} of {selectedQuiz.questions.length}</p> {/* Display current score */}
            </div>
          </Col>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4}>
            <Button type='button' onClick={handleNextQuestion}>
              Next Question
            </Button>
            <Button type='reset' onClick={handleRestart}>
              Restart
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
