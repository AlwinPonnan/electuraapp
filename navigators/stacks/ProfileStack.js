import React from 'react'
import { View, Text } from 'react-native'
import AccountScreen from '../../views/AccountScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountEdit from '../../views/AccountEdit';

export default function ProfileStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="AccountScreen">
            <Stack.Screen name="AccountScreen" component={AccountScreen} options={{ headerShown: false, cardStyles: { backgroundColor: '#ffffff' } }} />
            <Stack.Screen name="AccountEdit" component={AccountEdit} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}
