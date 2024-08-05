// Import necessary modules and packages
import React, { useCallback, useEffect, useState} from 'react';
import '../CSS/Page2.css';
// Bootstrap
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
  {// PROPS PASSED FROM PARENT COMPONENT
    quizList,
    setQuizList,
    logout,
    fetchQuizzes,
    setError,
    quiz,
    setQuiz,  
    setQuizName,
    setQuestions,
    questions
    }
) {
  // =========STATE VARIABLES====================
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [quizIndex, setQuizIndex] = useState(0);
  const [startQuiz, setQuizStarted] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(null)
  //Score variables
  const [score, setScore] = useState(0);
  //Timer variables
  const [timer, setTimer] = useState(null);
  const [quizTimer, setQuizTimer] = useState(false);
  
  //============USE EFFECT HOOK==================
  /* useEffect to fetch quizzes when the component 
  mounts or when fetchQuizzes changes*/
  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

//==========================================
  // Fisher-Yates shuffle algorithm to randomize array elements
const shuffleArray = (array) => {
  let shuffledArray = array.slice(); 
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); 
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;  // Return the shuffled array
};

const shuffleQuestions = (questions) => {
  return questions.map((question) => {
    const options = shuffleArray(
      [...question.incorrectAnswers, question.correctAnswer]);
    return { ...question, options };
  });
};

  //=======EVENT LISTENERS============
  // Function to handle quiz selection
  const handleSelectQuiz = (event) => {
    setSelectedQuizId(event.target.value);
  };


  // Function to move to the next question
  const handleNextQuestion = useCallback(() => {
    if (quizIndex < quiz.questions.length - 1) {
      setQuizIndex(quizIndex + 1); 
      if (quizTimer) setTimer(30);
    } 
    else {
      setQuizStarted(false)
      setQuiz(null);   
      setSelectedQuizId('')
      setTimer(null); 
      setQuestionIndex(null)
    }
  },[ quiz, quizTimer, setQuiz, quizIndex]);

  // Function to restart the quiz
  const handleRestart = () => {
    setQuizIndex(0); 
    setScore(0); 
    setTimer(null); 
    if (quizTimer) {
      handleQuizStart(); 
    }
  };


  //=========REQUEST================
  //-----------GET-----------------------
  // Function to fetch a single quiz
  const fetchQuiz = useCallback(async (quizId) => {
    try {
     
      if (!quizId) return;// If no quiz ID is selected, exit the function
      const token = localStorage.getItem('token');
      if(!token) return
      // Send a GET request to fetch quiz data from the server
      const response = await fetch(`http://localhost:3001/quiz/findQuiz/${quizId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })

      //Response handling
      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }

      // Parse the JSON response to get the quiz data
      const fetchedQuiz = await response.json();
      // Shuffle the questions to randomize their order
      const shuffledQuestions = shuffleArray(fetchedQuiz.questions);
      setQuizList(prevQuizList =>
        prevQuizList.map((q) => (q._id === quizId ? fetchedQuiz : q))
      );
      setQuizName(fetchedQuiz.quizName);
      setQuestions(shuffledQuestions)
      setQuiz(fetchedQuiz)
    } 
    catch (error) {
      setError(`Error fetching quiz: ${error.message}`);
      console.error(`Error fetching quiz: ${error.message}`);
    }
  }, [setQuizList, setError, setQuestions, setQuizName, setQuiz])

  // Function to start the quiz
  const handleQuizStart = useCallback(async(e) => {
    e.preventDefault()
    if (!selectedQuizId) return;
    await fetchQuiz(selectedQuizId)
    setQuizStarted(true)

    setQuizIndex(0);
    setScore(0);
    if (quizTimer) {
      setTimer(30);
    }
  }, [selectedQuizId, quizTimer, fetchQuiz]);
  
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
              <label id='selectQuizLabel'>
                <p className='labelText'>SELECT: </p>
                </label>
                {/* Form to select quiz */}               
              <Form.Select  
              id='quizSelect' 
              value={selectedQuizId}
                // Handles selection change and fetches quiz data
              onChange={(e) => {handleSelectQuiz(e)}}
              >
                {/* Default option prompting the user to select a quiz */}
                <option value=''>Select a quiz</option>
                {/* Map over the quizList array to create 
                an option for each quiz */}
                {quizList.map((quiz) => (
                  <option key={quiz._id} value={quiz._id}>
                    {/* Display quiz name */}
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
              {/* Form to start quiz */}
              <form onSubmit={handleQuizStart}>
                <Row>
                  <Col md={12}>
                    {/* Display quiz name */}
                    <h3 className='quizName'>{quiz ? quiz.name : ''}</h3>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} md={4}></Col>
                  <Col xs={6} md={4}>
                  {/* Checkbox to add timer */}
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
                    <Button 
                    type='submit' 
                    variant='primary' 
                    >
                      START QUIZ
                    </Button>
                  </Col>
                </Row>
              </form>
            </div>
          )}
          {/* QUIZ */}
          {quiz && startQuiz && (
            // Quiz component
            <Quiz
              selectedQuiz={quiz} 
              quizIndex={quizIndex} 
              questionIndex={questionIndex}
              setQuestionIndex={setQuestionIndex}
              handleNextQuestion={handleNextQuestion}
              handleRestart={handleRestart}
              score={score} 
              quizTimer={quizTimer} 
              timer={timer} 
              questions={questions}
              setScore={setScore}
            />
          )}
        </div>
      </section>
      {/* Footer */}
      <Footer logout={logout} />
    </>
  );
}
