import axios from 'axios';
axios.defaults.baseURL = 'https://secure-wallet-2e423483e107.herokuapp.com';
const instance = axios.create({});


export default instance;
