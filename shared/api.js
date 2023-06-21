import axios from 'axios';

// Create axios client, pre-configured with baseURL
let API = axios.create({
  baseURL: 'https://dev.karnal-rfid.pinnacleynr.com/api/',
  timeout: 10000,
});

// Set JSON Web Token in Client to be included in all calls
export const setClientToken = token => {
  API.interceptors.request.use(function(config) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['Content-Type'] = `application/x-www-form-urlencoded`;
    config.headers.Accept = `application/json`;
    return config;
  });
};

export default API;