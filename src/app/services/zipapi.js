import axios from 'axios';

const zipapi = axios.create({
  baseURL: 'http://viacep.com.br/ws'
});

export default zipapi;
