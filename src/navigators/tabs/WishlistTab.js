import React from 'react'
import { StyleSheet, Text, View, FlatList, Image, Pressable, Modal } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import WishList from '../../views/WishList';
import WishListedTeachers from '../../views/WishlistedTeachers';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import GeneralInnerHeader from '../../components/GeneralInnerHeader';

export default function WishlistTab(props) {

    const Tab = createMaterialTopTabNavigator();

    return (
        <View style={[styles.container]}>

            <GeneralInnerHeader heading="Whislist" rootProps={props} />

            <Tab.Navigator

                screenOptions={{
                    activeTintColor: "#085A4E",
                    inactiveTintColor: "#000",
                    tabBarLabelStyle: {
                        fontSize: 14,
                        color: "#085A4E",
                        fontFamily: 'Montserrat-SemiBold',
                        textTransform: 'none'
                    },
                    tabBarItemStyle: { width: widthPercentageToDP(50), },
                    tabBarStyle: { backgroundColor: 'white' },
                    tabBarIndicatorStyle: {
                        backgroundColor: "#085A4E",
                        height: 2
                    },
                }}>
                <Tab.Screen name="WishList" options={{ title: "Courses" }} component={WishList} />
                <Tab.Screen name="WishListedTeachers" options={{ title: "Teachers" }} component={WishListedTeachers} />
            </Tab.Navigator>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    topText: {
        fontSize: 18,
        fontFamily: 'RedHatText-SemiBold',
        //fontWeight:'500',
    },

})