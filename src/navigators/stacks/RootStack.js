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

import { axiosApiInstance } from '../../../App';
import ShoppingCart from '../../views/ShopingCart';
import PaymentSuccess from '../../views/PaymentSuccess';
import PaymentFailed from '../../views/PaymentFailed';
import OrderSummary from '../../views/OrderSummary';
import Order from '../../views/Order';
import OrderDetail from '../../views/OrderDetail';
import IncomingOrders from '../../views/IncomingOrders';
import AddCoupons from '../../views/AddCoupons';
import WishList from '../../views/WishList';
import CourseDetail from '../../views/CourseDetail';
import Testzoom from '../../views/Testzoom';
import zoomMeeting from '../../views/zoomMeeting';
import linking from '../../globals/Linking';
import WishListedTeachers from '../../views/WishlistedTeachers';
const Stack = createNativeStackNavigator();

export const AuthContext = createContext()
export const roleContext = createContext()
export const profileContext = createContext()
export const loadingContext = createContext()



export default function RootStack() {
    const [roleName, setRoleName] = useState('USER');
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useContext(loadingContext);



    const CheckAuthorized = async () => {
        setLoading(true)
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
        setLoading(false)
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
        axiosApiInstance.interceptors.request.use(
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
        axiosApiInstance.interceptors.response.use(
            (res) => {
                // Add configurations here
                return res;
            },
            async (err) => {
                console.log("INterceptor error")
                const originalRequest = err.config;
                // Access Token was expired
                if (err?.response?.status == 401 && !originalRequest._retry) {
                    console.log("asddsa")
                    // let authToken = await EncryptedStorage.getItem('AUTH_TOKEN')
                    // await EncryptedStorage.removeItem('AUTH_TOKEN')
                    // if (originalRequest) {
                    originalRequest._retry = true;

                    try {
                        let token = await EncryptedStorage.getItem('AUTH_REFRESH_TOKEN')
                        const rs = await axios.get(`${serverUrl}/users/generateNewAccessToken/${token}`)
                        console.log(rs.data)
                        if (rs.data.success) {
                            await EncryptedStorage.setItem('AUTH_TOKEN', rs.data.data)
                            let decodedToken = await jwt_decode(rs.data.data)
                            setRoleName(decodedToken.role)
                            axios.defaults.headers["authorization"] = 'Bearer' + rs.data.data;
                            return axiosApiInstance(originalRequest)
                        }

                    } catch (error) {
                        await EncryptedStorage.removeItem('AUTH_TOKEN')
                        await EncryptedStorage.removeItem('AUTH_REFRESH_TOKEN')
                        setIsAuthorized(false)

                        return Promise.reject(err);
                    }
                    // }
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

                    <NavigationContainer linking={linking}>
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
                                    <Stack.Screen name="ShoppingCart" component={ShoppingCart} options={{ headerShown: false }} />
                                    <Stack.Screen name="OrderSummary" component={OrderSummary} options={{ headerShown: false }} />
                                    <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} options={{ headerShown: false }} />
                                    <Stack.Screen name="PaymentFailed" component={PaymentFailed} options={{ headerShown: false }} />
                                    <Stack.Screen name="Orders" component={Order} options={{ headerShown: false }} />
                                    <Stack.Screen name="OrderDetail" component={OrderDetail} options={{ headerShown: false }} />
                                    <Stack.Screen name="IncomingOrders" component={IncomingOrders} options={{ headerShown: false }} />
                                    <Stack.Screen name="AddCoupons" component={AddCoupons} options={{ headerShown: false }} />
                                    <Stack.Screen name="wishlist" component={WishList} options={{ headerShown: false }} />
                                    <Stack.Screen name="wishlistedTeacher" component={WishListedTeachers} options={{ headerShown: false }} />

                                    <Stack.Screen name="CourseDetail" component={CourseDetail} options={{ headerShown: false }} />
                                    <Stack.Screen name="TestZoom" component={Testzoom} options={{ headerShown: false, showLabel: false, cardStyles: { backgroundColor: '#ffffff' } }} />
                                    <Stack.Screen name="zoomMeeting" component={zoomMeeting} options={{ headerShown: false, showLabel: false, cardStyles: { backgroundColor: '#ffffff' } }} />


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
                </profileContext.Provider>
            </roleContext.Provider>
        </AuthContext.Provider>
    )
}
