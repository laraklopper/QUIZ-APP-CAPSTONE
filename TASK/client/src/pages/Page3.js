// Import necessary modules and packages
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
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
export default function Page3(
  {//PROPS PASSED FROM PARENT COMPONENT
  quizList,
  setQuizList,
  setError,
  fetchQuizzes,
  questions,
  logout
}) {

  // ========STATE VARIABLES===============
  //New Quiz variables
  const [quizName, setQuizName] = useState('');//App.js?
  const [questions, setQuestions] = useState([]);//State used to store the list of Questions being added to the quiz
  const [currentQuestion, setCurrentQuestion] = useState({questionText: '', correctAnswer: '', options: ['','','']});
  //Edit Quiz variables
  //const [newQuizName, setNewQuizName] = useState('');
  const [update, setUpdate] = useState(false);//State to toggle between update and non-update mode.
  const [quizToUpdate, setQuizToUpdate] = useState(null);//State to store the ID of the quiz being updated.
  const [editQuizIndex, setEditQuizIndex] = useState(// State to store the questions for the quiz being edited.
    [{ questionText: '', correctAnswer: '', options: ['', '', ''] }]);
    //Form error message variables
  // const [formError, setFormError] = useState('');
  
//========================================================
  /* useEffect to fetch quizzes when the component mounts
 or when fetchQuizzes function changes*/
  useEffect(() => {
    fetchQuizzes()
  },[fetchQuizzes])

  // ==============REQUESTS=======================
  // ----------POST-------------------
  //Function to add a new quiz
  const addNewQuiz = async (event) => {//Define an async function to fetch a new quiz
    //console.log('Add new Quiz');    
    if (newQuestions.length !== 5) {
      alert('The quiz must have exactly 5 questions.');
      return;// Exit the function early if the condition is not met
    }
    const quiz = { name: quizName, questions };
    try {
     
      const token = localStorage.getItem('token');
      //Send a POST request to the server to add a new quiz
      const response = await fetch('http://localhost:3001/quiz/addQuiz', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quiz)
      });

      //Response handling
      if (response.ok) {
        alert('New Quiz successfully added')
        // console.log('New Quiz successfully added')
        const newQuiz = await response.json(); 
        // Add the new quiz to the quiz list
        setQuizList([...quizList, newQuiz]);
        setQuizName(''); 
        setQuestions([]);
        // setFormError('');
        // console.log('Quiz created:', newQuiz);
        
      } 
      else {
        throw new Error('There was an error creating the quiz');//Throw an error message if the request is unsuccessful
      }

    } 
    catch (error) {
      console.error('There was an error creating the quiz:', error);//Log an error message in the console for debugging purposes
      setError('There was an error creating the quiz:', error);//Set the error state with an error message
    }
  };

  // ---------------PUT-----------------------
  //Function to edit a quiz
  const editQuiz = async (quizId) => {//Define an async function to edit a quiz
    //Conditional rendering to check if the number of questions is exactly 5
    if (questions.length !== 5) {
      setFormError('You must have exactly 5 questions.');
      return;
    }

    try {
      const token = localStorage.getItem('token');//Retrieve the authentication token from local storage
      //Send a PUT request to the server to edit a quiz
      const response = await fetch(`http://localhost:3001/quiz/editQuiz/${quizId}`, {
        method: 'PUT',//HTTP request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin requests 
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload.
          'Authorization': `Bearer ${token}`,//Include the token in the request header
        },
        body: JSON.stringify(// Convert data to JSON string and include it in the request body
          {// Request body containing the updated quiz name and questions
            quizName: newQuizName, // The new name for the quiz
            questions: editQuizIndex 
            }
          )
      });
      //Response handling
      // Conditional rendering if the response indicates success (status code 200-299)
      if (response.ok) {
        const updatedQuiz = await response.json();//Parse the JSON response
        // Update quizList with the edited quiz
        setQuizList(quizList.map(q => (q._id === updatedQuiz._id ? updatedQuiz : q)));
        // Reset the form fields
        setEditQuizIndex([
          { 
            editQuestionText: '', 
            editCorrectAnswer: '', 
            options: ['', '', ''] 
          }
        ]);
        setQuizToUpdate(null);// Clear the quiz being updated
      } 
      else {
        throw new Error('Error editing quiz');//Throw an error message if the request is unsuccessful
      }
    } catch (error) {
      console.error(`Error editing the quiz: ${error}`);//Log an error message in the console for debugging purposes
      setError(`Error editing the quiz: ${error}`)//Set the error state with an error message
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
        // Remove the deleted quiz from the quiz list
        setQuizList(quizList.filter(q => q._id !== quizId));
      } 
      else {
        throw new Error('Error deleting quiz');
      }
    } catch (error) {
      setError('Error deleting quiz:', error);
      console.error('Error deleting quiz:', error);
    }
  }
 
  // ===========EVENT LISTENERS==============  
    //Function to toggle editForm
  const toggleQuizUpdate = (quizId) => {
    setUpdate(!update)// Toggle the update state
    setQuizToUpdate(quizId);// Set the quiz to be updated
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
            <div  className='quizItem' key = {quiz._id}>
            <Row  className='quizListRow'>
              <Col className='quizCol'>
              <p className='itemText'>Quiz Name: {quiz.quizName}</p>
              </Col>
                <Col xs={6} md={4} className='buttonCol'> 
                  <div>
                    {/* Button to Delete a quiz */}
                    <Button variant='primary' onClick={() => deleteQuiz(quiz._id)}>
                      DELETE
                    </Button>
                  </div>
                <div>
                  {/* Toggle button to update QUIZ */}
                <Button 
                variant='primary' 
                type='button' 
                onClick={() => toggleQuizUpdate(quiz._id)}>
                  {update  && quizToUpdate === quiz._id ? 'EXIT': 'EDIT' }
                </Button>
                  </div>
                   </Col> 
            </Row>
                  <div>
                    {/* Form to edit a quiz */}
                     {update && quizToUpdate === quiz._id && (//Show the EditQuiz component if in update mode
                      <EditQuiz
                          editQuizIndex={editQuizIndex}
                          setEditQuizIndex={setEditQuizIndex}
                          newQuizName={newQuizName}
                  setNewQuizName={setNewQuizName}
                  editQuiz={editQuiz}
                  quiz={quiz}
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
          // formError={formError}
          // setFormError={setFormError}
          quizName={newQuizName}
          setQuizName={setNewQuizName}
        />
     
      </section>
      {/* Footer Component */}
      <Footer logout={logout}/>
    </>
  );
}
