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
  logout, 
  loggedIn
}) {

  // ========STATE VARIABLES===============
  //New Quiz variables
  const [quizName, setQuizName] = useState('');//App.js?
  const [questions, setQuestions] = useState([]);//State used to store the list of Questions being added to the quiz
  // const [currentQuestion, setCurrentQuestion] = useState(
    // { questionText: '', correctAnswer: '', options: ['', '', ''] })
  //Edit Quiz variables
  const [newQuizName, setNewQuizName] = useState('');
  const [update, setUpdate] = useState(false);
  const [quizToUpdate, setQuizToUpdate] = useState(null);
  const [editQuizIndex, setEditQuizIndex] = useState(
    [{ questionText: '', correctAnswer: '', options: ['', '', ''] }]);
    //Form error message variables
  const [formError, setFormError] = useState('');
  

//========================================================
  /* useEffect to fetch quizzes when the component mounts
 or when fetchQuizzes function changes*/
  useEffect(() => {
    if (loggedIn === true) {
      fetchQuizzes()// Call the fetchQuizzes function to retrieve the quiz list
    }
  }, [fetchQuizzes, loggedIn])// Dependency array: runs this effect whenever fetchQuizzes changes

  // ==============REQUESTS=======================
  // ----------POST-------------------
  //Function to add a new quiz
  const addNewQuiz = async () => {//Define an async function to fetch a new quiz
    // console.log('add new Quiz');
    
    if (questions.length !== 5) {
      alert('You must add exactly 5 questions.');
      return;// Exi the function early if the condition is not met

    }

  const quiz = {name: quizName, questions}
    try {
      const token = localStorage.getItem('token');
      //Send a POST request to the server to add a new quiz
      const response = await fetch('http://localhost:3001/quiz/addQuiz', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,//Include the token in the request header
        },
        body: JSON.stringify(quiz)
      });

      //Response handling
      if (response.ok) {
        alert('New Quiz successfully added')
        const newQuiz = await response.json(); 
        setQuizList([...quizList, newQuiz]);
        setQuizName('');     
        setQuestions([]);
        // console.log('Quiz created:', newQuiz);
      } 
      else {
        throw new Error('There was an error creating the quiz');
      }

    } 
    catch (error) {
      console.error('There was an error creating the quiz:', error);
      setError('There was an error creating the quiz:', error);
    }
  };

  // ---------------PUT-----------------------
  //Function to edit a quiz
  const editQuiz = async (quizId) => {
    if (questions.length !== 5) {
      setFormError('You must have exactly 5 questions.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      //Send a PUT request to the server to edit a quiz
      const response = await fetch(`http://localhost:3001/quiz/editQuiz/${quizId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type being sent in the request payload. 
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(
          {
            quizName: newQuizName, 
            questions: editQuizIndex 
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
        setQuizList(quizList.filter(q => q._id !== quizId));//use array.filter method to filter the quiz by quizId
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
            <Row  className='quizListRow'>
              <Col className='quizCol'>
                <p className='itemText'>Quiz Name: {quiz.name}</p>
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
                      setError={setError}
                      quizList={quizList}
                      setQuizList={setQuizList}
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
          formError={formError}
          setFormError={setFormError}
          quizName={quizName}
          setQuizName={setQuizName}
        />
      </section>
      {/* Footer Component */}
      <Footer logout={logout}/>
    </>
  );
}
