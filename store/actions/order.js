import API from "../../constants/API";
import { authHeader} from "../../constants/authHeader";

export const ADD_TO_ORDER = "ADD_TO_ORDER";
export const GET_ORDERS = "GET_ORDERS";



export const addToOrder = (cart,total,id) => {
   return async dispatch => {
      return new Promise((resolve,reject) => {
         API.post("/order/add", {
            cart: cart,
            total: total
         },authHeader(window.auth.token)).then(res => {
            //console.log(res);
            dispatch({ type: ADD_TO_ORDER, cart: cart, total: total, orderId: res.data.orderID });
             resolve(res);
         }).catch(error => {
            reject(error);
         })   
      })
   }
  
}

export const getOrders = (userID) => {
   return async (dispatch,state) => {
      return new Promise((resolve,reject) => {
         API.get("orders",authHeader(state().auth.token)).then(response => {
            dispatch({type:GET_ORDERS,orders:response.data.orders});
            resolve(response);

         }).catch(error => {
            reject(error);
         })   
         
      })      
   }

   //dispatch({ type: GET_ORDERS, orders:[]});
}
 