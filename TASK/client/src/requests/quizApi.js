const QUIZ_URL =  'http://localhost:3001/quiz';


export const fetchQuizzes = async (token) => {
  const response = await fetch(`${API_URL}/quiz/findQuizzes`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch quizzes');
  }

  return response.json();
};

export const fetchQuiz = async (quizId, token) => {
  const response = await fetch(`${QUIZ_URL}/quizId/${quizId}`, {
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

  return response.json();
};

export const fetchQuiz = async (quizId, token) => {
  const response = await fetch(`${QUIZ_URL}/${quizId}`, {
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

  return response.json();
};

