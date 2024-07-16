// Import necessary modules and packages
import React, { useEffect, useState } from 'react';
import '../CSS/Page2.css';
// Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
// Components
import Header from '../components/Header';
import Footer from '../components/Footer';

// Page 2 function component
export default function Page2(
  {// PROPS PASSED FROM PARENT COMPONENT
  quizList = [],
  questions = [],
  logout,
  fetchQuizzes,
}) {
  // =========STATE VARIABLES====================
  // Quiz variables
  const [selectedQuiz, setSelectedQuiz] = useState(null);//State used to store the selected quiz
  const [currentQuestion, setCurrentQuestion] = useState(0);//State to store the current question
  // Score Variables
  const [score, setScore] = useState(0);//State to store the users score
  // Timer variables
  const [timer, setTimer] =useState(null);//State to store the timer value
  const [quizTimer, setTimer] = useState(false);//Boolean to indicate if the timer should be used

  //-------------------------------------

// useEffect to fetch quizzes when component mounts
  useEffect(() => {
    fetchQuizzes()
  },[fetchQuizzes])
  
  const handleQuizSelect = () => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setTimer(null)
  }

  const handleRestart = () => {
    setCurrentQuestion();
    setScore();
  }
  
//Function to move to next question
  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
  }

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

    // Handle answer selection and update the score if correct
  const handleAnswerClick = (isCorrect) => {
    if(isCorrect){
      setScore(score-1);
    }
    handleNextQuestion()
  }

    // Randomise the order of answer options
 const randomizeOptions = (options) => {
  // Sort the options array using a custom comparison function
   
  return options.sort(() => //Uses the sort method on the options array. The sort method sorts the array in place and returns the sorted array.
    // Generate a random number between 0 and 1, then subtract 0.5
    // This results in a random number between -0.5 and 0.5
    Math.random() - 0.5//Math.random() generates a random floating-point number between 0 (inclusive) and 1 (exclusive).
                      //Subtracting 0.5 from this random number results in a value between -0.5 and 0.5.
                      //The sort method uses these random values to decide the order of elements, effectively shuffling the array.
  );
};

  // ======JSX RENDERING==========
  return (
    <>
      {/* Header */}
      <Header heading="GAME" />
      {/* section 1 */}
      <section className='section1'>
        <div>
        <Row>
          <Col><h2 className="h2">SELECT QUIZ</h2></Col>
        </Row>
        <Row>
        <Col xs={6} md={4}>
    <Drowdown onSelect={handleQuizSelect}>
    
    <Dropdown.Toggle variant="primary" id='dropDown'>
    <p>SELECT QUIZ</p>
    </Dropdown.toggle>
    <Dropdown.Menu>
      {quizList.map((quiz)=> (
        <Dropdown.Item key={quiz._id} onClick={() => {handleQuizSelect(quiz)}}>
          {quiz.name}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
    </Dropdown>
        </Col>
        <Col xs={6} md={4}>
          <label>
        <input/>
        ADD TIMER
          </label>
        </Col>
        <Col xs={6} md={4}>
          <Button onClick={handleQuizStart} type='button' variant='primary'>PLAY</Button>
        </Col>
      </Row>
        </div>
{selectedQuiz && (
  <div>
  <h2 className={selectedQuiz.name}>
  
  </div>
)}
    
        {!quizStarted ? (
          <div>
            <Row>
              <Col>
                <Button variant='primary' onClick={startQuiz}>
                  PLAY
                </Button>
              </Col>
            </Row>
          </div>
        ) : currentQuestion < questions.length ? (
          <Quiz
            timer={timer}
            setSelectedQuiz={setSelectedQuiz}
            setTimerEnabled={setTimerEnabled}
            timerEnabled={timerEnabled}
            questions={questions}
            currentQuestion={currentQuestion}
            handleOptionClick={handleOptionClick}
            lastQuestion={lastQuestion}
            handleNextQuestion={handleNextQuestion}
          />
        ) : (
          <Score
            timer={setTimer}
            score={score}
            setCurrentQuestion={setCurrentQuestion}
            setQuizStarted={setQuizStarted}
            setLastQuestion={setLastQuestion}
            setTimer={setTimer}
          />
        )}
      </section>
     <Footer logout={logout}/>
    </>
  );
}
