import { createStore } from 'redux';
import auth from './reducers/auth';

const store = createStore(auth);

export default store;