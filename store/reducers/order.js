import { ADD_TO_ORDER, GET_ORDERS } from "../actions/order";

ADD_TO_ORDER
const initialState = {
    orders:[
        // {
        //     products:[],
        //     total:123
        // }
    ]
}

export default (state = initialState,action) => {
    switch (action.type) {
        case GET_ORDERS:
            return {
                orders:action.orders
            }    
        break;
        case ADD_TO_ORDER:
           
            const newOrder = {
                items:action.cart,
                total:action.total.toFixed(2),
                id: action.orderId
            };
           
            const updateOrder = [...state.orders, newOrder];
            return {
                ...state,
                orders: updateOrder
            }
            break;
    
        default:
            break;
    }

    return state;
}