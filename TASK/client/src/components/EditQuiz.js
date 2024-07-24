import React, { useState } from 'react';// Import the React module to use React functionalities
//Bootstrap
import Row from 'react-bootstrap/Row'; // Import the Row component from react-bootstrap
import Col from 'react-bootstrap/Col';// Import the Col component from react-bootstrap
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

//Function to edit a question
  const handleEditQuestion = () => {
    //     if (newQuestions.length > 5) {
    //       alert('Quiz can only consist of 5 questions.')
    //       // console.log('Quiz can only consist of 5 questions.');
    //       return
    //     }
    const updatedQuestions = [...newQuestions];
    updatedQuestions[currentQuestionIndex] = { ...editQuizIndex };
    setNewQuestions(updatedQuestions);

    setQuizList(
      quizList.map(q =>
        q._id === quiz._id ? { ...q, questions: updatedQuestions, name: newQuizName } : q
      )
    );
  };

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
          {/* Edit quiz name */}
          <p className='labelText'>QUIZ NAME:</p>
          <input
          type='text'
          name='newQuizName'
          value={newQuizName}
          onChange={(e) => setNewQuizName(e.target.value)}
          autoComplete='off'
          placeholder={quiz.name}
          // placeholder='NEW QUIZ NAME'
          className='editQuizInput'
          />
        </label>
        </Col>
      </Row>
      {/* EDIT QUESTIONS INPUT */}
      <div>
        <Row>
          <Col><h3 className='h3'>EDIT QUESTIONS</h3></Col>
        </Row>
        <Row className='editQuizRow'>
          <Col xs={6} className='editQuizCol'>
          {/* EDITED QUIZ QUESTION */}
          <label className='editQuizLabel'>
            <p className='labelText'>QUESTION:</p>
            <input
            type='text' 
            name='questionText'
            value={editQuizIndex.questionText}
            onChange={(e) => setEditQuizIndex({ ...editQuizIndex, questionText: e.target.value })}
            autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.questionText || ''}
            // placeholder='NEW QUESTION'
            className='editQuizInput'
            id='editQuestionInput'
            />
          </label>
          </Col>
          <Col xs={6} className='editQuizCol'>
          {/* Edited correct answer */}
          <label className='editQuizLabel'>
              <p className='labelText'>CORRECT ANSWER:</p>
              <input
              type='text'
              name='correctAnswer'
              value={setEditQuizIndex.correctAnswer}
                onChange={(e) => setEditQuizIndex({ ...editQuizIndex, correctAnswer: e.target.value })}
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.correctAnswer || ''}
                //placeholder='CORRECT ANSWER'
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
                onChange={(e) => setEditQuizIndex({ ...editQuizIndex, options: [e.target.value, editQuizIndex.options[1], editQuizIndex.options[2]] })}
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.options[0] || ''}
                // placeholder='ALTERNATIVE ANSWER 1'
                className='editQuizInput'
            />
          </label>
          </Col>
          <Col xs={6} className='editQuizCol'>
            <label className='editQuizLabel'>
              {/* Edited Alternative answer input */}
              <p className='labelText'>2.ALTENATIVE ANSWER:</p>
              <input
              type='text' 
                name='options[1]'
                value={editQuizIndex.options[1]}
                onChange={(e) => setEditQuizIndex({ ...editQuizIndex, options: [editQuizIndex.options[0], e.target.value, editQuizIndex.options[2]] })}
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.options[1] || ''}
                // placeholder='ALTERNATIVE ANSWER 2'
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
                onChange={(e) => setEditQuizIndex(
                  { ...editQuizIndex, options: [editQuizIndex.options[0], editQuizIndex.options[1], e.target.value] })}
                autoComplete='off'
                placeholder={quiz.questions[currentQuestionIndex]?.options[2] || ''}
                // placeholder='ALTERNATIVE ANSWER 3'
                className='editQuizInput'
              />
            </label>
          </Col>
        </Row>
        <Row className='editQuizRow'>
          {/* BUTTONS */}
          <Col xs={6} md={4} className='editQuizCol'>
          {/* Button to edit question */}
            <Button 
            type='button' 
            variant="primary" 
            onClick={handleEditQuestion}>
              EDIT QUESTION
            </Button>
          </Col>
          <Col xs={6} md={4} className='editQuizCol'>
          {/* Button to move to previous question */}
          <Button 
          variant='secondary' 
          onClick={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex(currentQuestionIndex - 1)
            }
          }}
          >
            PREVIOUS QUESTION
          </Button>
          </Col>
          <Col xs={6} md={4} className='editQuizCol'>
          {/* Button to move to next question */}
            <Button
              variant='secondary'
              onClick={() => {
                if (currentQuestionIndex < quiz.questions.length - 1)
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
              }}>
              NEXT QUESTION
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button variant='primary' onClick={() => editQuiz(quiz._id)}>EDIT QUIZ</Button>
          </Col>
        </Row>
      </div>
    </div>
  )
}
