import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

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

import CreateCourse from '../../views/CreateCourse'
import { serverUrl } from '../../Services/Url';
import { getDecodedToken } from '../../Services/User';
import jwt_decode from "jwt-decode";
import { connectToServerSocket, disconnectToServerSocket } from '../../globals/socket';
import Notification from '../../views/Notification';
import MainTopTab from '../tabs/MainTopTab';
import SpecificChat from '../../views/SpecificChat';
import LoadingContainer from '../../views/LoadingContainer';


const Stack = createNativeStackNavigator();

export const AuthContext = createContext()
export const roleContext = createContext()
export const profileContext = createContext()
export const loadingContext = createContext()



export default function RootStack() {
    const [roleName, setRoleName] = useState('USER');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(false);



    const CheckAuthorized = async () => {
        let isLoggedIn = await EncryptedStorage.getItem("AUTH_TOKEN");
        console.log(isLoggedIn)
        if (isLoggedIn) {
            let tempRole = await getDecodedToken()
            setRoleName(tempRole.role)
            setIsAuthorized(true)
        }
        else {
            setIsAuthorized(false)
        }
    }

    useEffect(() => {
        if (isAuthorized)
            connectToServerSocket()
        else
            disconnectToServerSocket()
        return () => disconnectToServerSocket()
    }, [isAuthorized])

    useEffect(() => {
    }, [roleName])


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
            async (err) => {
                console.log("INterceptor error")

                // Access Token was expired
                if (err?.response?.status === 401) {
                    let authToken = await EncryptedStorage.getItem('AUTH_TOKEN')
                    await EncryptedStorage.removeItem('AUTH_TOKEN')
                    if (authToken) {

                        try {
                            let token = await EncryptedStorage.getItem('AUTH_REFRESH_TOKEN')
                            const rs = await axios.get(`${serverUrl}/users/generateNewAccessToken/${token}`)
                            console.log(rs.data)
                            if (rs.data.success) {
                                await EncryptedStorage.setItem('AUTH_TOKEN', rs.data.data)
                                let decodedToken = await jwt_decode(rs.data.data)
                                console.log(decodedToken.role)
                                setRoleName(decodedToken.role)
                                return axios(err.config)
                            }

                        } catch (error) {
                            await EncryptedStorage.removeItem('AUTH_TOKEN')
                            await EncryptedStorage.removeItem('AUTH_REFRESH_TOKEN')
                            setIsAuthorized(false)

                            return Promise.reject(error);
                        }
                    }
                }

                return Promise.reject(err);
            }
        );
    }, [])

    useEffect(() => {
        CheckAuthorized()
    }, [])

    return (
        <AuthContext.Provider value={[isAuthorized, setIsAuthorized]}>
            <roleContext.Provider value={[roleName, setRoleName]}>
                <profileContext.Provider value={[profileData, setProfileData]}>
                    <loadingContext.Provider value={[loading, setLoading]}>

                        <NavigationContainer>
                            <Stack.Navigator initialRouteName="Login">
                                {isAuthorized ?
                                    <>
                                        <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
                                        <Stack.Screen name="CreateCourse" component={CreateCourse} options={{ headerShown: false }} />
                                        <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false, cardStyles: { backgroundColor: '#ffffff' } }} />
                                        <Stack.Screen name="MainTopTab" component={MainTopTab} options={{
                                            headerShown: true, showLabel: false, title: "", label: "",
                                            headerShadowVisible: false
                                        }} />
                                        <Stack.Screen name="SpecificChat" component={SpecificChat} options={{
                                            headerShown: false
                                        }} />
                                    </>

                                    :
                                    <>
                                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, cardStyles: { backgroundColor: '#ffffff' } }} />
                                        <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
                                    </>
                                }

                                {/* <Stack.Screen name="MainTopTab" component={MainTopTab} options={{ headerShown: true }} /> */}



                            </Stack.Navigator>
                        </NavigationContainer>
                        {loading &&
                            <LoadingContainer />
                        }
                    </loadingContext.Provider>
                </profileContext.Provider>
            </roleContext.Provider>
        </AuthContext.Provider>
    )
}
