import React from 'react'
import { View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Courses from '../../views/Courses';
import CourseDetail from '../../views/CourseDetail';
import HomeScreen from '../../views/HomeScreen';
import MainTopTab from '../tabs/MainTopTab';



export default function HomeStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="HomeScreen">
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false, showLabel: false, cardStyles: { backgroundColor: '#ffffff' } }} />
            <Stack.Screen name="MainTopTab" component={MainTopTab} options={{ headerShown: true, showLabel: false, title: "", label: "" }} />
        </Stack.Navigator>
    )
}
