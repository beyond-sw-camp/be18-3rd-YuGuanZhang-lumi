import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// 임시 인터셉터 (authStore 나오기 전까지만)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
