// Import necessary modules and packages
import React, { useEffect, useState } from 'react';
import '../CSS/Page2.css';
// Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import Quiz from '../components/Quiz';

// Page 2 function component
export default function Page2({
  // PROPS PASSED FROM PARENT COMPONENT
  quizList = [],
  logout,
  fetchQuizzes,
}) {
  // =========STATE VARIABLES====================
  // Quiz variables
  const [selectedQuiz, setSelectedQuiz] = useState(null); 
  const [currentQuestion, setCurrentQuestion] = useState(0); 
  // Score Variables
  const [score, setScore] = useState(0);
  // Timer variables
  const [timer, setTimer] = useState(null); 
  const [quizTimer, setQuizTimer] = useState(false); 

  //============USE EFFECT HOOK==================
  // Fetch quizzes when the component mounts
  useEffect (() => {
    fetchQuizzes()
  }, [fetchQuizzes])

  //=======EVENT LISTENERS============

  // Function to handle quiz selection
  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setTimer(null);
  };

//Function to move to next question
  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
  }

  // Function to restart the quiz
  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
  };

  // Start the quiz and initialize a timer if the timer option is selected
  const handleQuizStart = () => {
    if (quizTimer) {
      setTimer(30); // Set timer to 30 seconds for each question
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(interval);
            handleNextQuestion();
            return null;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
  };

  // Function to handle answer selection and update the score if correct
  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    handleNextQuestion();
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
                {/* Checkbox to enable timer */}
                <label id='addTimerLabel'>
                  <p className='labelText'>ADD TIMER:</p>
                  <input
                    type='checkbox'
                    checked={quizTimer}
                    onChange={(e) => setQuizTimer(e.target.checked)}
                    id='quizTimer'
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
