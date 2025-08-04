import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

export const analyzeSupport = async (answer, citations) => {
  const response = await api.post('/analyze-support', { answer, citations });
  return response.data;
};
