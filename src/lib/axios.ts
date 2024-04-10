import axios from 'axios';

let baseURL;

if (window.location.hostname === "talisma-cassoma.github.io") {
  // Set production base URL
  baseURL = 'https://our-money-bkd.onrender.com/api';
} else {
  // Set localhost base URL
  baseURL = 'https://3333-talismacassoma-ourmoney-qrpqvls16s7.ws-eu110.gitpod.io';
}

export const api = axios.create({ baseURL });