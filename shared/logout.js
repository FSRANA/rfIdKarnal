import React, { useState, useEffect, useRef } from 'react';
import { Alert, TouchableOpacity} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';


const LogoutComponent = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const attemptLogout = async () => {

        router.push(`/`);
        dispatch({ type: 'user/setUserData', payload: "" });
        dispatch({ type: 'user/setToken', payload: "" });

        // router.push(`/`);
    }

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to log out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    onPress: () => {
                        attemptLogout();
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: false }
        );
    };

    return (
       
        <TouchableOpacity onPress={handleLogout} style={{ padding: 15 }}>
            <Ionicons name="log-out-outline" size={25} color="orange" />
        </TouchableOpacity>
    )
}

export default LogoutComponent;
