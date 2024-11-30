// Import necessary modules and packages
import React, { useCallback, useEffect, useState } from 'react';// Import the React module to use React functionalities
import '../CSS/Page3.css';//Import CSS stylesheet
import '../CSS/quizList.css'
// Bootstrap
import Row from 'react-bootstrap/Row'; // Bootstrap Row component for layout
import Col from 'react-bootstrap/Col'; // Bootstrap Col component for layout
import Button from 'react-bootstrap/Button';// Import Button component from react-bootstrap
// Components
import Header from '../components/Header';//Import the Header function component
import AddQuiz from '../components/AddQuiz';//Import the AddQuiz function component
import Footer from '../components/Footer';//Import the Footer function component
import EditQuiz from '../components/EditQuiz';//Import the EditQuiz function component
import EditInstructions from '../components/EditInstructions';//Import the EditInstructions function component

// Page3 function component
export default function Page3(//Export default Page3 function component 
  {//PROPS PASSED FROM PARENT COMPONENT
    quizList, 
    setQuizList, 
    setError, 
    fetchQuizzes, 
    logout, 
    quiz,
    quizName,
    currentUser,
    setQuizName,
    questions,
    setQuestions,
}
) {
  
  // ========STATE VARIABLES===============
  // NewQuizVariables
  const [currentQuestion, setCurrentQuestion] = useState({  // State to store data when a new question being added
    questionText: '',
    correctAnswer: '',
    options: ['', '', ''],
  });
  //Edit quiz variables
  const [newQuizName, setNewQuizName] = useState('');// State to store new quiz name
  const [update, setUpdate] = useState(false);    // Toggle between edit mode and normal mode 
  const [newQuestions, setNewQuestions] = useState([])  // State to store new questions when editing a quiz
  const [quizToUpdate, setQuizToUpdate] = useState(null); // State to store the quiz ID of the quiz being updated 
  const [editQuizIndex, setEditQuizIndex] = useState({ // State for edit details
      editQuestionText: '', 
      editCorrectAnswer: '', 
      editOptions: ['', '', ''] 
    });
  const [formError, setFormError] = useState(null);// Form error for validation
  
 
  //====================USE EFFECT HOOK===================
  /* useEffect to fetch quizzes when the component mounts
 or when fetchQuizzes function changes*/
  useEffect(() => {
    fetchQuizzes()// Call the function to fetch quizzes
    // console.log(newQuestions);//Log an message in the console for debugging purposes
  }, [fetchQuizzes/*,newQuestions*/])
  
  // ==============REQUESTS=======================
  // ----------POST-------------------
  //Function to add a new quiz
  const addNewQuiz = useCallback(async () => {
    //Conditional rendering to check that the quiz has exacly 5 questions
    if (questions.length !== 5 ) {
      console.log('You must add exactly 5 questions.');//Log an message in the console for debugging purposes
      return;// Exit the function to prevent further execution
    }
    // Create a quiz object to send to the server
    const quiz = {
      name: quizName,// Quiz name entered by the user
      username: currentUser.username,//username of the user who create the quiz
      questions,// The array of questions
    }
    try {
      // Retrieve the authentication token from localStorage
      const token = localStorage.getItem('token');
      console.log(quiz)
      //Send a POST request to the server to add a new quiz
      const response = await fetch('http://localhost:3001/quiz/addQuiz', {
        method: 'POST',//HTTP request method
        mode: 'cors', // Enable cross-origin resource sharing
        headers: {
          'Content-Type': 'application/json',//Specify the content-type 
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header  
        },
        body: JSON.stringify(quiz) // Convert the quiz object to a JSON string before sending
      });

      // Handle the response from the server
      if (response.ok) {
        const newQuiz = await response.json(); // Parse the new quiz object 
        // Update the quizList
        setQuizList((prevQuizList) => [...prevQuizList, newQuiz]);
        // Reset the quiz name and questions after successful quiz creation
        setQuestions(['']);
        setQuizName('');
        console.log('New Quiz added');//Log a success message in the console for debugging purposes
        alert('New Quiz successfully added');//Notify user
      }
   
    }
    catch (error) {
      //Error handling
      console.error('There was an error creating the quiz:', error);//Log an error message in the console for debugging purposes
      setError('There was an error creating the quiz');// Set the Error State with an error message
    }
  },[currentUser,questions,quizName, setError, setQuestions, setQuizList, setQuizName]);
  // ---------------PUT-----------------------
  //Function to edit a quiz
  const editQuiz = useCallback(async (quizId) => {//Define an async function to edit a quiz
    try {
      const token = localStorage.getItem('token');// Retrieve the JWT token from local storage

      //Conditional rendering to check if token exists
      if (!token) {
        setError('User is not authenticated')//
        return// Exit the function to prevent further execution
      }
// console.log(newQuestions);//Log the new Questions in the console for debugging purposes
      
      //Send a PUT request to the server to edit a quiz
      const response = await fetch(`http://localhost:3001/quiz/editQuiz/${quizId}`, {
        method: 'PUT',//HTTP request method
        mode: 'cors',// Enable Cross-origin resource sharing
        headers: {
          'Content-Type': 'application/json',//Specify the Content-Type in the payload as JSON
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header  
        },
        body: JSON.stringify({
          name: newQuizName, // The new quiz name provided by the user
          username: currentUser.username,  // Username of the user attempting the edit
          questions: newQuestions,// Send the updated questions
          // user: currentUser
            })
      });
      console.log(response);//Log the response in the console for debugging purposes

      //Response handling
      if (response.ok) {
        // Parse the updated quiz data from the response
        const data = await response.json();
        const updatedQuiz = data.editedQuiz

        // Update the quiz list with the modified quiz data
        setQuizList(quizList.map(q => (q._id === updatedQuiz._id ? updatedQuiz : q)));
        // Reset the edit form by clearing the state variables
        setEditQuizIndex(
          [{ 
            editQuestionText: '',  
            editCorrectAnswer: '', 
            editOptions: ['', '', '']
          }]);
        setQuizToUpdate(null);  // Reset the quiz being updated
        setNewQuizName('');     // Clear the new quiz name input
        setNewQuestions([]);    // Clear the new questions array
        setFormError('');
        setError('')
        alert('quiz successfully edited')//Notify the user
      } 
      else {
        const errorData = await response.json();
        setError(errorData.message || 'Error editing quiz'); 
      }
    } 
    catch (error) {
      console.error(`Error editing the quiz: ${error}`);//Log an error message in the console for debugging purposes
      setError(`Error editing the quiz: ${error}`);//Set the Error State with an error message      
    }
  },[newQuestions, currentUser, newQuizName, quizList, setQuizList, setError])

//------------DELETE------------------------
//Function to delete a quiz
  const deleteQuiz = useCallback (async (quizId) => {
    try {
      const token = localStorage.getItem('token');// Retrieve token from localStorage

      //Conditional rendering to check if token exists
      if (!token) {
        setError('user not authenticated');//Set the Error State with an error message     
        return// Exit the function to prevent further execution
      }
      
      //Send a DELETE request to server to delete a quiz
      const response = await fetch(`http://localhost:3001/quiz/deleteQuiz/${quizId}`, {
        method: 'DELETE',//HTTP request method
        mode: 'cors',//Enable Cross-Origin resource sharing mode
        headers: {
          'Content-Type': 'application/json',//Specify the Content-Type in the payload as JSON
          'Authorization': `Bearer ${token}`,// Attach the token in the Authorization header  
        }
      });
      
      //Response handling
      if (response.ok) {
        // If the request is successful, remove the quiz from the quizList
        setQuizList(prevQuizList => prevQuizList.filter(q => q._id !== quizId));
      } 
      else {
        throw new Error('Error deleting quiz');//Throw an Error message if the DELETE request is unsuccessful
      }      
    } 
    catch (error) {
      setError(`Error deleting quiz: ${error}`);// Set the error state to display the error in the UI
      console.error(`Error deleting quiz: ${error}`);//Log an error message in the console for debugging purposes
    }
  },[ setError, setQuizList])
 
  // ===========EVENT LISTENERS==============  
  // Function to toggle the quiz edit form visibility
  const toggleQuizUpdate = useCallback((quizId) => {  
    setUpdate((prevUpdate) => !prevUpdate);
    /* Set the 'quizToUpdate' state to the  selected quiz's ID for editing*/
    setQuizToUpdate(quizId);
  }, []);

  // Function to authorise deleteQuiz if the is an admin user or created the quiz
  const authoriseDelete = useCallback((quiz)=> {
    // Conditional rendering to check if the user is an admin or the user who created the quiz
    if (currentUser.admin || currentUser.username === quiz.username) {
      deleteQuiz(quiz._id)//call the delete quiz function
      alert('Quiz successfully deleted')//Notify the user 
      console.log('Quiz successfully deleted');//Log an error message in the console for debugging purposes
    }
    else{
      setError('You do not have permission to delete this quiz')//Set the Error state to display a message in the UI
      console.error('Unauthorised');//Log an error message in the console for debugging purposes
      alert('You are not authorised to delete this quiz'); //Notify the user
    }
  },[currentUser, deleteQuiz, setError])


  //==============JSX RENDERING=================
  return (
    <>
    
      {/* Header */}
      <Header heading='ADD QUIZ' />
      {/* Section1: List of quizzes */}
      <section className='page3Section1'>
        <Row className='quizRow'>
          <Col id='outputHeading'>
            <h2 className='h2'>QUIZZES</h2>
          </Col>
        </Row>
        {/* List of quizzes */}
        <div id='quizOutput'>
          {quizList.map((quiz) => (//Iterate over the quizList
            <div className='quizItem' key = {quiz._id}>
              <Row className='quizListRow'>
                
                <Col className='quizCol' md={3} id='quizNameCol'>
                {/* Quiz Name */}
                <label className='quizNameLabel'>
                    <p className='quizLabelText'>QUIZ NAME:</p>
                    <p id='quizName'>{quiz.name}</p>
                   </label>
                </Col>
                <Col className='quizCol' md={5} id='userNameCol'>
                {/* username of the user who created the quiz */}
                 <label 
                 className='quizUserNameLabel' 
                //  hidden
                 >
                    <p className='quizUserLabelText'>USERNAME:</p>
                    <p className='quizUsername'>{quiz.username}</p> 
                 </label> 
              </Col>
                <Col  md={2} className='buttonCol'> 
                  <div id='authoriseDelete'>
                    {/* Button to delete the Quiz */}
                    <Button 
                      variant='danger'
                      id='deleteQuizBtn'
                      onClick={() => authoriseDelete(quiz)} 
                      >
                      DELETE QUIZ
                    </Button>
                  </div>
                </Col>
                  <Col md={2} className='buttonCol'>
                <div id='authoriseEdit'>
                  {/* Toggle button to edit a quiz */}
                <Button 
                  variant='warning' 
                  type='button' 
                  id='editQuizBtn'
                  onClick={() => toggleQuizUpdate(quiz._id)}>
                    {update  && quizToUpdate === quiz._id ? 'EXIT': 'EDIT QUIZ' }
                </Button>
                  </div>
                   </Col> 
              </Row>
                  <div>
                    {/* Toggle the editQuiz function component */}
                     {update && quizToUpdate === quiz._id && (
                      <EditQuiz // Render the EditQuiz component
                      quiz={quiz}
                      quizList={quizList}
                      setQuizList={setQuizList}
                      editQuizIndex={editQuizIndex}
                      setQuizToUpdate={setQuizToUpdate}
                      setEditQuizIndex={setEditQuizIndex}
                      newQuizName={newQuizName}
                      setNewQuizName={setNewQuizName}
                      editQuiz={editQuiz}
                      setUpdate={setUpdate}
                      newQuestions={newQuestions}
                      setNewQuestions={setNewQuestions}                   
                      quizName={quizName}
                      currentUser={currentUser}
                      currentQuestion={currentQuestion}
                      setCurrentQuestion={setCurrentQuestion}       
                    />              
            )} 
            </div>             
            </div>
          ))}
        </div>
      <EditInstructions/>
      </section> 
      {/* Section 2: Form to Add Quiz  */}
      <section id='page3Section2'>
        {/* Form to Add Quiz */}
        <AddQuiz
          currentUser={currentUser}             
          questions={questions}
          setQuestions={setQuestions}
          formError={formError}
          setError={setError}
          setFormError={setFormError}
          setQuizList={setQuizList}
          quizName={quizName}
          setQuizName={setQuizName}
          currentQuestion={currentQuestion}
          addNewQuiz={addNewQuiz}
          setCurrentQuestion={setCurrentQuestion}
        />
      </section>
      {/* Footer Component */}
      <Footer logout={logout}/>
    </>
  );
}
