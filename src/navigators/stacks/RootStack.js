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
// import MainTopTab from '../tabs/MainTopTab';

const Stack = createNativeStackNavigator();



export default function RootStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">

                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, cardStyles: { backgroundColor: '#ffffff' } }} />
                <Stack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
                <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
                {/* <Stack.Screen name="MainTopTab" component={MainTopTab} options={{ headerShown: true }} /> */}



            </Stack.Navigator>
        </NavigationContainer>
    )
}
