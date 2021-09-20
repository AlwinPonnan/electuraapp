import React, { createContext, useContext, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavBar from '../../components/Navbar'
import LoginScreen from '../../views/LoginScreen';
import HomeScreen from '../../views/HomeScreen';
import RegisterScreen from '../../views/RegisterScreen';
import MainBottomTab from '../tabs/MainBottomTab';
import OtpScreen from '../../views/OtpScreen';
import MainDrawer from '../drawers/MainDrawer';

const Stack = createNativeStackNavigator();

export const isAuthorisedContext = createContext();


export default function RootStack() {
    const [isAuth, setIsAuth] = useState(false);
    return (
        <isAuthorisedContext.Provider value={[isAuth, setIsAuth]}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    {
                        isAuth
                            ?
<<<<<<< HEAD
                            <>
                                <Stack.Screen name="MainBottomTab" component={MainBottomTab} options={{ headerShown: false }} />
                            </>
=======
                            <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
>>>>>>> bf3506408d6f83d4a20d520fcc9b8b75dba1e689
                            :
                            <>
                                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, cardStyles: { backgroundColor: '#ffffff' } }} />
                                <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="MainDrawer" component={MainBottomTab} options={{ headerShown: false }} />
                                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                            </>
                    }


                </Stack.Navigator>
            </NavigationContainer>
        </isAuthorisedContext.Provider>
    )
}
