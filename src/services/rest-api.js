import axios from 'axios';
import http from 'http';

export const restAPI = axios.create({
  baseURL: 'http://192.168.0.120:8000/api',
  httpAgent: new http.Agent({ keepAlive: true }),
})
