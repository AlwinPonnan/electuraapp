import React from 'react'
import { View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Courses from '../../views/Courses';
import CourseDetail from '../../views/CourseDetail';
import OrderSummary from '../../views/OrderSummary';
import PaymentSuccess from '../../views/PaymentSuccess';
import PaymentFailed from '../../views/PaymentFailed';
import Order from "../../views/Order";
import ShopingCart from '../../views/ShopingCart';
import WishList from '../../views/WishList';
import Summary from '../../views/Summary';
import Coupons from '../../views/Coupons';
import AllCourses from '../../views/AllCourses';

export default function CourseStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Course">
            <Stack.Screen name="Course" component={Courses} options={{ headerShown: false, cardStyles: { backgroundColor: '#ffffff' } }} />
            <Stack.Screen name="CourseDetail" component={CourseDetail} options={{ headerShown: false }} />
            <Stack.Screen name="AllCourses" component={AllCourses} options={{ headerShown: false, showLabel: false, cardStyles: { backgroundColor: '#ffffff' } }} />

            {/* <Stack.Screen name="OrderSummary" component={OrderSummary} options={{ headerShown: false }} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} options={{ headerShown: false }} />
            <Stack.Screen name="PaymentFailed" component={PaymentFailed} options={{ headerShown: false }} />
            <Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
            <Stack.Screen name="ShopingCart" component={ShopingCart} options={{ headerShown: false }} />
            <Stack.Screen name="WishList" component={WishList} options={{ headerShown: false }} />
            <Stack.Screen name="Summary" component={Summary} options={{ headerShown: false }} />
            <Stack.Screen name="Coupons" component={Coupons} options={{ headerShown: false }} /> */}
        </Stack.Navigator>
    )
}
