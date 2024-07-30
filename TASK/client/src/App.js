// Import necessary modules and packages
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS stylesheet
// React Router components
import { BrowserRouter, Route, Routes } from 'react-router-dom';
//Bootstrap
import Container from 'react-bootstrap/Container';
//Pages
import Login from './pages/Login';
import Registration from './pages/Registration';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';

//App function component
export default function App() {
  //=======STATE VARIABLES===============
  //User variables
  const [users, setUsers] = useState([]);//State to store a list of all the users
  const [currentUser, setCurrentUser] = useState(null);// Details of the currently logged-in user
  const [userData, setUserData] = useState({
    username: '',       // Username of the current user
    email: '',          // Email of the current user
    dateOfBirth: '',    // Date of birth of the current user
    admin: '',          // Admin status of the current user
    password: '',       // Password of the current user
  });
  const [newUserData, setNewUserData] = useState({
    newUsername: '',    // Username for new user registration
    newEmail: '',       // Email for new user registration
    newDateOfBirth: '', // Date of birth for new user registration
    newAdmin: false,    // Admin status for new user registration
    newPassword: '',    // Password for new user registration
  });
  //Quiz variables
  const [quizList, setQuizList] = useState([]); // List of all available quizzes
  const [questions, setQuestions] = useState([]) // List of questions for the current quiz
  const [quiz, setQuiz] = useState(null); // Details of the currently selected quiz
  const [quizName, setQuizName] = useState('');// Name of the new quiz being create
   const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',   // Text of the current question being created
    correctAnswer: '',  // Correct answer for the current question
    options: ['', '', ''], // Options for the current question
  });
  //Event variables
  const [error, setError] = useState(null);//State to handle any error messages
  //State variables to manage user Login
  const [loggedIn, setLoggedIn] = useState(false); // State to track if the user is logged in

  //============USE EFFECT HOOK TO FETCH USERS======================
  //Fetch users when the component mounts or when loggedIn changes
  useEffect(() => {
    //Function to fetch users
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');//Retrieve the token from local storage
        if (!token || !loggedIn) return;//Exit the function if there is no token

        // Send a GET request to the server to fetch details of the current user
        const response = await fetch('http://localhost:3001/users/findUsers', {
          method: 'GET',//HTTP request method
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,// Include the token in the request header for authentication
          }
        });

        //Response handling
        if (!response.ok) {
          throw new Error('Failed to fetch users');//Throw an error message if the GET request is unsucessful
        }

        const fetchedUsers = await response.json();// Parse the JSON response
        setUsers(fetchedUsers); // Update the state with the fetched users
      } 
      catch (error) {
        console.error('Error fetching users', error.message);//Log an error message in the console for debugging purposes
        setError('Error fetching users');//Set the error State with an error message
      }
    };

    //Function to fetch the current user details
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        //Send a GET request to the server to fetch the current user id
        const response = await fetch('http://localhost:3001/users/userId', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        //Response handling 
        if (!response.ok) {
          throw new Error('Failed to fetch current user');//Throw an error message if the GET request is unsuccessful
        }

        const fetchedCurrentUser = await response.json();// Parse the JSON response
        setCurrentUser(fetchedCurrentUser);// Update the state with the fetched current user details
      } 
      catch (error) {
        console.error('Error fetching current user', error.message);
        setError('Error fetching current user');
      }
    };

    // If the user is logged in, fetch the users and current user details
    if (loggedIn) {
      fetchUsers();
      fetchCurrentUser();
    }
  }, [loggedIn]);//The effect depends on the loggedIn state, so it will re-run when this state changes

  //==============REQUESTS========================
  //-----------GET-------------------------
// Function to fetch quizzes
  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      //Send a GET request to the server to find all quizzes
      const response = await fetch('http://localhost:3001/quiz/findQuizzes', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      //Response handling
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }
      const quizData = await response.json();

      if (quizData && quizData.quizList) {
        setQuizList(quizData.quizList);
        console.log(quizData);
      }

      
    } 
    catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Error fetching quizzes');
    }
  };
    
//===========EVENT LISTENERS============================

  //Function to trigger logoutbtn
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('loggedIn');
    setLoggedIn(false);
    setError('');
    setUserData({ username: '', password: '' });
  };

  //===========JSX RENDERING=============================

  return (
    <>
      <BrowserRouter>
      {/* App Container */}
        <Container>
          <Routes>
            {loggedIn ? (
              <>
                <Route path='/' element={//Page1: HOME
                  <Page1
                    logout={logout}
                    error={error}
                    currentUser={currentUser}
                  />}
                />
                <Route path='/page2' element={//Page2: GAME
                  <Page2
                    logout={logout}
                    fetchQuizzes={fetchQuizzes}
                    setError={setError}
                    quizList={quizList}
                    quiz={quiz}      
                    setQuiz={setQuiz}
                    currentQuestion={currentQuestion}
                    setCurrentQuestion={setCurrentQuestion}   
                    questions={questions}
                    setQuestions={setQuestions}               
                  />}
                />
                <Route path='/page3' element={//Page3: Add Questions
                  <Page3 
                    quizName={quizName}
                    setQuizName={setQuizName}
                    quizList={quizList}
                    loggedIn={loggedIn}
                    logout={logout}
                    setError={setError}
                    setQuizList={setQuizList}
                    fetchQuizzes={fetchQuizzes}       
                    error={error}  
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                    currentQuestion={currentQuestion}
                    setCurrentQuestion={setCurrentQuestion}  
                    userData={userData}
                    questions={questions}
                    setQuestions={setQuestions}
                    setUserData={setUserData}    
                  />}
                />
                <Route path='/page4' element={
                  <Page4
                    setError={setError}
                    logout={logout}
                    currentUser={currentUser}
                    setUsers={setUsers}
                    setLoggedIn={setLoggedIn}
                    users={users}
                  />}
                />
              </>
            ) : (
              <>
                <Route exact path='/' element={
                  <Login
                    userData={userData}
                    setUserData={setUserData}
                    setLoggedIn={setLoggedIn}
                    setError={setError}

                  />}
                />
                <Route path='/reg' element={
                  <Registration
                    newUserData={newUserData}
                    setNewUserData={setNewUserData}
                    setError={setError}
                  />}
                />
              </>
            )}
          </Routes>
        </Container>
      </BrowserRouter>
    </>
  );
}
