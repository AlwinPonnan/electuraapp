import React from 'react'
import { View, Text } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Requestscreen from '../../views/RequestScreen';
import Chat from '../../views/Chat';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const Tab = createMaterialTopTabNavigator();

export default function MainTopTab() {
    return (
        <Tab.Navigator
            screenOptions={{
                activeTintColor: "#085A4E",
                inactiveTintColor: "#000",
                tabBarLabelStyle: {
                    fontSize: 16,
                    color: "#085A4E",
                    fontFamily:'Montserrat-SemiBold',
                    textTransform:'none'
                },
                tabBarItemStyle: { width: widthPercentageToDP(50) },
                tabBarStyle: { backgroundColor: 'white' },
                tabBarIndicatorStyle: {
                    backgroundColor: "#085A4E",
                    height:1
                },
            }}>
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="RequestScreen" options={{title:'Requests'}} component={Requestscreen} />
        </Tab.Navigator>
    )
}
