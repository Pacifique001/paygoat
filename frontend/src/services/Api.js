import axios from 'axios';

const base = process.env.REACT_APP_API_BASE || 'http://api.paygoat.local';

const api = axios.create({
  baseURL: base,
  // optionally: withCredentials: true,
});

export default api;
