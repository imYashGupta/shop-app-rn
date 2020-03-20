export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_TO_CART = "REMOVE_TO_CART";

export const addToCart = (product) =>{
    return {type:ADD_TO_CART,product:product};
}

export const removeToCart = (product) => {
    return {type:REMOVE_TO_CART,product:product};
} 