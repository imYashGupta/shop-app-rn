import { LOGIN, SIGNUP, AUTH, LOGOUT, UPDATE_USER} from "../actions/auth";

const initialState = {
    token:null,
    user:{}
}

export default (state = initialState,action) => {
    switch (action.type) {
        case AUTH:
            return { token: action.token, user: action.user };
            break;
        case LOGOUT:
            return {token:null,user:null}    
        case UPDATE_USER:
            return {...state,user:action.user};
        default:
            return state;
            break;

    }
    return state;
}