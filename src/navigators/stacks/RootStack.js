import React, { createContext, useContext, useState, useMemo,useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavBar from '../../components/Navbar'
import LoginScreen from '../../views/LoginScreen';
import HomeScreen from '../../views/HomeScreen';
import RegisterScreen from '../../views/RegisterScreen';
import MainBottomTab from '../tabs/MainBottomTab';
import OtpScreen from '../../views/OtpScreen';
import MainDrawer from '../drawers/MainDrawer';
// import MainTopTab from '../tabs/MainTopTab';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios'

const Stack = createNativeStackNavigator();

export const AuthContext = createContext()

export default function RootStack() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const CheckAuthorized = async () => {
        let isLoggedIn = await EncryptedStorage.getItem("AUTH_TOKEN");
        if (isLoggedIn) {
            setIsAuthorized(true)
        }
        else {
            setIsAuthorized(false)
        }
    }


    useMemo(() => {
        axios.interceptors.request.use(
            async (config) => {
                const token = await EncryptedStorage.getItem('AUTH_TOKEN');
                // console.log(token)
                if (token) {
                    config.headers['authorization'] = 'Bearer ' + token;
                }
                // config.headers['Content-Type'] = 'application/json';
                return config;
            },
            error => {
                Promise.reject(error)
            });
        axios.interceptors.response.use(
            (res) => {
                // Add configurations here
                return res;
            },
            (err) => {
                if (err?.response?.status === 401) {
                    // console.log("ONLY IN ERROR")
                    // toast.error('401 Unauthorized')
                    EncryptedStorage.removeItem('AUTH_TOKEN')
                    setIsAuthorized(false)
                }
                return Promise.reject(err);
            }
        );
    }, [])

    useEffect(() => {
        CheckAuthorized()
    }, [])

    return (
        <AuthContext.Provider value={[isAuthorized,setIsAuthorized]}>

        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                {isAuthorized ?
                    <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
                    
                    :
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, cardStyles: { backgroundColor: '#ffffff' } }} />
                        <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
                    </>
                }

                {/* <Stack.Screen name="MainTopTab" component={MainTopTab} options={{ headerShown: true }} /> */}



            </Stack.Navigator>
        </NavigationContainer>
                </AuthContext.Provider>
    )
}
