import React from 'react'
import { View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from '../../views/Settings';
import Wallet from '../../views/Wallet';

export default function SettingStack() {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName="AccountScreen">
            <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false, cardStyles: { backgroundColor: '#ffffff' } }} />
            <Stack.Screen name="Wallet" component={Wallet} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}
