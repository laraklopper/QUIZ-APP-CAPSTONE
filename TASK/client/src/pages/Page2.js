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

// Page 2 function component
export default function Page2({
  // PROPS PASSED FROM PARENT COMPONENT
  quizList = [],
  logout,
  fetchQuizzes,
}) {
  // =========STATE VARIABLES====================
  // Quiz variables
  const [selectedQuiz, setSelectedQuiz] = useState(null); // State used to store the selected quiz
  const [currentQuestion, setCurrentQuestion] = useState(0); // State to store the current question
  // Score Variables
  const [score, setScore] = useState(0); // State to store the user's score
  // Timer variables
  const [timer, setTimer] = useState(null); // State to store the current timer
  const [quizTimer, setQuizTimer] = useState(false); // Boolean to indicate if the timer should be used

  //==============================
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

  // Function to randomize the answer options
 const randomizeOptions = (options) => {
  // Sort the options array using a custom comparison function
  return options.sort(() => 
    // Generate a random number between 0 and 1, then subtract 0.5
    // This results in a random number between -0.5 and 0.5
    Math.random() - 0.5//Subtracting 0.5 from this random number results in a value between -0.5 and 0.5.
  );
};


  // ======JSX RENDERING==========
  
  return (
    <>
      {/* Header */}
      <Header heading="GAME" />
      {/* Section 1 */}
      <section className='section1'>
        {/* Form to select quiz */}
        <div id='selectQuiz'>
          <Row>
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
            <div>
              <Row>
                <Col>
                  <h3 className='h3'>{selectedQuiz.name}</h3>
                </Col>
              </Row>
              <div>
                <Row>
                  <Col xs={6} md={4}>
                    <div>
                      <h3>QUESTION {currentQuestion + 1} of {selectedQuiz.questions.length}</h3>
                    </div>
                    <div>
                      <p>{selectedQuiz.questions[currentQuestion].questionText}</p>
                    </div>
                  </Col>
                  <Col xs={6} md={4}></Col>
                  <Col xs={6} md={4}>
                    {quizTimer && <div>TIMER: {timer}</div>}
                  </Col>
                </Row>
                <div>
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
                    <div>
                      <p>Result: {score} of {selectedQuiz.questions.length}</p>
                    </div>
                  </Col>
                  <Col xs={6} md={4}></Col>
                  <Col xs={6} md={4}>
                  {/* Buttom to move to next question */}
                    <Button type='button' onClick={handleNextQuestion}>
                      Next Question
                      </Button>
                      {/* button to restart quiz */}
                    <Button type='reset' onClick={handleRestart}>Restart</Button>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer logout={logout} />
    </>
  );
}
