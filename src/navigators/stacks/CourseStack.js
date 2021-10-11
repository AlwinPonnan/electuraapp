import React from 'react'
import { View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Courses from '../../views/Courses';
import CourseDetail from '../../views/CourseDetail';

export default function CourseStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Courses">
            <Stack.Screen name="Courses" component={Courses} options={{ headerShown: false, cardStyles: { backgroundColor: '#ffffff' } }} />
            <Stack.Screen name="CourseDetail" component={CourseDetail} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}
