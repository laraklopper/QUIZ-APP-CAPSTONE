import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

//Quiz function component
export default function Quiz({
  timerEnabled,
  timer,
  questions,
  currentQuestion,
  handleOptionClick,
  lastQuestion,
  handleNextQuestion
}) {

//=======================================================  
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3001/quiz/${id}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }

        const quizData = await response.json();
        setQuiz(quizData.quiz);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, [id]);
  //================JSX RENDERING======================

  return (
    <div>
      {/* Add timer if user chooses to add the timer option */}  
      {timerEnabled && (
        <Row>
          <Col xs={6} md={4}>
            <p>TIME REMAINING: {timer}</p>
          </Col>
        </Row>
      )}
      <Row>
        <Col xs={12} md={12}>
          <h4 className='h4'>{questions[currentQuestion]._id}. {questions[currentQuestion].question}</h4>
        </Col>
      </Row>
      <Row>
        <Col xs={6} md={4}></Col>
        <Col xs={6} md={4}>
          <div id='options'>
            <Row id='questionsRow'>
              <Col>
                {questions[currentQuestion].options.map((option, index) => (
                  <Button key={index} onClick={() => handleOptionClick(option)}>
                    {optionIds[index]}{option}
                  </Button>
                ))}
              </Col>
            </Row>
          </div>
        </Col>
        <Col xs={6} md={4}></Col>
      </Row>
      <Row>
        <Col xs={6} md={4}></Col>
        <Col xs={6} md={4}>
          <Button onClick={handleNextQuestion}>
            {lastQuestion ? 'Submit' : 'Next Question'}
          </Button>
        </Col>
        <Col xs={6} md={4}></Col>
      </Row>
    </div>
  );
}
