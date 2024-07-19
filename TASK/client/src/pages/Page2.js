// Import necessary modules and packages
import React, { useEffect, useState } from 'react';
import '../CSS/Page2.css';
// Bootstrap
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
import Button from 'react-bootstrap/Button'; 
import Dropdown from 'react-bootstrap/Dropdown';
// import Form from 'react-bootstrap/Form';
// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import Quiz from '../components/Quiz';

// Page 2 function component
export default function Page2({//Export default Page2 function component 
  // PROPS PASSED FROM PARENT COMPONENT
  quizList = [],
  logout,
  quiz,
  setQuiz,
  fetchQuizzes
}) {
  // =========STATE VARIABLES====================
  // Quiz variables
  const [selectedQuiz, setSelectedQuiz] = useState(null); 
  const [questionIndex, setQuestionIndex] = useState(0)
  // Score Variables
  //const [score, setScore] = useState(0);
  // Timer variables
  const [timer, setTimer] = useState(null);
  const [quizTimer, setQuizTimer] = useState(false); 
  //============USE EFFECT HOOK==================
 /* useEffect to fetch quizzes when the component 
 mounts or when fetchQuizzes changes*/
useEffect(() => {
  fetchQuizzes(); 
}, [fetchQuizzes]); 
  // Dependency array: runs this effect whenever fetchQuizzes changes

useEffect(() => {
  //Function to fetch a single quiz
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/quiz/${id}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }
        
        const quizData = await response.json();
        setQuiz(quizData.quiz);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [id]);
  //=======EVENT LISTENERS============

  // Function to handle quiz selection
const handleSelectQuiz = (quiz) => {
  setSelectedQuiz(quiz);
  setQuestionIndex(0);
  setScore(0);
  setTimer(null); 
};

//Function to move to next question
  const handleNextQuestion = () => {
    if(questionIndex < selectedQuiz.questions.length - 1){
      setQuestionIndex(questionIndex + 1)
    }
    else(
      setSelectedQuiz(null);
      setTimer(null)
    )
  }
/*
const handleNext = () => {
  setQuestionIndex(questionIndex + 1);
  if(questionIndex == selectedQuiz.questions.length){
    //quiz completed
    //post score to database
  }
}
*/
  // Function to restart the quiz
  const handleRestart = () => {
    setQuestionIndex(0); // Reset the current question index to 0 (first question)
    setScore(0);  // Reset the score to 0
  };

  // Start the quiz and initialize a timer if the timer option is selected
  const handleQuizStart = () => {
    setQuestionIndex()  
    setScore(0)
    if (quizTimer) {
      setTimer(30); // Set timer to 30 seconds for each question => change to 10
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) { 
            clearInterval(interval);
            handleNextQuestion();
            return null;
          }
          return prevTimer - 1;
        });
      }, 1000);//Set the interval to 1 second
      return () => clearInterval(interval);// Clear interval on component unmount
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
                <label id='addTimerLabel'>
                  <p className='labelText'>ADD TIMER:</p>
                    {/* Checkbox input to enable timer*/}
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
           questionIndex={questionIndex}
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
