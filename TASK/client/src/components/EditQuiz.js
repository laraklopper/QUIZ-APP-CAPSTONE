// Import necessary modules and packages
import React, { useCallback, useEffect, useState } from 'react';// Import the React module to use React functionalities
import '../CSS/EditQuiz.css';//Import CSS stylesheet
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap
// Components
import FormHeaders from './FormHeaders';//Import FormHeaders function component
import NavigationBtns from './NavigationBtns';//Import NavigationBtns function component

//EditQuiz function component
export default function EditQuiz(//Export default editQuiz Function component
  {//PROPS PASSED FROM PARENT COMPONENT
    quiz,   //The quiz object being edited.
    quizList,// List of all quizzes
    currentUser,// Current logged-in user
    setQuizList, // Setter for updating quiz list
    editQuizIndex,// State for editing question fields
    setEditQuizIndex, // Setter for updating editQuizIndex
    setQuizToUpdate,// Setter to clear quiz being updated
    setNewQuizName,// Setter for new quiz name
    newQuizName,  // New quiz name
    editQuiz,     // Function to edit quiz on the server
    newQuestions,       // List of updated questions
    setNewQuestions,  // Setter for updated questions
    currentQuestion,// Current question being displayed
  }
) {
  //=============STATE VARIABLES======================
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);// State to track the index of the current question being edited
  const [error, setError] = useState(null);  // State for tracking any error messages  
  const [successMessage, setSuccessMessage] =useState(null); //State used to track successMessages
  const [isLoading, setIsLoading] = useState(false);//Loading state for submission

 
  //=========USE EFFECT HOOK==================
  /* Effect to initialize and update the editQuizIndex 
  state when quiz or currentQuestionIndex changes*/
  useEffect(() => {
    //Conditional rendering to check that the questions are valid
    if (quiz && Array.isArray(quiz.questions) && 
        quiz.questions.length > 0 && 
        currentQuestionIndex < quiz.questions.length) 
        {
          // console.log('questions found'); //Log a message in the console for debugging purposes         
        const currentQuestion = quiz.questions[currentQuestionIndex];// Retrieve the current question based on currentQuestionIndex

      //Conditional rendering to check if the the currentQuestion exists
      if (currentQuestion) {
        console.log('current question')
        // Set the state for editing based on current question
        setEditQuizIndex({
          editQuestionText: currentQuestion.questionText || '',// Set question text or empty string
          editCorrectAnswer: currentQuestion.correctAnswer || '',   // Set correct answer or empty string 
          editOptions: Array.isArray(currentQuestion.options) && currentQuestion.options.length === 3 
          ? currentQuestion.options  // Set options if exactly 3 are present    
         : ['', '', ''] // Otherwise, default to three empty strings
      })
        setError(null)// Reset any previous error
    }   
    }}, [ currentQuestion, currentQuestionIndex, setEditQuizIndex, quiz])

  //Effect to synchronize newQuestions state with quiz.questions
  useEffect(() => {
    if (quiz && Array.isArray(quiz.questions)) { 
      // Sync the newQuestions state with the current quiz's questions     
      setNewQuestions(quiz.questions);// Update newQuestions with current quiz's questions
    }
  }, [quiz, setNewQuestions]);

//=================UTILITY FUNCTION===========================
  //Function to check if the current user is authorised to edit the quiz
  const editAuthorisation = useCallback(()=>{
    return currentUser?.admin || currentUser?.username === quiz?.username;
  },[currentUser?.admin, currentUser?.username, quiz?.username])

  
  //Function to validate formData
  const validateForm = useCallback( () => {
    if (!newQuizName.trim) {
      setError('Quiz name cannot be empty')
      return false
    }
    if (!Array.isArray(newQuestions) || newQuestions.length === 0){
      setError('Questions cannot be empty.');
      return false;
    }
  },[newQuestions, newQuizName.trim])
  //============EVENT LISTENERS=================
 // Function to edit a question
