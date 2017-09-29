import axios from 'axios';
const apiUrl = 'http://localhost:3000/';

let options = {
    baseURL: apiUrl,
    timeout: 300000
}


let api = axios.create(options);
export default api;
