import React, { useState, useEffect } from 'react';

//QuizLayout function component
export default function QuizLayout() {
    //=======STATE VARIABLES===============
    const [quizName, setQuizName] = useState(''); // Selected quiz name
  const [quizList, setQuizList] = useState([]); // List of quizzes fetched from the server
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index of the current question
  const [currentQuestion, setCurrentQuestion] = useState(null); // Current question object
  const [addTimer, setAddTimer] = useState(false); // Boolean to add timer or not
  // State used to track the remaining time left for the current question
  const [timeLeft, setTimeLeft] = useState(null); 
  const [error, setError] = useState(''); // State used to store error message
  const [results, setResults] = useState(null); // State for storing quiz results
  
  //========================================================
  // Fisher-Yates shuffle algorithm to randomize array elements
  const shuffleArray = (array) => {
    let shuffledArray = array.slice(); // Create a copy of the array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }
    return shuffledArray;
  };

  // Fetch the quizzes from the database
  useEffect(() => {
    //Function to fetch quizzes
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        // Make a GET request to the server to fetch the list of quizzes
        const response = await fetch('http://localhost:3001/quiz/findQuizzes', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }

        const quizData = await response.json();
        setQuizList(quizData);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError('Error fetching quizzes');
      }
    };
    fetchQuizzes();
  }, []);

  // Fetch the selected quiz's questions
  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      if (quizName) {
        // Make a GET request to fetch the selected quiz's questions
        const response = await fetch(`http://localhost:3001/quiz/${quizName}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Error fetching quiz');
        }

        const data = await response.json(); // Parse the response data
        const shuffledQuestions = shuffleArray(data.questions); // Shuffle the questions
        // Set the first shuffled question as the current question
        setCurrentQuestion(shuffledQuestions[0]); 
        setCurrentQuestionIndex(0); // Reset the question index
        setResults(null); // Reset the results
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('Error fetching quiz'); // Update error state
    }
  };

  // Handle timer
  useEffect(() => {
    if (addTimer && timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);

      if (timeLeft === 0) {
        clearInterval(timer);
        // Handle timer end (e.g., move to next question)
        nextQuestion();
      }

      / Cleanup the interval on component unmount or state change
      return () => clearInterval(timer);
    }
  }, [addTimer, timeLeft]);

  // Function to start the quiz
  const handleStartQuiz = () => {
    fetchQuiz();// Fetch the quiz questions
    if (addTimer) {
      setTimeLeft(30); // 30 seconds for each question
    }
  };
  // Function to handle timer checkbox change
  const handleCheckboxChange = (e) => {
    setAddTimer(e.target.checked);
  };

  //Function to move to next question
  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < currentQuestion.quiz.length) {
      setCurrentQuestion(currentQuestion.quiz[nextIndex]);
      setCurrentQuestionIndex(nextIndex);
      if (addTimer) {
        setTimeLeft(30); // Reset timer for each question
      }
    } else {
      // Quiz is complete
      // Calculate and set the results
      setResults(`Score: ${currentQuestion.quiz.filter(q => q.correct).length} out of ${currentQuestion.quiz.length}`);
    }
  };

  //===============JSX RENDERING==========================
  
  return (
    <div>
      <h1 className='h1'>Select Quiz</h1>
     {/* Form to select quiz */}
      <select value={quizName} onChange={e => setQuizName(e.target.value)}>
        <option value="">Select</option>
        {quizList.map(quiz => (
          <option key={quiz._id} value={quiz._id}>
            {quiz.name}
          </option>
        ))}
      </select>
    {/*Error message*/}
      {error && <p>{error}</p>}
      <div>
        <label>
          Add Timer:
          <input type="checkbox" checked={addTimer} onChange={handleCheckboxChange} />
        </label>
      </div>

      <button onClick={handleStartQuiz}>Play</button>

      {currentQuestion && (
        <div>
          <h2>Quiz Name: {quizName}</h2>
          <h3>Question {currentQuestionIndex + 1} of {currentQuestion.quiz.length}</h3>
          <p>{currentQuestion.questionText}</p>
          {currentQuestion.options.map((option, index) => (
            <div key={index}>
              <input type="radio" name="option" value={option} />
              <label>{option}</label>
            </div>
          ))}
          {addTimer && <p>Timer: {timeLeft} seconds</p>}
          <button onClick={nextQuestion}>Next Question</button>
        </div>
      )}

      {results && <h3>{results}</h3>}
    </div>
  );
}
