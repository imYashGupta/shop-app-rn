import { ADD_TO_CART, REMOVE_TO_CART } from "../actions/cart";
import { ToastAndroid } from "react-native";
import { ADD_TO_ORDER } from "../actions/order";
// import { PRODUCT } from "../../data/products";

const initialState = {
    cart:{},
    total:0
}

const getCartTotal = (newCart) => {
    let total = 0;
    for (let p in newCart) {
        let itemtotal = newCart[p].price * newCart[p].qty;
        total = total + itemtotal;
    }   
    return total;
}

export default (state = initialState,action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const product = action.product;
            if (state.cart[product.id]) {
                const qty = state.cart[product.id].qty;
                product.qty = qty+1;
            }
            else{
                product.qty = 1;
            }
            const newCart={ ...state.cart, [product.id]: product };
            let total=0;
            for (let p in newCart) {
                let itemtotal = newCart[p].price * newCart[p].qty;
                total = total+itemtotal;
            }
            ToastAndroid.show('Item Added to Cart!', ToastAndroid.SHORT);
            total.toFixed(2)
            return { ...state, cart: newCart,total:total };
            break;
        case REMOVE_TO_CART:
            const item = state.cart[action.product.id];
            const updatedCart = {...state.cart};
            if (item.qty > 1) {
                updatedCart[item.id].qty=updatedCart[item.id].qty - 1 ;
             
            }
            else{
                delete updatedCart[item.id];
            }
            return { ...state, cart: updatedCart, total: getCartTotal(updatedCart)};    
        case ADD_TO_ORDER:
            return {...state,cart:{},total:0};
        default:
            return state;
            break;
    }
    return state;
}