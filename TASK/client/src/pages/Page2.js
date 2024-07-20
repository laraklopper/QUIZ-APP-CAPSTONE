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
  quizList,
  logout,
  quiz,
  setQuiz,
  fetchQuizzes
}) {
  // =========STATE VARIABLES====================
  // Quiz variables
  const [selectedQuizId, setSelectedQuizId] = useState('');//State to store the selected quizId
  // const [quiz, setQuiz] = useState(null);//Stores the fetched quiz data
  // const [questionIndex, setQuestionIndex] = useState(0)
  // Score Variables
  const [score, setScore] = useState(0);//State used to store current score
  // Timer variables
  const [timer, setTimer] = useState(null);//State to store the timer value
  const [quizTimer, setQuizTimer] = useState(false);//Boolean to toggle the timer 
  //============USE EFFECT HOOK==================
 /* useEffect to fetch quizzes when the component 
 mounts or when fetchQuizzes changes*/
useEffect(() => {
  fetchQuizzes(); //Callback function to fetch quizzes from the server(database)
}, [fetchQuizzes]); 
  // Dependency array: runs this effect whenever fetchQuizzes changes

  /*
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
  }, [id]);*/
  //=======EVENT LISTENERS============

   // Function to handle quiz selection
  const handleSelectQuiz = (event) => {
    setSelectedQuizId(event.target.value); // Set the selected quiz ID
  };

  // Function to start the quiz
  const handleQuizStart = () => {
    fetchQuiz(selectedQuizId); // Fetch the selected quiz data
    setQuizIndex(0); // Reset question index
    setScore(0); // Reset score
    if (quizTimer) {
      setTimer(30); // Set timer to 30 seconds for each question
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(interval); // Clear interval when timer reaches 1
            handleNextQuestion(); // Move to next question
            return null; // Stop the timer
          }
          return prevTimer - 1; // Decrement the timer
        });
      }, 1000);
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  };

//===============REQUESTS=======================
   // Function to fetch a single quiz
  const fetchQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      const response = await fetch(`http://localhost:3001/quiz/quizId/${quizId}`, {
        method: 'GET',//HTTP request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',//Specify the Content-Type in the payload as JSON
          'Authorization': `Bearer ${token}`, // Send token for authentication
        },
      });

      if (response.ok) {
        const quizData = await response.json(); // Parse response data
        setQuiz(quizData.quiz); // Set the fetched quiz data
      } else {
        throw new Error('Error fetching Quiz');//Throw an error message if the GET request is unsuccessful
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);//Log an error message in the console for debugging purposes
      setError('Error fetching quiz'); // Set error message
    }
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


    // Function to restart the quiz
  const handleRestart = () => {
    setQuizIndex(0); // Reset question index
    setScore(0); // Reset score
    setTimer(null); // Reset timer
    if (quizTimer) {
      handleQuizStart(); // Restart the quiz if timer is enabled
    }
  };
  // Function to handle answer selection and update the score if correct
  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);// Increment score if the answer is correct
    }
    handleNextQuestion();// Move to the next question
  };


  // ======JSX RENDERING==========
  return (
   <>
      <Header heading="GAME" />
      <section className='section1'>
        <Row>
          <Col>
            <h2 className='h2'>SELECT QUIZ</h2>
          </Col>
        </Row>
        <div>
          <Row>
            <Col xs={6} md={4} id='selectQuizCol'>
              <label htmlFor='quiz'>SELECT</label>
              <Form.Select value={selectedQuizId} onChange={handleSelectQuiz}>
                <option value=''>Select a quiz</option>
                {quizList.map((quiz) => (
                  <option key={quiz._id} value={quiz._id}>
                    {quiz.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}></Col>
            <Col xs={6} md={4}></Col>
          </Row>
        </div>
        <Col xs={6} md={4}></Col>
        <div>
          <div>
            <form>
              <Row>
                <Col md={12}>
                  <h3 className='quizName'>{quiz?.name}</h3> {/* Display quiz name */}
                </Col>
              </Row>
              <Row>
                <Col xs={6} md={4}></Col>
                <Col xs={6} md={4}>
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
                  <Button type='button' variant='primary' onClick={handleQuizStart}>
                    START QUIZ
                  </Button>
                </Col>
              </Row>
            </form>
          </div>
          {quiz && (
            <Quiz
              selectedQuiz={quiz} // Pass selected quiz data
              quizIndex={quizIndex} // Pass current question index
              handleAnswerClick={handleAnswerClick} // Pass answer click handler
              handleNextQuestion={handleNextQuestion} // Pass next question handler
              handleRestart={handleRestart} // Pass restart handler
              score={score} // Pass current score
              quizTimer={quizTimer} // Pass timer status
              timer={timer} // Pass current timer value
            />
          )}
        </div>
      </section>
      <Footer logout={logout} />
    </>
  );
}
