import API, { BASE_URL } from "./../../constants/API";
import { authHeader } from "../../constants/authHeader";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const DELETE_PRODUCT ="DELETE_PRODUCT";
export const GET_PRODUCTS= "GET_PRODUCT";
export const FAVORITE = "FAVORITE";
export const GET_FAVORITES = "GET_FAVORITES";
import { ToastAndroid } from "react-native";
import Axios from "axios";

export const createProduct = (title,desc,price,imageUrl) => {
    return async dispatch => {
        return new Promise((resolve,reject) => {
            API.post("/product/add",{
                title, desc, price, image:imageUrl
            }, authHeader(window.auth.token)).then(res => {
                dispatch({
                    type: CREATE_PRODUCT,
                    product:res.data.product,
                });
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        })
    }

}

export const updateProduct = (id,title, desc, image) => {
    return async dispatch =>{
        return new Promise((resolve,reject) => {
            API.post("product/update/" + id, {
                title: title,
                desc: desc,
                image: image
            }, authHeader(window.auth.token)).then(res => {
                    dispatch({
                        type: UPDATE_PRODUCT,
                        pid: id,
                        product: res.data.product
                    });
                    resolve(res);
                })
                .catch(error => {
                    console.log("Err", error)
                    reject(error);
                });
        })
    }
}

export const getProducts = (url,loadmore = false) => {
    return async (dispatch,getState) => {
        return new Promise((resolve,reject) => {
            const user = getState().auth;
            Axios.get(url, authHeader(user.token)).then(response => {
                const resData = response.data.products.data;
                dispatch({ type: GET_PRODUCTS, products: resData, user: user.user.id, loadmore: loadmore });
                resolve(response);
            }).catch(error => {
                //console.log("error is here")
                reject(error);
            })
        })
         
    }

     
}

export const favorite = (product) => {
    return async (dispatch, getState) => {
        return new Promise((resolve,reject) => {
            API.post("setFavorite/" + product.id, {}, authHeader(getState().auth.token)).then(response => {
                resolve(response);
                dispatch({ type: FAVORITE, favorite:response.data.favorite,product:product});
                //ToastAndroid.show(response.data.favorite == 0 ? "Product Removed from WishList" : "Product Added to WishList", ToastAndroid.SHORT);
            }).catch(error => {
               // ToastAndroid.show("Something went wrong, Please try again later", ToastAndroid.SHORT);
                reject(error);
            })
        });
    }
}

export const getFavorites = () => {
    return async (dispatch,getState) => {
        return new Promise((resolve,reject) => {
            API.get("favorites",authHeader(getState().auth.token)).then(response => {
                dispatch({type:GET_FAVORITES,favorites:response.data});
                resolve(response);
            }).catch(error => {
                reject(error);
            })
        })
    }
}

export const deleteProduct= (productID) => {
    return async (dispatch,getState) => {
        return new Promise((resolve,reject) => {
            API.delete("product/" + productID,authHeader(getState().auth.token)).then(response => {
                dispatch({type:DELETE_PRODUCT,product:response.data.product});
                resolve(response);
            }).catch(err =>{
                reject(err);
            })
        })
    }
}