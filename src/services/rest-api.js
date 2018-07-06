import axios from 'axios';

export const restAPI = axios.create({
  baseURL: 'http://localhost:8000/api',
})
