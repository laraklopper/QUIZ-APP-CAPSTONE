// Import necessary modules and packages
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
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
  const [score, setScore] = useState(0);//State to store the users score
  const [showScore, setShowScore] = useState(false)//Boolean value to display user score

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
    fetchQuizzes();// Fetch the quizzes when the component is mounted
  }, [fetchQuizzes]);

  //=======EVENT LISTENERS============
  // Function to handle quiz selection
  const handleSelectQuiz = (event) => {
    setSelectedQuizId(event.target.value); // Update the selected quiz ID
  };

  // Function to start the quiz
  const handleQuizStart = () => {
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
      handleQuizStart(); // Restart the quiz if the timer is enabled
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
    const fetchQuiz = async (e) => {//Define an async function to fetch a singleQuiz
    try {
      const quizId = e.target.value;// Get the selected quiz ID
      const token = localStorage.getItem('token');//Retrieve token from localstorage
      if (!token) return;

      const response = await fetch(`http://localhost:3001/quiz/findQuiz/${quizId}`, {
        method: 'GET',//HTTP request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quiz');//Throw an error message if the GET request is unsuccessful
      }

       const fetchedQuiz = await response.json(); // Parse the JSON response
      const shuffledQuestions = shuffleArray(fetchedQuiz.questions); // Shuffle the questions      
      setQuizList(prevQuizList => prevQuizList.map(q => q._id === quizId ? fetchedQuiz : q)); // Update the quiz list
      setQuizName(fetchedQuiz.quizName); // Set the quiz name
      setQuestions(shuffledQuestions); // Set the questions
    } catch (error) {
      setError(`Error fetching quiz: ${error.message}`);// Set the ErrorState with an error message
      console.error(`Error fetching quiz: ${error.message}`);//Log an error message in the console for debugging purposes
    }
  };

  // //Function to calculate score
  //   const calculateScore = () => {
  //   let score = 0;
  //   questions.forEach((question, index) => {
  //     if (answers[index] === question.correctAnswer) {
  //       score++;
  //     }
  //   });
  //   setScore(score);
  //   setShowScore(true);
  // };
  


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
                    <h3 className='quizName'>{quizName}</h3>
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
