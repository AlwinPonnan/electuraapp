import React, { createContext, useContext, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavBar from '../../components/Navbar'
import LoginScreen from '../../views/LoginScreen';
import HomeScreen from '../../views/HomeScreen';
import RegisterScreen from '../../views/RegisterScreen';
import MainBottomTab from '../tabs/MainBottomTab';
import OtpScreen from '../../views/OtpScreen';

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
                            <>
                                <Stack.Screen name="MainBottomTab" component={MainBottomTab} options={{ headerShown: false }} />
                            </>
                            :
                            <>
                                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, cardStyles: { backgroundColor: '#ffffff' } }} />
                                <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
                                <Stack.Screen name="MainBottomTab" component={MainBottomTab} options={{ headerShown: false }} />
                                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                            </>
                    }


                </Stack.Navigator>
            </NavigationContainer>
        </isAuthorisedContext.Provider>
    )
}
