import api from './api';

// Quizzes CRUD & Getters
export const getQuizzes = async () => {
  const response = await api.get('/quizzes');
  return response.data;
};

export const getQuizById = async (id) => {
  const response = await api.get(`/quizzes/${id}`);
  return response.data;
};

export const createQuiz = async (formData) => {
  const response = await api.post('/quizzes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const editQuiz = async (id, formData) => {
  const response = await api.put(`/quizzes/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deleteQuiz = async (id) => {
  const response = await api.delete(`/quizzes/${id}`);
  return response.data;
};

// Attempts
export const submitAttempt = async (quizId, answerOrAnswers, timeTaken) => {
  const payload = { timeTaken };
  if (Array.isArray(answerOrAnswers)) {
    payload.answers = answerOrAnswers;
  } else {
    payload.answer = answerOrAnswers;
  }
  const response = await api.post(`/attempts/${quizId}`, payload);
  return response.data;
};

// Leaderboards
export const getGlobalLeaderboard = async () => {
  const response = await api.get('/leaderboard/global');
  return response.data;
};

export const getQuizLeaderboard = async (quizId) => {
  const response = await api.get(`/leaderboard/quiz/${quizId}`);
  return response.data;
};

// Admin Analytics
export const getDashboardAnalytics = async () => {
  const response = await api.get('/analytics/dashboard');
  return response.data;
};

export const getExportData = async () => {
  const response = await api.get('/analytics/export');
  return response.data;
};
