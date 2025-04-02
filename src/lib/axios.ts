import axios from 'axios';

let baseURL;

console.log(window.location.hostname)

if (window.location.hostname === "localhost") {
  // Set production base URL
  baseURL = 'http://localhost:3000/api';
} else {
  // Set localhost base URL
  baseURL = 'https://our-money-bkd.onrender.com/api';
}

export const api = axios.create({ baseURL });