const handleEditQuestion =useCallback((e) => {
  e.preventDefault()// Prevent default form submission
  /*if (!Array.isArray(quizList) || quizList.length === 0) {
    console.error('No quizzes to update');//Log an error message in the console for debugging purposes
    setError('No quizzes available to update')// Update the error state to display an error message in the UI
    return;
  }*/
  // Conditional rendering to check if the quiz has any questions available to update
  if (!quiz.questions || quiz.questions.length === 0) {
      console.error('No questions available to update');//Log an error message in the console if no questions exist for debugging purposes
    setError('No questions available to update.');// Update the error state to display an error message in the UI
    return;// Stop execution if there are no questions
  }
  else if (currentQuestionIndex >= quiz.questions.length) {
      console.error('Invalid question Index');//Log an error message in the console for debugging purposes
    setError('Invalid question index.');// Update the error state to display an error message in the UI
    return;// Stop execution 
  }

  const updatedQuestions = [...newQuestions]; //Copy the newQuestions array to avoid mutaing state
  // console.log(updatedQuestions);//Log the updated questions in the console for debugging purposes 
  /* Update the specific question being edited 
  with the current editQuizIndex state*/
  updatedQuestions[currentQuestionIndex] = {
    questionText: editQuizIndex.editQuestionText,
    correctAnswer: editQuizIndex.editCorrectAnswer,
    options: editQuizIndex.editOptions
  };
   
  setNewQuestions(updatedQuestions);// Update the state with the new list of questions
  
  setQuizList(// Update the quiz list with the modified quiz
    //Map over the existing quizzes
    quizList.map(q =>     
      q._id === quiz._id// Check if the quiz's ID matches the ID of the quiz being edited
        ? { ...q, questions: updatedQuestions }// Update the quiz's questions and name        
        : q  // If it doesn't match, return the quiz unchanged
      ));
      setError(null);//Clear any existing errors
      setSuccessMessage('Question successfully updated')
  },[
  currentQuestionIndex, // Dependency: Index of the question being edited
  quizList,            // Dependency: Current list of quizzes
  setNewQuestions,     // Dependency: Function to update the new questions state
  setQuizList,         // Dependency: Function to update the quiz list
    quiz.questions, 
    newQuestions, 
  quiz._id,   // Dependency: Quiz ID to identify the quiz being edited
    editQuizIndex        // Dependency: Object containing the updated question details
  
  ])
    /*
  //Function to handle form submission
  const handleEditQuiz= useCallback(async (e) => {  
    e.preventDefault()// Prevent default form submission behaviour
    try {
         await editQuiz(quiz._id);// Call the editQuiz function with the current quiz's ID
      setQuizToUpdate(null)// Reset the quiz to update state
    } catch (error) {
      console.error(`Failed to edit quiz: ${error.message}`);//Log an error message in the console for debugging purposes
      setError(`Failed to edit quiz: ${error.message}`)// Update the error state with the error message
    }
  },[editQuiz, quiz._id, setQuizToUpdate, setError])*/

   // Function to handle quiz edit submission with authorization
  const authoriseEdit = useCallback(async (e) => {
    e.preventDefault()// Prevent default form submission behaviour
    if (!validateForm()) {
      setIsLoading(true)
    }
    //Conditional rendering
    if (editAuthorisation()) {
      try {
        await editQuiz(quiz._id);// Call the editQuiz function with the current quiz's ID      
        setQuizToUpdate(null);// Reset the quiz to update state
        setSuccessMessage('Quiz Successfully Edited')
        setError(null);//Clear any existing errors
      } catch (error) {
        console.error('Edit failed:', error);//Log an error message in the console for debugging purposes
        setError('Failed to edit quiz. Please try again.');// Set the error state to display the error in the UI
      }
    } else {
      console.error(`Failed to edit quiz`);//Log an error message in the console for debugging purposes
      setError(`Failed to edit quiz`)// Update the error state with the error message
      alert('You are not authorised to edit this quiz');//Notify the user
    }
    setIsLoading(false);
  },[ editQuiz, setQuizToUpdate, quiz._id, editAuthorisation, validateForm])


  //==============JSX RENDERING====================
  
  return (
    // Edit quiz
    <div id='editQuiz'>      
    {/* Form heading */}
      {/* Render the FormHeaders component formHeading='EDIT QUIZ' as the heading */}
      <FormHeaders formHeading='EDIT QUIZ'/>
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
        {/* Success message */}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {/* FORM TO EDIT QUIZ */}
      <form 
        className='editQuizForm' 
       onSubmit={authoriseEdit}// Call the authoriseEdit function
        // onSubmit={handleEditQuiz}
        >         
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          {/* Edit quiz name */}
            <div className='editField'>
              {/*Label for new QuizName input field*/}
              <label className='editQuizLabel'>
                <p className='labelText'>QUIZ NAME:</p>
              </label>
              {/* Edit quiz name input  */}
              <input
              type='text'
              name='newQuizName'
              value={newQuizName || ''}
               onChange={(e) => setNewQuizName(e.target.value) }
              autoComplete='off'
              placeholder={quiz.name}
              id='newQuizName'
              className='editQuizInput'/>
            </div>
          </Col>        
          <Col xs={6} className='editQuizCol'></Col>     
        </Row>
        {/* EDIT QUESTIONS */}
        <Row className='editQuizRow' id='editQuestionHeadRow'>
          <Col className='editQuizCol'>
          <div className='editQuestionsHead'>
            <h3 className='h3'>EDIT QUESTIONS</h3>
          </div>
          </Col>
        </Row>
        <Row className='editQuizRow'>
            <Col xs={6} className='editQuizCol'>
              {/* Edit Question */}
              <div className='editField'>
                {/* Label for question input */}
                <label className='editQuizLabel' htmlFor='editQuestionText'>
                  <p className='labelText'>QUESTION:</p>
                </label>
                {/* New question input */}
                <input
                type='text'
                name='editQuestionText'
                value={editQuizIndex.editQuestionText || ''}
                onChange={(e) => setEditQuizIndex({
                  ...editQuizIndex, 
                  editQuestionText: e.target.value
                })}
                autoComplete='off'
                  placeholder={quiz.questions[currentQuestionIndex]?.questionText || ''}
                  id='editQuestionText'
                />
              </div>
            </Col>
            <Col xs={6}  className='editQuizCol'>
                <div className='editField'>
                  {/* Edit correct Answer label */}
                  <label className='editQuizLabel' htmlFor='correctAnswer'>
                    <p className='labelText'>CORRECT ANSWER:</p>
                  </label>
                {/* Edit correct answer input */}
                <input
                  type='text'//Specify the Content type
                  name='editCorrectAnswer'
                  value={editQuizIndex.editCorrectAnswer || ''}
                  onChange={(e) => setEditQuizIndex({
                  ...editQuizIndex,
                  editCorrectAnswer: e.target.value
                })}
                  autoComplete='off'
                  placeholder={quiz.questions[currentQuestionIndex]?.correctAnswer || ''}
                  id='editCorrectAnswer'
                  className='editQuizInput'
                />
                </div>      
            </Col>
        </Row>
        {/* Input for each option */}
        {[0, 1, 2].map((optionIndex)=> { 
          const optionValue = editQuizIndex?.editOptions?.[optionIndex] || '';
          return(
          <Row className='editQuizRow' key={optionIndex}>
            <Col xs={6} className='editQuizCol' >
              <div className='editField'>
                {/* Label for each option input, displaying the option number (1, 2, 3) */}
                <label 
                  className='editQuizLabel' 
                  htmlFor={`editOption${optionIndex + 1}`}
                >
                  <p className='labelText'>{optionIndex + 1}. ALTERNATIVE ANSWER:</p>
                </label>
                {/* Input field for each alternative answer option */}
                <input
                  type='text'//Specify the datatype as text
                  className='editQuizInput'
                  name={`editOptions${optionIndex + 1}`}
                  value={optionValue}              
                  onChange={(e) => {//Copy of the edit questions array
                    const updatedOptions = [...(editQuizIndex.editOptions || //Copy of the edit questions array
                      [' ', ' ', ' '])]//Ensure three elements
                    updatedOptions[optionIndex] = e.target.value
                    setEditQuizIndex({
                      ...editQuizIndex, 
                      editOptions: updatedOptions
                    })
                  }}
                  placeholder={quiz.questions[currentQuestionIndex]?.options[optionIndex] || ''}
                  id={`editOption${optionIndex + 1}`}
                  autoComplete='off'
                />
              </div>
            </Col>              
          </Row>
          )}
          )}
        {/* BUTTONS */}
        <Row className='editQuestionRow'>          
            <Col xs={6} md={4} className='editQuestionCol'>
            {/* Button to edit a question */}
              <Button 
              variant='primary' 
              className='editQuestionBtn' 
              onClick={handleEditQuestion} 
              type='button'
              >
                EDIT QUESTION
              </Button>
            </Col>
            <Col xs={12} md={8}></Col>
        </Row>
        {/* Navigation buttons */}
        <NavigationBtns  
        quiz={quiz} 
        currentQuestionIndex={currentQuestionIndex} 
        setCurrentQuestionIndex={setCurrentQuestionIndex}/>
       <Row className='editQuizBtnRow'>
          <Col xs={6} md={4} id='editQuizBtnCol'>
          {/* Button to edit quiz */}
            <Button 
              variant='warning' 
              type='submit' 
              className='editQuizButton' 
              aria-label='EDIT QUIZ AND SAVE'
                disabled={isLoading}
                >
                {isLoading ? 'Saving...': 'EDIT QUIZ AND SAVE'}
              // EDIT QUIZ AND SAVE
            </Button>
          </Col>
       </Row>
      </form>
    </div>
  );
}
