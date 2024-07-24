import React, { useState } from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col'; // Import the Col component from react-bootstrap
import Button from 'react-bootstrap/Button'; // Import the Button component from react-bootstrap

//EditQuiz Function component
export default function EditQuiz(
  {//PROPS PASSED FROM PARENT COMPONENT
  quiz, 
  setQuizList,  
  quizList,
  editQuizIndex,
  setEditQuizIndex,
  editQuiz,
  setNewQuizName,
  newQuizName,
  newQuestions, 
  setNewQuestions
}
) {
  //=============STATE VARIABLES======================
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);//State to manage the index of the question currently being edited


  //============EVENT LISTENERS=================


  //=========JSX RENDERING===================

 
  return (
    // Form to edit quiz
    <div id='editQuizForm'>
      <Row className='formRow'>
        <Col>
        <h2 className='h2'>EDIT QUIZ</h2>
        </Col>
      </Row>
      <Row className='editQuizRow'>
        <Col xs={6} md={4} className='editQuizCol'>
        <label className='editQuizLabel'>
          {/* EDITED QUIZ NAME */}
          <p className='labelText'>QUIZ NAME:</p>
          <input
          type='text'
          name='newQuizName'
          value={newQuizName}
          onChange={(e) => setNewQuizName(e.target.value)}
          autoComplete='off'
          placeholder='NEW QUIZ NAME'
          className='editQuizInput'
          />
        </label>
        </Col>
      </Row>
      <div>
        <Row className='editQuizRow'>
          <Col xs={6}>
          {/* EDITED QUIZ QUESTION */}
          <label className='editQuizLabel'>
            <p className='labelText'>QUESTION:</p>
            <input
            type='text' 
            name='questionText'
            value={editQuizIndex.questionText}
            onChange={(e) => setEditQuizIndex(
              { ...editQuizIndex, questionText: e.target.value })}
            autoComplete='off'
            placeholder='NEW QUESTION'
            className='editQuizInput'
            id='editQuestionInput'
            />
          </label>
          </Col>
          <Col xs={6}>
          {/* Edited correct answer */}
          <label className='editQuizLabel'>
              <p className='labelText'>CORRECT ANSWER:</p>
              <input
              type='text'
              name='correctAnswer'
              value={setEditQuizIndex.correctAnswer}
                onChange={(e) => setEditQuizIndex(
                  { ...editQuizIndex, correctAnswer: e.target.value })}
                autoComplete='off'
                placeholder='CORRECT ANSWER'
                className='editQuizInput'
              />
          </label>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          {/* Edited alternative answer */}
          <label className='editQuizLabel'>
            <p className='labelText'>1.ALTENATIVE ANSWER:</p>
            <input
            type='text'
                name='options[0]'
                value={editQuizIndex.options[0]}
                onChange={(e) => {
                  const options =[...editQuizIndex.options]
                  options[0]= e.target.value
                  setEditQuizIndex({...editQuizIndex, options})
                }}
                autoComplete='off'
                placeholder='ALTERNATIVE ANSWER 1'
                className='editQuizInput'
            />
          </label>
          </Col>
          <Col xs={6} className='editQuizCol'>
            <label className='editQuizLabel'>
              <p className='labelText'>2.ALTENATIVE ANSWER:</p>
              <input
              type='text' 
                name='options[1]'
                value={editQuizIndex.options[1]}
                onChange={(e) => {
                  const options = [...editQuizIndex.options]
                  options[1] = e.target.value
                  setEditQuizIndex({ ...editQuizIndex, options })
                }}
                autoComplete='off'
                placeholder='ALTERNATIVE ANSWER 2'
                className='editQuizInput'
              />
            </label>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6}>         
          </Col>
          <Col xs={6} className='editQuizCol'>
            {/* Edited alternative answer */}
            <label className='editQuizLabel'>
              <p className='labelText'>3.ALTENATIVE ANSWER:</p>
              <input 
              type='text'
              name='options[2]'
              value={editQuizIndex.options[2]}
                onChange={(e) => {
                  const options = [...editQuizIndex.options]
                  options[2] = e.target.value
                  setEditQuizIndex({ ...editQuizIndex, options })
                }}
                autoComplete='off'
                placeholder='ALTERNATIVE ANSWER 3'
                className='editQuizInput'
              />
            </label>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
          {/* Butt */}
            <Button type='button' variant="primary" onClick={handleEditQuestion}>EDIT QUESTION</Button>
          </Col>
          <Col xs={6}>
            <Button type='button' variant="primary" onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>NEXT</Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button variant='primary' type='button' onClick={editQuiz}>EDIT QUIZ</Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}
