// store.js
import { configureStore } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  userData: null,
  token: null,
};

// Reducer function
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'user/setUserData':
      return {
        ...state,
        userData: action.payload,
      };
    case 'user/setToken':
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
};

// Create the Redux store
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
