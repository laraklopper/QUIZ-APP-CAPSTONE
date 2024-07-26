// Import necessary modules and packages
import React, { useEffect, useState } from 'react';
import '../CSS/Page2.css';
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import Quiz from '../components/Quiz';

// Page 2 function component
export default function Page2(
  {
  quizList,
  logout,
  fetchQuizzes,
  setError,
  quiz,
  setQuiz
}) {
   // =========STATE VARIABLES====================
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(null);
  const [quizTimer, setQuizTimer] = useState(false);

    //============USE EFFECT HOOK==================
  /* useEffect to fetch quizzes when the component 
  mounts or when fetchQuizzes changes*/
  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

    // Function to handle quiz selection
  const handleSelectQuiz = (event) => {
    setSelectedQuizId(event.target.value);
  };

  // Function to start the quiz
  const handleQuizStart = () => {
    fetchQuiz(selectedQuizId);
    setQuizIndex(0);
    setScore(0);
    if (quizTimer) {
      setTimer(30);
    }
  };

  useEffect(() => {
    if (quizTimer && timer !== null) {
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
      return () => clearInterval(interval);
    }
  }, [quizTimer, timer]);

  // Function to move to the next question
  const handleNextQuestion = () => {
    if (quizIndex < quiz.questions.length - 1) {
      setQuizIndex(quizIndex + 1);
      if (quizTimer) setTimer(30);
    } else {
      setQuiz(null);
      setTimer(null);
    }
  };

    // Function to restart the quiz
  const handleRestart = () => {
    setQuizIndex(0);
    setScore(0);
    setTimer(null);
    if (quizTimer) {
      handleQuizStart();
    }
  };

    // Function to handle answer selection and update the score if correct
  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    handleNextQuestion();
  };

   //=========REQUEST================
  //-----------GET-----------------------
  // Function to fetch a single quiz
  const fetchQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/quiz/quizId/${quizId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const quizData = await response.json();
        setQuiz(quizData.quiz);
      } else {
        throw new Error('Error fetching Quiz');
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('Error fetching quiz');
    }
  };

    // ==========JSX RENDERING==========
  return (
    <>
    {/* Header */}
      <Header heading="GAME" />
     {/* Section1 */}
      <section className='section1'>
        <div>
          <Row>
            <Col>
              <h2 className='h2'>SELECT QUIZ</h2>
            </Col>
          </Row>
          <Row>
            <Col md={4}></Col>
            <Col xs={6} md={4} id='selectQuizCol'>
    {/* Form to select quiz */}
              <label htmlFor='quizSelect'><p className='labelText'>SELECT: </p></label>
              <Form.Select
                id='quizSelect'
                value={selectedQuizId}
                onChange={handleSelectQuiz}>
                <option value=''>Select a quiz</option>
                {quizList.map((quiz) => (
                  <option key={quiz._id} value={quiz._id}>
                    {quiz.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={6} md={4}></Col>
          </Row>
        </div>
        <div>
                {/* Display a form to start the selected quiz*/}
          {selectedQuizId && (
            <div id='quizDisplayForm'>
            {/* Display quiz name */}
              <form>
                <Row>
                  <Col md={12}>
                    <h3 className='quizName'>{quiz?.name}</h3>
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
                  {/* Button to start quiz */}
                    <Button type='button' variant='primary' onClick={handleQuizStart}>
                      START QUIZ
                    </Button>
                  </Col>
                </Row>
              </form>
            </div>
          )}
          {quiz && (
            <Quiz
              selectedQuiz={quiz}
              quizIndex={quizIndex}
              handleAnswerClick={handleAnswerClick}
              handleNextQuestion={handleNextQuestion}
              handleRestart={handleRestart}
              score={score}
              quizTimer={quizTimer}
              timer={timer}
            />
          )}
        </div>
      </section>
      <Footer logout={logout} />
    </>
  );
}
