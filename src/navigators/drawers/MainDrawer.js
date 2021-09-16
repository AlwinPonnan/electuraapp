import React from 'react'
import { View, Text } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainBottomTab from '../tabs/MainBottomTab';
import AccountEdit from '../../views/AccountEdit';
export default function MainDrawer() {
    const Drawer = createDrawerNavigator();
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="MainBottomTab" component={MainBottomTab} />
            <Drawer.Screen name="AccountEdit" component={AccountEdit} />
        </Drawer.Navigator>
    )
}
