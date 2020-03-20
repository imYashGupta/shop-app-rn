import axios from "axios";
// import store from "../store/store";
export const HOSTIP = "http://10.0.2.2:8000/";
const HOSTLARAVEL = "http://localhost:8000/";
const MOBILE = "http://192.168.43.102:8000/";
const LOCALHOST = "http://localhost/";
const HEROKU = "http://tranquil-crag-19664.herokuapp.com/public/"
export const BASE_URL = HEROKU;
// const auth=store.getState();

 

// const API = axios.create({
//     baseURL: HOSTLARAVEL+'/api',
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });
const API = axios.create()
API.defaults.baseURL = BASE_URL + "api/";
// if (auth.token!=null) {
//     axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth.token;
// }
// console.log("API",auth);
API.defaults.headers.post['Content-Type'] = 'application/json';

// const API = () => {
//     return axios.create({
//         baseURL: HOSTLARAVEL + "/api/",
//         'Content-Type': 'application/json',
//     });
// }

export default API;  