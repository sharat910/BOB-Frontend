import axios from 'axios';

export const restAPI = axios.create({
  baseURL: 'http://192.168.0.120:8000/api',
})
