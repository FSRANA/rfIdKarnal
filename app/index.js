import React, { useState } from "react";
import { Provider } from 'react-redux';
import store from '../redux/store';
import Login from '../pages/login';

const App = () => {

    
    return (
        <Provider store={store}>
            <Login />
        </Provider>
    )
}

export default App;