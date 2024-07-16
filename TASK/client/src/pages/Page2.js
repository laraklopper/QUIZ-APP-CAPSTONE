// Import necessary modules and packages
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import '../CSS/Page2.css';//Import CSS stylesheet
// Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap
import Dropdown from 'react-bootstrap/Dropdown';//Import the Dropdown component from react-bootstrap
// Components
import Header from '../components/Header';//Import the Header component from '../components/Header'
import Footer from '../components/Footer';//Import the Footer component from '../components/Footer'
import Quiz from '../components/Quiz';//Import the Quiz component from '../components/Quiz'

// Page 2 function component
export default function Page2({//Export default Page2 function component 
  // PROPS PASSED FROM PARENT COMPONENT
  quizList = [],
  logout,
  fetchQuizzes,
}) {
  // =========STATE VARIABLES====================
  // Quiz variables
  const [selectedQuiz, setSelectedQuiz] = useState(null); //State used to store the selected quiz
  const [currentQuestion, setCurrentQuestion] = useState(0); // State to store the current question
  // Score Variables
  const [score, setScore] = useState(0);// State to store the user's score
  // Timer variables
  const [timer, setTimer] = useState(null); // State to store the current timer
  const [quizTimer, setQuizTimer] = useState(false); // Boolean to indicate if the timer should be used

  //============USE EFFECT HOOK==================
 // useEffect to fetch quizzes when the component mounts or when fetchQuizzes changes
useEffect(() => {
  fetchQuizzes(); // Call the fetchQuizzes function to retrieve the quiz list
}, [fetchQuizzes]); // Dependency array: runs this effect whenever fetchQuizzes changes


  //=======EVENT LISTENERS============

  // Function to handle quiz selection
const handleSelectQuiz = (quiz) => {
  setSelectedQuiz(quiz);// Set the selected quiz to the quiz chosen by the user.
  setCurrentQuestion(0);// Reset the current question index to 0, starting from the first question
  setScore(0); // Reset the user's score to 0 to ensure the users score starts at 0 when a new quiz is selected 
  setTimer(null); // Clear the timer (if any), setting it to null
};

//Function to move to next question
  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);// Increment the current question index by 1.
  }

  // Function to restart the quiz
  const handleRestart = () => {
    setCurrentQuestion(0); // Reset the current question index to 0 (first question)
    setScore(0);  // Reset the score to 0
  };

  // Start the quiz and initialize a timer if the timer option is selected
  const handleQuizStart = () => {
    //Conditional rendering to check if the quiz timer is enabled
    if (quizTimer) {
      setTimer(30); // Set timer to 30 seconds for each question
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
         
          if (prevTimer === 1) { 
            // When the timer reaches 1 second, clear the interval and move to the next question
            clearInterval(interval); // Stop the interval from running
            handleNextQuestion();// Call the handleNextQuestion function to move to the next question
            return null;//Reset the timer to idicate its no longer active
          }
          return prevTimer - 1;//Decrease the timer by one second
        });
      }, 1000);//Set the interval to 1 second
    }
  };

  // Function to handle answer selection and update the score if correct
  const handleAnswerClick = (isCorrect) => {
    //Conditional rendering to check if the question is correct
    if (isCorrect) {
      // If correct, increment the score by 1
      setScore(score + 1);
    }
    handleNextQuestion();/*Call handleNextQuestion to move to 
    next quiz question, regardless of whether the answer was correct or not*/
  };


  // ======JSX RENDERING==========
  return (
    <>
      {/* Header */}
      <Header heading="GAME" />
      {/* Section 1 */}
      <section className='section1'>
        {/* Form to select quiz */}
        <div id='selectQuizForm'>
          <Row className='selectQuizForm'>
            <Col>
              <h2 className='h2'>SELECT QUIZ</h2>
            </Col>
          </Row>
          <div>
            <Row>
              <Col xs={6} md={4}>
                {/* Dropdown to select quiz */}
                <Dropdown onSelect={handleSelectQuiz}>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    SELECT QUIZ
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {/* Map through the quizList to display each quiz */}
                    {quizList.map((quiz) => (
                      <Dropdown.Item key={quiz._id} onClick={() => handleSelectQuiz(quiz)}>
                        {quiz.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col xs={6} md={4}>
                <label id='addTimerLabel'>
                  <p className='labelText'>ADD TIMER:</p>
                    {/* Checkbox input to toggle the timer feature */}
                  <input
                    type='checkbox'//Specify the input type as checkbox
                    checked={quizTimer}// Sets the checkbox state based on quizTimer
                    onChange={(e) => setQuizTimer(e.target.checked)} // Updates quizTimer state when changed
                    id='quizTimer' // Unique ID for the checkbox
                  />
                </label>
              </Col>
              <Col xs={6} md={4}>
                {/* Button to start the quiz */}
                <Button 
                variant="primary" 
                type='button' 
                onClick={handleQuizStart}>
                  PLAY
                  </Button>
              </Col>
            </Row>
          </div>
        </div>
        <div>
          {/* Display selected quiz and questions */}
          {selectedQuiz && (
           <Quiz 
           selectedQuiz={selectedQuiz}
           currentQuestion={currentQuestion}
           handleAnswerClick={handleAnswerClick}
           quizTimer={quizTimer}
           timer={timer}
           score={score}
           handleRestart={handleRestart}
           />
          )}
        </div>
      </section>
      <Footer logout={logout} />
    </>
  );
}
