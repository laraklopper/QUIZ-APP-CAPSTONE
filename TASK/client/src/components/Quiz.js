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
    setScore,
  quizTimer,
  timer,
    quizName
}) {
    //=============STATE VARIABLES=====================
const [timeLeft, setTimeLeft] = useState(10);// State to track the remaining time for the timer
  const [selectedOption, setSelectedOption] = useState(null);  // State to keep track of the selected option
  
  const optionIds = ['A', 'B', 'C', 'D'];// Option identifiers (e.g., A, B, C, D)

  // Effect hook to manage countdown timer
  useEffect(() => {
    if (!quizTimer) return; // Exit if timer is not enabled

    // Initialize timer with the provided timer value
    setTimeLeft(timer);
    
    // Set up an interval to decrement the timer every second
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval); // Stop the interval when time is 0
          handleNextQuestion(); // Move to the next question when time is up
          return 0;
        }
        return prevTime - 1; // Decrement the timer
      });
    }, 1000); // 1000 milliseconds = 1 second
    
    /* Cleanup function to clear the interval when the component unmounts or dependencies change*/
    return () => clearInterval(interval);
  }, [quizTimer, timer, handleNextQuestion]);
  
  // Conditional rendering if the quiz data or questions are not loaded yet
  if (!selectedQuiz || !questions || questions.length === 0) {
    return <div>Loading...</div>;
  }

  // Function to format the timer into mm:ss format
  const formatTimer = (time) => {
    if (time === null) return '00:00'; // Return default if time is null
    const minutes = Math.floor(time / 60); // Calculate minutes
    const seconds = time % 60; // Calculate seconds
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // Format timer
  };
  //============EVENT LISTENERS=================
   // Function to handle answer selection and update the score if correct
  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1); 
    }
    handleNextQuestion(); 
  };

   // Function to handle option click and update the selected option
  const handleOptionClick = (option) => {
    setSelectedOption(option);  // Update the state to reflect the selected option
    handleAnswerClick(option);  // Call the provided handler function with the selected option

  };
//==================JSX RENDERING======================
  
  return (
    <div id='quizDisplay'>
      <Row>
        <Col>
    {/* Display quiz name */}
          <h3 className='h3'>{selectedQuiz.quizName}</h3>
        </Col>
      </Row>
      <div>
        <Row>
          <Col xs={6} md={4} id='questionCol'>
            <div>
    {/* Display current question text */}
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
            <div key={index}>
             {/* Render a radio button for each option */}
              <input
                type='radio'// Input type is 'radio' to allow only one selection per group
                name='answer'// All radio buttons share the same name so only one can be selected at a time
                value={option}// The value of the radio button is set to the text of the option
                checked={selectedOption === option} // Ensure radio button reflects selected state
                onClick={() => handleOptionClick(option === questions[quizIndex].correctAnswer)}
              />
              {/* Display option label with identifier (e.g., A, B, C, D) */}
              {optionIds[index]} {option} 
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
