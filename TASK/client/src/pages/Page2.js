// Import necessary modules and packages
import React, { useCallback, useEffect, useState, useRef } from 'react';
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
  {//PROPS PASSED FROM PARENT COMPONENT
  quizList,
    setQuizList,
    logout,
    fetchQuizzes,
    setError,
    quiz,
    currentQuestion,
    setQuiz,
    quizName,
    setQuizName,
    questions,
    setQuestions
}) {
   // =========STATE VARIABLES====================
  const [selectedQuizId, setSelectedQuizId] = useState('');// Holds the ID of the selected quiz
  const [quizIndex, setQuizIndex] = useState(0);// Index of the current question
  //Timer variables
  const [timer, setTimer] = useState(null);//State to store the quiz Timer
  const [quizTimer, setQuizTimer] = useState(false);//// Boolean to indicate if the timer is enabled
  //Score variables
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false)//Boolean value to display user score
  const [startQuiz, setQuizStarted] = useState(false)//Boolean to check if the quiz has started

    // Ref to manage timer intervals
  const timerRef = useRef(null);
   //========================================================
  // Fisher-Yates shuffle algorithm to randomize array elements
    const shuffleArray = (array) => {
    let shuffledArray = array.slice(); // Create a copy of the array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }
    return shuffledArray;
  };
    //============USE EFFECT HOOK==================
  /* useEffect to fetch quizzes when the component 
  mounts or when fetchQuizzes changes*/
  useEffect(() => {
    // Fetch the quizzes when the component is mounted
    fetchQuizzes();
  }, [fetchQuizzes]);

  //=======EVENT LISTENERS============
  // Function to handle quiz selection
  const handleSelectQuiz = (event) => {
    setSelectedQuizId(event.target.value); // Update the selected quiz ID
  };

  // Function to start the quiz
  const handleQuizStart = () => {
    setQuizStarted(true);//Change the quizStarted state to indicate the quiz has
    setQuizIndex(0); // Reset the question index to 0
    setScore(0); // Reset the score to 0
    if (quizTimer) {
      setTimer(30); // Set the timer to 30 if the timer is enabled
    }
  };

  // Function to move to the next question
  const handleNextQuestion = () => {
    if (quizIndex < questions.length - 1) {
      setQuizIndex(quizIndex + 1); // Move to the next question
      if (quizTimer) setTimer(30); // Reset the timer for the next question
    } else {
      setQuiz(null); // End the quiz
      setTimer(null); // Clear the timer
      setShowScore(true); // Show the final score
    }
  };
  // Function to restart the quiz
  const handleRestart = () => {
    setQuizIndex(0); // Reset the question index to 0
    setScore(0); // Reset the score to 0
    setTimer(null); // Clear the timer
    setShowScore(false); // Hide the score
    if (quizTimer) {
       // Restart the quiz if the timer is enabled
      handleQuizStart();
    }
  };

  // Function to handle answer selection and update the score if correct
  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1); // Increment the score if the answer is correct
    }
    handleNextQuestion(); // Move to the next question
  };
     //=========REQUEST================
  //-----------GET-----------------------
  // Function to fetch a single quiz
  const fetchQuiz = useCallback(async (e) => {
    /*The useCallback hook ensures that fetchQuiz is memoized and only recreated when the specified 
    dependencies (setQuizList, setError, setQuestions, setQuizName) change. */
    try {
      const quizId = e.target.value
      if(!quizId) return;
      const token = localStorage.getItem('token');
      if(!token) return

      const response = await fetch(`http://localhost:3001/quiz/findQuiz/${quizId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }

      const fetchedQuiz = await response.json();
      const shuffledQuestions = shuffleArray(fetchedQuiz.questions);
      setQuizList(prevQuizList =>
        prevQuizList.map(q => q._id === quizId ? fetchedQuiz : q)
      );
      setQuizName(fetchedQuiz.quizName);
      setQuestions(shuffledQuestions)


    } catch (error) {
      setError(`Error fetching quiz: ${error.message}`);
      console.error(`Error fetching quiz: ${error.message}`);
    }
  }, [setQuizList, setError, setQuestions, setQuizName])

    // Timer countdown
  useEffect(() => {
    if (timer === null) return;

    timerRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          handleNextQuestion();
          return null;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timer]);
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
              <label htmlFor='quizSelect'>
                <p className='labelText'>SELECT: </p>
              </label>
              <Form.Select
                id='quizSelect'
                value={selectedQuizId}
                 onChange={(e) => {
                  handleSelectQuiz(e);
                  fetchQuiz(e); // Ensure the quiz is fetched and selected
                }}>
                <option value=''>Select a quiz</option>
                {quizList.map(quiz => (
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
           {questions.length > 0 && quizName && (
            <div id='quizDisplayForm'>
              <form>
                <Row>
                  <Col md={12}>
                    {/* Display quiz name */}
                    <h3 className='quizName'>{quiz ? quiz.name : ''}</h3>
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
                    <Button type='button' variant='primary' onClick={handleQuizStart}>START QUIZ</Button>
                  </Col>
                </Row>
              </form>
            </div>
          )}
          {questions.length > 0 && (
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
           {/*Footer*/}
      <Footer logout={logout} />
    </>
  );
}
