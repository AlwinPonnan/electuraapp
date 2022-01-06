import React from 'react'
import { View, Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateEnquiry from '../../views/CreateEnquiry';
import Enquiry from '../../views/Enquiry';
import GeneralEnquiries from '../../views/GeneralEnquiries';
import EnquiryDetail from '../../views/EnquiryDetail';

export default function EnquiryStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="EnquiryScreen">
            <Stack.Screen name="EnquiryScreen" component={Enquiry} options={{ headerShown: false, cardStyles: { backgroundColor: '#ffffff' } }} />
            <Stack.Screen name="CreateEnquiry" component={CreateEnquiry} options={{ headerShown: false }} />
            <Stack.Screen name="GeneralEnquiries" component={GeneralEnquiries} options={{ headerShown: false }} />
            <Stack.Screen name="EnquiryDetail" component={EnquiryDetail} options={{ headerShown: true,title:"Enquiry Detail" }} />

        </Stack.Navigator>
    )
}
