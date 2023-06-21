import React, { useState } from "react";
import {Stack, useRouter} from 'expo-router';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import ScanningScreen from '../../pages/scanning';

const Scanning = () => {
    const router = useRouter();
    
    return (
        <Provider store={store}>
            <ScanningScreen />
        </Provider>
    )
}

export default Scanning;