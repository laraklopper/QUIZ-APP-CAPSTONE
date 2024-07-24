// Import necessary modules and packages
import React, { useEffect, useState/*, useCallback*/ } from 'react';// Import the React module to use React functionalities
import '../CSS/Page3.css';//Import CSS stylesheet
// Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap
// Components
import Header from '../components/Header';// Import the Header component from './components/Header'
import AddQuiz from '../components/AddQuiz';//Import the AddQuiz component from '../components/AddQuiz'
import Footer from '../components/Footer';//Import the Footer component from '../components/Footer'
import EditQuiz from '../components/EditQuiz';//Import the EditQuiz component from '../components/EditQuiz'

// Page3 function component
export default function Page3(//Export default Page3 function component
  {//PROPS PASSED FROM PARENT COMPONENT
  quizList, 
  setQuizList, 
  setError, 
  fetchQuizzes, 
  logout, 
  loggedIn,
  userData,
  setUserData
}) {
  
  // ========STATE VARIABLES===============
 // New Quiz variables
  const [quizName, setQuizName] = useState(''); // State used to store the name of the new quiz
  const [questions, setQuestions] = useState([]); // Array to store questions for the new quiz
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '', // Text of the current question
    correctAnswer: '', // Correct answer for the current question
    options: ['', '', ''] // Array to store alternative answers
  });
  //Edit Quiz variables
  const [newQuizName, setNewQuizName] = useState(''); // Holds the new name for the quiz being edited
  const [update, setUpdate] = useState(false); // Boolean to toggle edit form visibility
  const [newQuestions, setNewQuestions] = useState([]); // Array to store updated questions for the quiz being edited
  const [quizToUpdate, setQuizToUpdate] = useState(null); // ID of the quiz currently being edited
  const [editQuizIndex, setEditQuizIndex] = useState({
    questionText: '', // Text of the question being edited
    correctAnswer: '', // Correct answer for the question being edited
    options: ['', '', ''] // Array to store alternative answers for the question being edited
  });
  // Form error message variables
  const [formError, setFormError] = useState(''); // Stores and displays error messages related to form validation

  //====================REACT HOOKS====================================
  //   // Memoized callback to fetch quizzes if the user is logged in
  //   const fetchQuizzesMemo = useCallback(() => {
  //     if (loggedIn) { // Check if the user is logged in
  //       fetchQuizzes(); // Fetch the quizzes from the server
  //     }
  //   }, [fetchQuizzes, loggedIn]); // Dependencies: fetchQuizzes function and loggedIn boolean


  // // Fetch quizzes when the component mounts or when fetchQuizzesMemo changes
  // useEffect(() => {
  //   fetchQuizzesMemo(); // Call the memoized function to fetch quizzes
  // }, [fetchQuizzesMemo]); // Dependency array: Re-run if fetchQuizzesMemo changes


  /* useEffect to fetch quizzes when the component mounts
 or when fetchQuizzes function changes*/
  useEffect(() => {
    if (loggedIn === true) {
      fetchQuizzes()
    }
  }, [fetchQuizzes, loggedIn])

  // ==============REQUESTS=======================
  // ----------POST-------------------
  //Function to add a new quiz
  const addNewQuiz = async () => {//Define an async function to add a new Quiz
    console.log('add new Quiz');//Log a message in the console for debugging purposes
    
    if (questions.length !== 5) {
      alert('You must add exactly 5 questions.');
      return;

    }

    // Create the quiz object with the quiz name and list of questions
    // const quiz = {name: quizName, questions, username : userData.username}
    // Create a quiz object to send to the server
    const quiz = {name: quizName, questions}
    try {
      const token = localStorage.getItem('token');// Retrieve token from localStorage
      //Send a POST request to the server to add a new quiz
      const response = await fetch('http://localhost:3001/quiz/addQuiz', {
        method: 'POST',//HTTP request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload. 
          'Authorization': `Bearer ${token}`,// Include the token in the authorization header
        },
        body: JSON.stringify(quiz)// Convert quiz object to JSON format for the request body
      });

      //Response handling
            // Conditional rendering if the response indicates success (status code 200-299)
      if (response.ok) {
        alert('New Quiz successfully added')// Alert user upon successful addition of the quiz
        const newQuiz = await response.json(); // Parse the response JSON to get the new quiz data
        setQuizList([...quizList, newQuiz]);// Update the quiz list with the new quiz
        setQuizName('');     // Reset the quiz name input field
        setQuestions([]);// Clear the questions array
        // console.log('Quiz created:', newQuiz);
      } 
      else {
        throw new Error('There was an error creating the quiz');// Throw an error if the POST request is unsuccessful
      }

    } 
    catch (error) {
      console.error('There was an error creating the quiz:', error);//Log an error message in the console for debugging purposes
      setError('There was an error creating the quiz:', error);// Set error state with error message
    }
  };

  // ---------------PUT-----------------------
  //Function to edit a quiz
  const editQuiz = async (quizId) => {
    //Conditional rendering to check if 
    if (questions.length !== 5) {
      setFormError('You must have exactly 5 questions.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      //Send a PUT request to the server to edit a quiz
      const response = await fetch(`http://localhost:3001/quiz/editQuiz/${quizId}`, {
        method: 'PUT',//HTTP request method
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(
          {
            quizName: newQuizName, 
            questions: newQuestions 
            }
          )
      });
      //Response handling
      if (response.ok) {
        const updatedQuiz = await response.json();
        setQuizList(quizList.map(q => (q._id === updatedQuiz._id ? updatedQuiz : q)));
        setEditQuizIndex([
          { editQuestionText: '', editCorrectAnswer: '', options: ['', '', ''] }
        ]);
        setQuizToUpdate(null);
        setNewQuizName('');
        setNewQuestions([]);
      } 
      
      else {
        throw new Error('Error editing quiz');
      }
    } catch (error) {
      console.error(`Error editing the quiz: ${error}`);
      setError(`Error editing the quiz: ${error}`);
    }
  }

//------------DELETE------------------------
//Function to delete a quiz
  const deleteQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem('token');
      //Send a DELETE request to server to delete a quiz
      const response = await fetch(`http://localhost:3001/quiz/deleteQuiz/${quizId}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      //Response handling
      if (response.ok) {
        setQuizList(quizList.filter(q => q._id !== quizId));
      } 
      else {
        throw new Error('Error deleting quiz');
      }
    } 
    catch (error) {
      setError('Error deleting quiz:', error);
      console.error('Error deleting quiz:', error);
    }
  }
 
  // ===========EVENT LISTENERS==============  
    //Function to toggle editForm
  const toggleQuizUpdate = (quizId) => {
    setUpdate(!update)
    setQuizToUpdate(quizId);
  };


  //==============JSX RENDERING=================
  return (
    <>
      {/* Header */}
      <Header heading='ADD QUIZ' />
      {/* Section1 */}
      <section className='page3Section1'>
        <Row className='quizRow'>
          <Col id='outputHeading'>
            <h2 className='h2'>QUIZZES</h2>
          </Col>
        </Row>
        {/* QUIZ Output */}
        <div id='quizOutput'>
          {/* Display the list of quizes*/}
          {quizList.map((quiz) => (//Iterate over the quizList
            <div className='quizItem' key = {quiz._id}>
              <Row className='quizListRow'>
                <Col className='quizCol'  md={3} >
                   <p className='itemText'>Quiz Name: {quiz.name}</p>
                </Col>
                <Col md={3}>
                <p className='itemText'>{quiz.user}</p>
              </Col>
                <Col  md={3} className='buttonCol'> 
                  <div>
                    {/* Button to Delete a quiz */}
                    <Button variant='primary' onClick={() => deleteQuiz(quiz._id)}>
                      DELETE QUIZ
                    </Button>
                  </div>
                </Col>
                  <Col md={3}>
                <div>
                  {/* Toggle button to update QUIZ */}
                <Button 
                  variant='primary' 
                  type='button' 
                  onClick={() => toggleQuizUpdate(quiz._id)}>
                    {update  && quizToUpdate === quiz._id ? 'EXIT': 'EDIT QUIZ' }
                </Button>
                  </div>
                   </Col> 
              </Row>
                  <div>
                    {/* Form to edit a quiz */}
                     {update && quizToUpdate === quiz._id && (
                      //Show the EditQuiz component if in update mode
                      <EditQuiz
                      setError={setError}
                      quizList={quizList}
                      setQuizList={setQuizList}
                      newQuizName={newQuizName}
                      setNewQuizName={setNewQuizName}
                      editQuiz={editQuiz}
                      setNewQuestions={setNewQuestions}
                      quiz={quiz}
                      editQuizIndex={editQuizIndex}
                      setEditQuizIndex={setEditQuizIndex}
                      newQuestions={newQuestions}
                      quizName={quizName}
                      currentQuestion={currentQuestion}
                      setCurrentQuestion={setCurrentQuestion}
                    />              
            )} 
            </div>             
            </div>
          ))}
        </div>
      </section>
      {/* Section 2 */}
      <section id='page3Section2'>
        {/* Form to Add Quiz */}
        <AddQuiz
          addNewQuiz={addNewQuiz}               
          questions={questions}
          setQuestions={setQuestions}
          formError={formError}
          setFormError={setFormError}
          quizName={quizName}
          setQuizName={setQuizName}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          userData={userData}
          setUserData={setUserData}
        />
      </section>
      {/* Footer Component */}
      <Footer logout={logout}/>
    </>
  );
}
