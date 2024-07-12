import React, { useState } from 'react'// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row';// Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col';// Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//Add quiz function component
export default function AddQuiz({
  setError, 
  quizList, 
  setQuizList,
  quizName,
  setQuizName, 
  questions, 
  setQuestions,
  addNewQuiz
}) {
  //==================STATE VARIABLES=============
  const [currentQuestion, setCurrentQuestion] = useState(
    {questionText: '', correctAnswer: '', options: ['','','']})

    //============EVENT LISTENERS=========================
  //Function to add a new question
  const handleAddQuestion = () => {
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({ questionText: '', correctAnswer: '', options: ['', '', ''] });
  };
  
  //===============JSX RENDERING=============
  
  return (
    <div>
      <Row>
        <Col>
        <h2 className='h2'>ADD QUIZ</h2>
        </Col>
      </Row>
      <div>
        <Row>
          <Col xs={6} md={4}>
          {/* QuizForm Input */}
            <label className='addQuizLabel'>
              <p className='labelText'>QUIZ NAME:</p>
              QUIZ NAME:
            <input
            type='text'
            name='quizName'
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            autoComplete='off'
            placeholder='QUiZ NAME'
            required
            className='addQuizInput'
            /></label>
          </Col>
          <Col xs={12} md={8}>
          </Col>
        </Row>
        <div id='questionsInput'>
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
                required
                className='addQuizInput'
              />
              </label>
            </Col>
            <Col xs={6} className='quizFormInput'>
            {/* Correct Answer input */}
              <label className='addQuizLabel'>CORRECT ANSWER:</label>
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
            </Col>
          </Row>
          <Row className='quizFormRow'>
            <Col xs={6} className='quizFormCol'>
            {/* Alternative Answer Input */}
            <label className='addQuizLabel'>1. ALTERNATIVE ANSWER:</label>
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
                /></label>
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
        <div>
          <Row>
            <Col>
            <h3 className='h3'>QUESTIONS</h3>
          </Col>
           <div>
              <Row>
                <Col sm={4}>{quizName}</Col>
                <Col sm={8}></Col>
              </Row>
            {questions.map((q, index) => (
              <div key={index}>
                <p>{q.questionText}</p>
                <p>{q.correctAnswer}</p>
                <p>{q.options.join(', ')}</p>
                {/* Button to remove/delete a question from the list */}
                {/* <Button variant='danger' type='button'>DELETE QUESTION</Button> */}
              </div>
            ))}
           </div>
          </Row>
          <Row>
            <Col sm={8}></Col>
            <Col sm={4}><Button variant='primary' type='button' onClick={addNewQuiz}>ADD QUIZ</Button></Col>
          </Row>
        </div>
      </div>
    </div>
  )
}
