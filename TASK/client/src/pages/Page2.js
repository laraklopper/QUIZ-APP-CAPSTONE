// Import necessary modules and packages
import React, { useEffect, useState } from 'react';
import '../CSS/Page2.css';
// Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
// Components
import Header from '../components/Header';
// import LogoutBtn from '../components/LogoutBtn';
import Quiz from '../components/Quiz';
import Score from '../components/Score';
import Footer from '../components/Footer';

// Page 2 function component
export default function Page2({
  // PROPS PASSED FROM PARENT COMPONENT
  quizList = [],
  questions = [],
  setQuestions,
  setQuizName,
  logout,
  fetchQuizzes,
}) {
  // =========STATE VARIABLES====================
  // Quiz variables
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  // const [lastQuestion, setLastQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // const [quizStarted, setQuizStarted] = useState(false);
  // Score Variables
  const [score, setScore] = useState(0);
  // Timer variables
  // const [timerEnabled, setTimerEnabled] = useState(true);
  // const [timer, setTimer] = useState(10);
  const [timer, setTimer] =useState(null);
  const [quizTimer, setTimer] = useState(false);

  // useEffect to fetch quizzes when component mounts
  useEffect(() => {
    // Function to fetch a single quiz
    const fetchQuiz = async (quizId) => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        // Send a GET request to the server
        const response = await fetch(`http://localhost:3001/quiz/${quizId}`, {
          method: 'GET', // HTTP request method
          mode: 'cors', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include authorization token
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching Quiz');
        }

        const quiz = await response.json(); // Parse the response as JSON
        setQuestions(quiz[0].questions); // Set quiz questions state
        console.log(questions); // Log the fetched questions in the console for debugging purposes
      } catch (error) {
        console.error('Failed to fetch selected quiz', error); // Log errors in console for debugging purposes
      }
    };

    if (selectedQuiz) {
      fetchQuiz(selectedQuiz);
    }
  }, [selectedQuiz, questions, setQuestions]);

  useEffect(() => {
    if (quizStarted && timerEnabled) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            return 10;
          }
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [quizStarted, timerEnabled]);

  // useEffect to set questions and quiz name when the selected quiz changes
  useEffect(() => {
    if (selectedQuiz) {
      setQuestions(selectedQuiz.questions);
      setQuizName(selectedQuiz.quizName);
    }
  }, [selectedQuiz, setQuestions, setQuizName]);

  // useEffect to fetch quizzes when component mounts
  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // =========EVENTS=================
  // Function to go to the next question
  const handleNextQuestion = () => {
    if (currentQuestion + 1 === questions.length) {
      setLastQuestion(true);
    }
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    setTimer(10);
  };

  // Function to handle option click for quiz questions
  const handleOptionClick = (selectedAnswer) => {
    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
    }
    handleNextQuestion();
  };

  // Function to start the quiz
  const startQuiz = () => {
    setQuizStarted(true);
    setScore(0);
    setCurrentQuestion(0);
    setLastQuestion(false);
    setTimer(timerEnabled ? 10 : 0);
  };

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
  
  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1)
  }

  const handleQuizStart = () => {
    if(quizTimer){
      setTimer();
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if(prevTimer === 1){
            clearInterval(interval);
            handleNextQuestion();
            return null;
          }
          return prevTimer - 1;
        })
      }, 1000)
    }
  };
  
  const handleAnswerClick = (isCorrect) => {
    if(isCorrect){
      setScore(score-1);
    }
    handleNextQuestion()
  }

  const randomiseOptions = (options) => {
    return options.sort(() => Math.random() - 0.5)
  }
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
