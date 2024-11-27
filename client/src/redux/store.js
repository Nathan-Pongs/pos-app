import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Corrected import for thunk
import { composeWithDevTools } from '@redux-devtools/extension';
import { rootReducer } from './rootReducer'; // Corrected import for rootReducer


// Combine reducers (if you have multiple reducers, otherwise use rootReducer directly)
const finalReducer = combineReducers({
  rootReducer, // Use 'root' as the key for the combined reducer
});

const intialState = {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
  };

const middleware = [thunk]

// Create the Redux store
const store = createStore(
  finalReducer, // Use finalReducer here
  intialState, // Correct initial state structure
  composeWithDevTools(applyMiddleware(...middleware)) // Use thunk as named import
);

export default store;
