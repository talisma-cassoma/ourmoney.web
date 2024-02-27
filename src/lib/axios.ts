import axios from 'axios';

let baseURL;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // Set localhost base URL
  baseURL = 'http://localhost:3333';
} else {
  // Set production base URL
  baseURL = 'https://our-money-bkd.onrender.com/api';
}

export const api = axios.create({ baseURL });