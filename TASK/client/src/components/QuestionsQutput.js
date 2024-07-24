import React from 'react'
//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function QuestionsOutput(questions, deleteNewQuestion) {
  return (
      <div className='newQuizOutput'>
         <Row>
              <Col md={4} className='quizNameCol'>
                  <h4 className='quizName'>QUIZ NAME:</h4>
              </Col>
              <Col md={8}>
                  {questions.map((q, index) => (
                      <div className='questionsOutput' key={index}>
                          <Row className='question'>
                              <Col md={3}>
                                  <p className='questionOutput'>{q.questionText}</p>
                              </Col>
                              <Col md={2}>
                                  <p className='answerOutput'>{q.correctAnswer}</p>
                              </Col>
                              <Col md={5}>
                                  <p className='options'>{q.options.join(', ')}</p>
                              </Col>
                              <Col md={2}>
                                  <Button
                                      variant='danger'
                                      type='button'
                                      onClick={() => deleteNewQuestion(index)}
                                  >
                                      DELETE QUESTION
                                  </Button>
                              </Col>
                          </Row>
                      </div>
                  ))}
              </Col>
          </Row></div>
  )
}
