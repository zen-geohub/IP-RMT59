import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_BACKEND,
});

export default http;