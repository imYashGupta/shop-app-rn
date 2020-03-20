import API from "../../constants/API";
import { AsyncStorage } from "react-native";

export const SIGNUP = "SIGNUP";
export const LOGIN  = "LOGIN";
export const AUTH = "AUTH";
export const LOGOUT = "LOGOUT";
export const UPDATE_USER = "UPDATE_USER";
const saveDataToStorage = (token,user,expDate) => {
    AsyncStorage.setItem("userData", JSON.stringify({ token: token, user: user, expires_in: expDate.toISOString()}));
}         

export const updateUser = (user) => {
    console.log("store",user);
    AsyncStorage.getItem("userData").then(userData => {
        let userD=JSON.parse(userData);
        saveDataToStorage(userD.token, user, new Date(userD.expires_in));
    });

    return {type:UPDATE_USER,user:user};
}

export const signup = (name,email,password) => {
    return async dispatch => {
        return new Promise((resolve,reject) => {
            API.post('register', {
                name,
                email,
                password
            }).then(response => {
                API.post("login", {
                    email,
                    password
                }).then(r => {
                    dispatch({ type: AUTH, token: r.data.access_token, user: response.data });
                    const expDate = new Date(new Date().getTime() + r.data.expires_in * 1000);
                    saveDataToStorage(r.data.access_token, response.data, expDate);
                    resolve(response);
                });
            }).catch(error => {
                reject(error);
            });
        });
    }
}

export const login = (email ,password) => {
    return async dispatch => {
        return new Promise((resolve,reject) => {
            API.post("login",{
                email,
                password
            }).then(response => {
                API.get("/user",{
                        headers:{
                            "Authorization": `Bearer ${response.data.access_token}`
                        }
                }).then(r => {
                    dispatch({ type: AUTH, token: response.data.access_token,user:r.data});
                    const expDate = new Date(new Date().getTime() + response.data.expires_in * 1000);
                    saveDataToStorage(response.data.access_token, r.data, expDate);
                    window.auth={
                        user:r.data,
                        token: response.data.access_token
                    }
                    resolve(response)
                })
            }).catch(error => reject(error));
        })
    }
}

export const auth = (token,user) => {
    return async dispatch => {
        window.auth = {
            token: token,
            user: user
        }
        return dispatch({ type: AUTH, token: token, user: user });
    }
}

export const logout = () => {
    AsyncStorage.removeItem("userData");
    window.auth=undefined;
    return {type:LOGOUT};
}