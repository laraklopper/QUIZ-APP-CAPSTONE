// Import necessary modules and packages
import React, { useState } from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row';// Import the Row component from react-bootstrap
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
    setCurrentQuestion
}) {
  //===========STATE VARIABLES====================
  const [username, setUsername] = useState(userData.username || '');
  const [errorMessage, setErrorMessage] = useState('');// State for error messages

  //============EVENT LISTENERS=========================
  //Function to add a new question
  const handleAddQuestion = () => {
    if (questions.length >= 5) {// Limit the number of questions to 5
      // Alert the user and log a message if the limit is reached
      alert('You must add up to 5 questions.');
      console.log('You must add up to 5 questions.');//Log a message in the console for debugging purposes
      return;
    }
    
    if (!currentQuestion.questionText || !currentQuestion.correctAnswer || currentQuestion.options.some(opt => !opt)) {
      setErrorMessage('Please fill in all fields before adding a question.');
      return;
    }
    setQuestions([...questions, currentQuestion]);
    // Reset the current question state
    setCurrentQuestion(
      { questionText: '', correctAnswer: '', options: ['', '', ''] });
  };

  // Function to delete a question
  const deleteNewQuestion =(index) => {
    const newQuestions = questions.filter((_, i) => i !== index); // Remove the question at the specified index
    setQuestions(newQuestions)// Update the questions state
  }

  
  const handleAddNewQuiz = () => {
    addNewQuiz(username);
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
            <label className='addQuizLabel'>
              <p className='labelText'>QUIZ NAME:</p>             
            <input
            type='text'
            name='quizName'
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            autoComplete='off'
            placeholder='QUiZ NAME'
            required
            className='addQuizInput'
            />
            </label>
          </Col>
           <Col xs={6} md={4}>
          </Col>
          <Col xs={6} md={4}>
            <label className='addQuizLabel'>
              <p className='labelText'>USERNAME:</p>
              <input
                type='text'
                name='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete='off'
                placeholder='USERNAME'
                required
                className='addQuizInput'
              />
            </label>
          </Col>
        </Row>
        <div id='quizInput'>
          <Row className='quizFormRow'>
            <Col xs={6} className='quizFormCol'>
            {/* Question Input */}
              <label className='addQuizLabel'>
                <p className='labelText'>QUESTION:</p>
              <input
                type='text'
                name='questionText'
                value={currentQuestion.questionText}
                onChange={(e) => setCurrentQuestion({...currentQuestion, questionText: e.target.value})}
                autoComplete='off'
                placeholder='QUESTION'
                id='questionInput'
                required
                className='addQuizInput'
              />
              </label>
            </Col>
            <Col xs={6} className='quizFormInput'>
            {/* Correct Answer input */}
              <label className='addQuizLabel'><p className='labelText'>CORRECT ANSWER:</p>
              <input
                type='text'
                name='correctAnswer'
                value={currentQuestion.correctAnswer}
                onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
                autoComplete='off'
                placeholder='CORRECT ANSWER'
                required
                className='addQuizInput'
              />
              </label>
            </Col>
          </Row>
          <Row className='quizFormRow'>
            <Col xs={6} className='quizFormCol'>
            {/* Alternative Answer Input */}
            <label className='addQuizLabel'><p className='labelText'>1.ALTERNATIVE ANSWER:</p>
            <input
            type='text'
            name='options[0]'
            value={currentQuestion.options[0]}
            onChange={(e) => {
              const options = [...currentQuestion.options]
              options[0] = e.target.value;
              setCurrentQuestion({...currentQuestion,options})
            }}
            autoComplete='off'
            placeholder='ALTENATIVE ANSWER 1'
            required
            className='addQuizInput'
            />
            </label>
            </Col>
            <Col xs={6}>
            {/* Alternative Answer Input */}
              <label className='addQuizLabel'>
                <p className='labelText'>2.ALTERNATIVE ANSWER</p>
            <input
            type='text'
            name='options[1]'
            value={currentQuestion.options[1]}
            onChange={(e) => {
              const options = [...currentQuestion.options]
              options[1] = e.target.value;
              setCurrentQuestion({...currentQuestion, options})
            }}
            autoComplete='off'
            placeholder='ALTERNATIVE ANSWER 2'
            required
            className='addQuizInput'
                />
            </label>
            </Col>
          </Row>
          <Row className='quizFormRow'>
            <Col xs={6}></Col>
            <Col xs={6} className='quizFormCol'>
            {/* Alternative Answer Input */}
            <label className='addQuizLabel'>
              <p className='labelText'>
            3. ALTERNATIVE ANSWER</p>
            <input
            type='text'
            name='options[2]'
            value={currentQuestion.options[2]}
            onChange={(e) => {
              const options = [...currentQuestion.options]
              options[2] = e.target.value;
              setCurrentQuestion({...currentQuestion,options})
            }}
            autoComplete='off'
            placeholder='ALTERNATIVE ANSWER 3'
            className='addQuizInput'
            required
            />
            </label>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={8}></Col>
            <Col xs={6} md={4}>
            {/* Button to add a question */}
              <Button type='button' variant="primary" onClick={handleAddQuestion}>ADD QUESTION</Button>
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
           <div className='newQuizOutput'> 
              <Row>
                <Col md={4} className='quizNameCol'>
                  <h4 className='quizName'>QUIZ NAME: {quizName}</h4>
                </Col>
              </Row>
              {/* Map THE questions */}
            {questions.map((q, index) => (
              <div className='questionsOutput' key={index}>
                <ul>
                  <li>         
                    <Row className='question'>
                      <Col md={3}>             
                        <p className='questionOutput'>{q.questionText}</p> </Col>
                      <Col md={2}>
                        <p className='answerOutput'>{q.correctAnswer}</p></Col>
                      <Col md={5}> 
                        <p className='options'>{q.options.join(', ')}</p></Col> 
                      <Col md={2}>
                      {/* Button to delete a question */}
                          <Button variant='danger' type='button' onClick={() => deleteNewQuestion(index)}>
                            DELETE QUESTION
                          </Button>
                      </Col>
                    </Row> 
                  </li>
                </ul>
              </div>
            ))}
           </div>
          </Row>
          <Row>
            <Col md={8}></Col>
            {/* Button to add a new quiz */}
            <Col md={4}>
              <Button variant='primary' type='button' onClick={handleAddNewQuiz}>
                  ADD QUIZ
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}
