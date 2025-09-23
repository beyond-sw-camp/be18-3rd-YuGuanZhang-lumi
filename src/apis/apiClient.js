import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 5000,
  withCredentials: true,
});

apiClient.interceptors.request.use(config => {
  return config;
});

apiClient.interceptors.response.use(config => {
  return config;
});

export default apiClient;
