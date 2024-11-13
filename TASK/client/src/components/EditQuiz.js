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
    quiz, 
    quizList,
    setQuizList, 
    editQuizIndex,
    setEditQuizIndex, 
    setQuizToUpdate,
    setNewQuizName,
    newQuizName,
    editQuiz,
    newQuestions,       
    setNewQuestions,  
    currentQuestion,
  }
) {
  //=============STATE VARIABLES======================
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);// State to track the index of the current question being edited
  const [error, setError] = useState(null);  // State for tracking any error messages  
 
  //=========USE EFFECT HOOK==================
  /* Effect to initialize and update the editQuizIndex 
  state when quiz or currentQuestionIndex changes*/
  useEffect(() => {
    //Conditional rendering to check that the questions are valid
    if (quiz && Array.isArray(quiz.questions) && 
        quiz.questions.length > 0 && 
        currentQuestionIndex < quiz.questions.length) 
        {
        const currentQuestion = quiz.questions[currentQuestionIndex];// Retrieve the current question based on currentQuestionIndex

      //Conditional rendering to check if the the currentQuestion exists
      if (currentQuestion) {
        // Set the state for editing based on current question
        setEditQuizIndex({
          editQuestionText: currentQuestion.questionText || '',// Set question text or empty string
          editCorrectAnswer: currentQuestion.correctAnswer || '',   // Set correct answer or empty string 
          editOptions: Array.isArray(currentQuestion.options) && currentQuestion.options.length === 3 
          ? currentQuestion.options:  // Set options if exactly 3 are present    
          ['', '', ''] // Otherwise, default to three empty strings
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

  //============EVENT LISTENERS=================
/*
  //Form input Change functions
  // Function to handleQuizNameChange
  const handleNewQuizName = (e) => {setNewQuizName(e.target.value)};
  
  // Function to handleQuestionChange
  const handleQuestionChange = (e) => {
    setEditQuizIndex({ 
      ...editQuizIndex, 
      editQuestionText: e.target.value });
  };

  // Function to handleCorrectAnswerChange
  const handleAnswerChange = (e) => { 
    setEditQuizIndex({ 
      ...editQuizIndex, 
      editCorrectAnswer: e.target.value })}

  // Function to handleOptionChange
 const handleOptionChange = (e, optionIndex, value) => {
   const updatedOptions = [...(editQuizIndex.editOptions //Copy of the edit questions array  
      || ['', '', ''])];//Ensure three options
    updatedOptions[optionIndex] = value; // Update the specific option in the editOptions array
    setEditQuizIndex({ 
      ...editQuizIndex, 
      editOptions: updatedOptions });
  };*/

  
  // Function to edit a question
const handleEditQuestion =(useCallback((e) => {
  e.preventDefault()// Prevent default form submission
  if (!Array.isArray(quizList) || quizList.length === 0) {
    console.error('No quizzes to update');//Log an error message in the console for debugging purposes
    setError('No quizzes available to update')// Update the error state to display an error message in the UI
    return;
  }
  else if (!quiz.questions || quiz.questions.length === 0) {
    console.error('No questions available to update');//Log an error message in the console if no questions exist for debugging purposes
    setError('No questions available to update')// Display error in UI
      return;
    }
  else if (currentQuestionIndex >= quiz.questions.length) {
    console.error('Invalid question Index');//Log an error message in the console for debugging purposes
    // Log error message in the console if the question index is out of bounds
    setError('Invalid question Index')// Update the error state to display an error message in the UI
    return;
  }

  const updatedQuestions = [...newQuestions]; //Copy the newQuestions array to avoid mutaing state
  console.log(updatedQuestions);//Log the updated questions in the console for debugging purposes 
  /* Update the specific question being edited with the current editQuizIndex state*/
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
  },[
    currentQuestionIndex, 
    quizList, 
    setNewQuestions, 
    setQuizList, 
    quiz.questions, 
    newQuestions, 
    quiz._id, 
    // editQuizIndex
    editQuizIndex.editCorrectAnswer, 
    editQuizIndex.editOptions, 
    editQuizIndex.editQuestionText
  ]))
    
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
  },[editQuiz, quiz._id, setQuizToUpdate, setError])

    //==================CONDITIONAL RENDERING=================
  // Display a loading message if quiz data isn't available yet
  if (!quiz || !Array.isArray(quiz.questions)) {
    return <div>Loading...</div>;// Handle loading or error states
  }
  //Conditional rendering to check if the quizIndex is valid
  if (currentQuestionIndex >= quiz.questions.length) {
    return <div>Invalid question index</div>
  }

  //==============JSX RENDERING====================
  
  return (
    <div id='editQuiz'>      
    {/* Form heading */}
      <FormHeaders formHeading='EDIT QUIZ'/>
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
      {/* FORM TO EDIT QUIZ */}
      <form 
        className='editQuizForm' 
        onSubmit={handleEditQuiz}// Call the handleEditQuiz function
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
              type='text'//Input type
              name='newQuizName'
              value={newQuizName}
              onChange={(e) => setNewQuizName(e.target.value)}
              autoComplete='off'
              placeholder={quiz.name}
              id='newQuizName'
              className='editQuizInput'/>
            </div>
          </Col>
          
          <Col xs={6} className='editQuizCol'></Col>     
        </Row>
        {/* EDIT QUESTIONS */}
        <Row className='editQuizRow'>
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
                type='text'//input type
                name='editQuestionText'
                value={editQuizIndex.editQuestionText}
                onChange={(e) => setEditQuizIndex(
                  {...editQuizIndex, editQuestionText: e.target.value})}
                autoComplete='off'//Disable browser autocomplete
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
                  value={editQuizIndex.editCorrectAnswer}
                  onChange={(e) => setEditQuizIndex({...editQuizIndex, editCorrectAnswer: e.target.value })}
                  autoComplete='off'//Disable browser autoComplete
                  placeholder={quiz.questions[currentQuestionIndex]?.correctAnswer || ''}
                  id='editCorrectAnswer'
                  className='editQuizInput'
                />
                </div>      
            </Col>
        </Row>
        {/* Input for each option */}
        {[0, 1, 2].map((optionIndex)=> (
          <Row className='editQuizRow' key={optionIndex}>{/* Bootstrap Row for layout */}
            <Col xs={6} className='editQuizCol' >
              <div className='editField'>
                {/* Label for each option input, displaying the option number (1, 2, 3) */}
                <label className='editQuizLabel' htmlFor={`editOption${optionIndex + 1}`}>
                  <p className='labelText'>{optionIndex + 1}. ALTERNATIVE ANSWER:</p>
                </label>
                {/* Input field for each alternative answer option */}
                <input
                  type='text'//Specify the datatype
                  className='editQuizInput'
                  name={`editOptions${optionIndex + 1}`}
                  value={editQuizIndex.editOptions[optionIndex] || ''}//Value bound to the corresponding option in state
                  onChange={(e) => {
                    // const updatedOptions = [...editQuizIndex.editOptions];
                    const updatedOptions = [...(editQuizIndex.editOptions || //Copy of the edit questions array  
                       ['', '', ''])]; // Ensure three elements
                    updatedOptions[optionIndex] = e.target.value;//Update the specific option in the editOptions array
                    setEditQuizIndex({ ...editQuizIndex, editOptions: updatedOptions });//Update the state with the modified options
                  }}
                  placeholder={quiz.questions[currentQuestionIndex]?.options[optionIndex] || ''}
                  id={`editOption${optionIndex + 1}`}
                  autoComplete='off'//Disable browser autocomplete
                />
              </div>
            </Col>              
          </Row>
        ))}
        {/* BUTTONS */}
        <Row className='editQuestionRow'>          
            <Col xs={6} md={4} className='editQuestionCol'>
            {/* Button to edit a question */}
              <Button 
              variant='primary' //Bootstrap variant
              className='editQuestionBtn' 
              onClick={handleEditQuestion} 
              type='button'//Button type
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
       <Row className='editQuizRow'>
          <Col xs={6} md={4} id='editQuizBtnCol'>
          {/* Button to edit quiz */}
            <Button 
              variant='primary' //Bootstrap variant
              type='submit' //Button type
            className='editQuizButton' 
            aria-label='Edit Quiz'>
              EDIT QUIZ
            </Button>
          </Col>
       </Row>
      </form>
    </div>
  );
}
