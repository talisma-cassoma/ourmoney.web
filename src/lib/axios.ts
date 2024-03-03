import axios from 'axios';

let baseURL;

if (window.location.hostname === "talisma-cassoma.github.io") {
  // Set production base URL
  baseURL = 'https://our-money-bkd.onrender.com/api';
} else {
  // Set localhost base URL
  baseURL = 'http://localhost:3000';
}

export const api = axios.create({ baseURL });