import React from 'react'
import { View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateEnquiry from '../../views/CreateEnquiry';
import Enquiry from '../../views/Enquiry';

export default function EnquiryStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Enquiry">
            <Stack.Screen name="Enquiry" component={Enquiry} options={{ headerShown: false, cardStyles: { backgroundColor: '#ffffff' } }} />
            <Stack.Screen name="CreateEnquiry" component={CreateEnquiry} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}
