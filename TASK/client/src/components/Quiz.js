// Import necessary modules and packages
import React, { useEffect, useState } from 'react'; // Import React to create functional components
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
    quizName
}) {
    //=============STATE VARIABLES=====================
const [timeLeft, setTimeLeft] = useState(10);// State to track the remaining time for the timer

    // useEffect to handle the countdown logic
  useEffect(() => {
    if (quizTimer) {
      // Set up an interval to decrement the timer every second
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval); // Clear interval when timer reaches 0
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      // Cleanup the interval on component unmount
      return () => clearInterval(interval);
    }
  }, [quizTimer]);
  
    if (!selectedQuiz || !questions || questions.length === 0) {
    return <div>Loading...</div>
  }

  
    //Function to format timer
  const formatTimer = (time) => {
    if (time === null) return '00:00';// Return '00:00' if time is null
    const minutes = Math.floor(time / 60);// Calculate minutes
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
//==================JSX RENDERING======================
  
  return (
    <div id='quizDisplay'>
      <Row>
        <Col>
          <h3 className='h3'>{selectedQuiz.quizName}</h3>
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
          {/*Display the timer if enabled */}
            {quizTimer && <div id='timer'>TIMER: {formatTimer(timer)}</div>}
          </Col>
        </Row>
        <div>
    <Row>
        <Col md={2}></Col>
        <Col md={7}>
          <h3 className='h3'>{questions[questionIndex].questionText}</h3>
        </Col>
        <Col md={3}></Col>
      </Row>
    // Map over each option in the current question to render radio buttons
           {questions[quizIndex].options.map((option, index) => (
            <div key={option}>
              <input
                type='radio'
                name='answer'
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
