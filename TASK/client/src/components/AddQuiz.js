// Import necessary modules and packages
import React, { useState } from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col';// Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//Add quiz function component
export default function AddQuiz(
  {//PROPS PASSED FROM PARENT COMPONENT
  quizName,
  setQuizName, 
  questions, 
  setQuestions,
  addNewQuiz,
  currentQuestion,
  setCurrentQuestion,
  userData,
}) {
  //===========STATE VARIABLES====================
  const [errorMessage, setErrorMessage] = useState('');// State to manage the error message displayed to the user

  //============EVENT LISTENERS=========================
  //Function to add a new question
  const handleAddQuestion = () => {
    // Conditional rendering to check if the number of questions is 5 or more
    if (questions.length >= 5) {
      alert('You must add up to 5 questions.'); // Alert the user and log a message if the limit is exceeded
      console.log('You must add up to 5 questions.');//Log a message in the console for debugging purposes
      return;// Exit the function to prevent adding more questions
    }
      // Conditional rendering to check if any of the required fields are empty.
    if (!currentQuestion.questionText || !currentQuestion.correctAnswer || currentQuestion.options.some(opt => !opt)) {
      // Set an error message if any field is empty
      setErrorMessage('Please fill in all fields before adding a question.');
      return;// Exit the function to prevent adding incomplete questions
    }
    setQuestions([...questions, currentQuestion]);// Add the current question to the list of questions
    setCurrentQuestion(  // Reset the current question state to empty values for the next entry
      { questionText: '', correctAnswer: '', options: ['', '', ''] });
  };

  // Function to delete a question
  const deleteNewQuestion =(index) => {
    // Create a new array excluding the question at the specified index
    const newQuestions = questions.filter((_, i) => i !== index); 
    setQuestions(newQuestions)// Update the state with the new array of questions
  }

  // Function to handle form submission
  const handleAddNewQuiz = () => {
    // Conditional rendering if a quiz name is provided and there is at least one question
    if (!quizName || questions.length === 0) {
      // Set an error message if either condition is not met
      setErrorMessage('Please enter a quiz name and add at least one question.');
      return;// Exit the function to prevent further execution
    }
    // Call the addNewQuiz function passed as a prop
    // This function is responsible for saving or processing the new quiz
    addNewQuiz(userData.username);
  };

  //============JSX RENDERING================
  return (
    <div>
      <Row>
        <Col>
        <h2 className='h2'>ADD QUIZ</h2>
        </Col>
      </Row>
      <div id='newQuizForm'>
        <Row>
          <Col xs={6} md={4}>
          {/* QuizForm Input */}
            <label className='addQuizLabel' htmlFor='addQuizName'>
              <p className='labelText'>QUIZ NAME:</p>             
            <input
                type='text'//Specify the input type
                name='quizName'// Sets the name attribute for the input
                value={quizName}// Bind the value of the input to the quizName state variable
                onChange={(e) =>// Event handler for the onChange event, triggered when the input value changes
                  //(e) the event object is automatically passed to the event handler
                  setQuizName(
                    e.target.value // Update the quizName state with the new value from the input field
                  )
                }
                autoComplete='off'// Disables the browser's autocomplete feature
                placeholder='QUIZ NAME'// Placeholder text to show when the input is empty
                required// Mark the input as required
                className='addQuizInput'//CSS class for styling
                id='addQuizName'// Unique ID for styling or JavaScript access
            />
            </label>
          </Col>
          <Col xs={12} md={8}>
          </Col>
        </Row>
        <div id='quizInput'>
          <Row className='quizFormRow'>
            <Col xs={6} className='quizFormCol'>
            {/* Question Input */}
              <label className='addQuizLabel' htmlFor='questionText'>
                <p className='labelText'>QUESTION:</p>
              <input
                  type='text'//Specify the input type
                  name='questionText'// Input name for identification
                  value={currentQuestion.questionText}// Bind the value of the input to the questionText property of the currentQuestion state
                  onChange={(e) => 
                   setCurrentQuestion(
                    {
                      ...currentQuestion, // Preserve the existing properties of currentQuestion
                    questionText: e.target.value
                     })}// Handle the change event to update state when the input value changes
                  autoComplete='off'// Disable the browser's autocomplete feature
                  placeholder='QUESTION'// Provide placeholder text to show when the input is empty
                  id='questionInput'// Unique ID for styling or JavaScript access
                  required // Mark the input as required
                  className='addQuizInput'//CSS class for styling
                
              />
              </label>
            </Col>
            <Col xs={6} className='quizFormInput'>
            {/* Correct Answer input */}
              <label 
              className='addQuizLabel' 
              htmlFor='correctAnswer'
              >
                <p className='labelText'>CORRECT ANSWER:</p>
              <input
                  type='text'//Specify the input type
                  name='correctAnswer'// Input name for identification
                  value={currentQuestion.correctAnswer} // Displays the current value
                onChange={(e) => setCurrentQuestion(
                  {
                    ...currentQuestion, // Preserve the existing properties of currentQuestion
                    correctAnswer: e.target.value// Update the correctAnswer property with the new value from the input field
                  }
                  )}// Handle the change event to update the state when the input value changes
                  autoComplete='off'// Disable the browser's autocomplete feature
                  placeholder='CORRECT ANSWER' // Provide placeholder text to show when the input is empty
                  required// Mark the input as required, preventing form submission if the field is empty
                  className='addQuizInput'//CSS class for styling
                  id='correctAnswer'// Unique ID for styling or JavaScript access
              />
              </label>
            </Col>
          </Row>
          <Row className='quizFormRow'>
            <Col xs={6} className='quizFormCol'>
            {/* Alternative Answer Input */}
            <label 
                className='addQuizLabel' //CSS class for styling
                htmlFor='optionOne'//Link the label to the input field with the id attribute
            >
              <p className='labelText'>1.ALTERNATIVE ANSWER:</p>
                {/* Input field for the first alternative answer */}
            <input
                  type='text'// Specify the input type as text
                  name='options[0]'// Input name for identification
                  value={currentQuestion.options[0]}// Display the current value
                  onChange={(e) => {
                  // Handle input change to update the state
                    const options = [
                      ...currentQuestion.options// Create a new array with the existing options
                    ]
                    options[0] = e.target.value;// Update the first option with the new value from the input field
                      setCurrentQuestion(
                        {
                          ...currentQuestion,// Preserve other properties of currentQuestion
                          options// Update the options array with the new options
                        }
                      )}}
                  autoComplete='off'// Disable the browser's autocomplete feature
                  placeholder='ALTENATIVE ANSWER 1'// Provide placeholder text to show when the input is empty
                  required// Mark the input as required, 
                  className='addQuizInput'// CSS class for styling
                  id='optionOne'// Unique ID for styling or JavaScript access
            />
            </label>
            </Col>
            <Col xs={6}>
            {/* Alternative Answer Input */}
              <label 
                className='addQuizLabel' // Applies the addQuizLabel CSS class for styling the label
                htmlFor='option2'// Associates the label with the input field with id 'option2'
              >
                <p className='labelText'>2.ALTERNATIVE ANSWER</p>
                {/* Input field for the second alternative answer */}
            <input
                  type='text'// Specify the input type 
                  name='options[1]'// The name attribute for identifying the field
                  value={currentQuestion.options[1]}// Display the current value
            onChange={(e) => {
              const options = [
                ...currentQuestion.options// Create a new array with the existing options
              ]
              options[1] = e.target.value;// Update the second option with the new value from the input field
              setCurrentQuestion(
                {
                  ...currentQuestion, // Preserve other properties of currentQuestion
                  options// Update the options array with the modified options
                }
              )}}
                  autoComplete='off'// Disables the browser's autocomplete feature
                  placeholder='ALTERNATIVE ANSWER 2'// Provides placeholder text for the input field
                  required// Marks the input as required, meaning it must be filled before form submission
                  className='addQuizInput'// CSS class for styling
                  id='option2' // Unique ID for styling or JavaScript access
                />
            </label>
            </Col>
          </Row>
          <Row className='quizFormRow'>
            <Col xs={6}></Col>
            <Col xs={6} className='quizFormCol'>
            {/* Alternative Answer Input */}
            <label 
            className='addQuizLabel' 
            htmlFor='optionTwo'>
              <p className='labelText'> 3. ALTERNATIVE ANSWER</p>
                {/* Input field for the third alternative answer */}
            <input
                  type='text'//Specify the input type
                  name='options[2]'// The name attribute for identifying the field
                  value={currentQuestion.options[2]}// Display the current value
            onChange={(e) => {
                const options = [...currentQuestion.options]// Creates a new array with the existing options
                options[2] = e.target.value;// Updates the third option with the new value from the input field
                    setCurrentQuestion({
                      ...currentQuestion, // Preserves other properties of currentQuestion
                      options // Update the options array with the modified options
                    })
                  }}
                  autoComplete='off'// Disable the browser's autocomplete feature
                  placeholder='ALTERNATIVE ANSWER 3'// Placeholder text for the input field when it's empty
                  className='addQuizInput'// CSS class for styling
                  required// Mark the input as required to ensure the input field is filled before submitting the form
                  id='optionTwo'// Unique ID for styling or JavaScript access
            />
            </label>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={8}></Col>
            <Col xs={6} md={4}>
            {/* Button to add a question */}
              <Button 
                type='button' // Specifies that this button is a standard button (not a submit button)
                variant="primary" // Applies the 'primary' variant style from Bootstrap for the button
                onClick={handleAddQuestion}// Assigns the handleAddQuestion function to handle click events
              >
                ADD QUESTION{/*Text displayed on the button*/}
              </Button>
            </Col>
          </Row>
        </div>
        <div id='newQuiz'>
          <Row>
            <Col>
            <h3 className='h3'>QUESTIONS</h3>
            {/* Display an error message if an error occurs */}
              {errorMessage && <div className="error">{errorMessage}</div>}
          </Col>
          {/* New questions output */}
           <div className='newQuizOutput'> 
              <Row>
                <Col md={4} className='quizNameCol'>
                  {/* Heading displaying the quiz name */}
                  <h4 className='quizName'>QUIZ NAME: {quizName}</h4>
                </Col>
                <Col md={8}>
                </Col>
              </Row>
              
              {/* Map the questions */}
            {questions.map((q, index) => (
              <div className='questionsOutput' key={index}>
                    <Row className='question'>
                      <Col md={3}>             
                       {/* Display the question text */}
                        <p className='questionOutput'>{q.questionText}</p> </Col>
                      <Col md={2}>
                         {/* Display the correct answer */}
                        <p className='answerOutput'>{q.correctAnswer}</p></Col>
                      <Col md={5}> 
                        {/* Display alternative answers, joined by commas */}
                        <p className='options'>{q.options.join(', ')}</p></Col> 
                      <Col md={2}>
                      {/* Button to delete a question */}
                          <Button 
                            variant='danger' //Bootstrap variant
                           type='button' // Specify the button as a standard button
                            onClick={() => // Calls deleteNewQuestion function with the current question index
                            deleteNewQuestion(index)}
                          >
                            DELETE QUESTION{/*Text displayed on the button*/}
                          </Button>
                      </Col>
                    </Row> 
              </div>
            ))}
           </div>
          </Row>
          <Row>
            <Col md={8}></Col>
            {/* Button to add a new quiz */}
            <Col md={4}>
              <Button 
                variant='primary' // Bootstrap variant
                type='button'  //Specify the button as a standard button(not a submit button)
                onClick={handleAddNewQuiz}// Calls the handleAddNewQuiz function when the button is clicked
              >
                {/*Text displayed on the button*/}
                  ADD QUIZ
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}
