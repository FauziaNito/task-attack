import axios from 'axios';

const todoApi = axios.create({
  baseURL: 'http://localhost:3000',
});

export default todoApi;
