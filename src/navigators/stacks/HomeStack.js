import React from 'react'
import { View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Courses from '../../views/Courses';
import CourseDetail from '../../views/CourseDetail';
import HomeScreen from '../../views/HomeScreen';
import MainTopTab from '../tabs/MainTopTab';
import SearchScreen from '../../views/SearchScreen';
import Notification from '../../views/Notification';
import TeacherProfile from '../../views/TeacherProfile';
import AllTeacher from '../../views/AllTeacher';
import AllCourses from '../../views/AllCourses';
import Testzoom from '../../views/Testzoom';
import TeacherSlots from '../../views/TeacherSlots';



export default function HomeStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="HomeScreen"  >
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false, showLabel: false, cardStyles: { backgroundColor: '#ffffff' } }} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false, showLabel: false, cardStyles: { backgroundColor: '#ffffff' } }} />
            <Stack.Screen name="TeacherProfile" component={TeacherProfile} options={{ headerShown: false, showLabel: false, cardStyles: { backgroundColor: '#ffffff' } }} />
            <Stack.Screen name="TeacherSlots" component={TeacherSlots} options={{ headerShown: false, showLabel: false, cardStyles: { backgroundColor: '#ffffff' } }} />
            <Stack.Screen name="AllTeacher" component={AllTeacher} options={{ headerShown: false, showLabel: false, cardStyles: { backgroundColor: '#ffffff' } }} />
            {/* <Stack.Screen name="AllCourses" component={AllCourses} options={{ headerShown: false, showLabel: false, cardStyles: { backgroundColor: '#ffffff' } }} /> */}
            <Stack.Screen name="TestZoom" component={Testzoom} options={{ headerShown: false, showLabel: false, cardStyles: { backgroundColor: '#ffffff' } }} />
        </Stack.Navigator>
    )
}
