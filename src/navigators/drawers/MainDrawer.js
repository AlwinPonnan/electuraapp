import React, { useState, useContext, useEffect } from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity, Linking
} from 'react-native';
import 'react-native-gesture-handler';
import MainBottomTab from '../tabs/MainBottomTab';
import AccountEdit from '../../views/AccountEdit';

import Icon from 'react-native-vector-icons/Ionicons'
import { colorObj } from '../../globals/colors';
import MainTopTab from '../tabs/MainTopTab';

const Drawer = createDrawerNavigator();

////////////////////custom user drawer 
function CustomDrawerContent(props) {




    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.profilePicContainer}>
                <Image source={require('../../../assets/images/user.png')} style={styles.profilePic} />
            </View>
            <Text style={styles.userName}>Bhaskar Pandey</Text>


            <Text style={{ textAlign: "center", fontFamily: "OpenSans-Regular" }}>9999999999</Text>


            <View style={{ marginBottom: 20, display: "flex", flexDirection: "column" }}>
                <TouchableOpacity style={styles.DrawerItem}><Text style={styles.drawerItemTxt}><Icon name="home-outline" size={16} color={colorObj.primarColor} /> Home</Text></TouchableOpacity>

                <TouchableOpacity style={styles.DrawerItem}><Text style={styles.drawerItemTxt}><Icon name="cog-outline" size={16} color={colorObj.primarColor} /> Account Settings</Text></TouchableOpacity>
                <TouchableOpacity style={styles.DrawerItem}><Text style={styles.drawerItemTxt}><Icon name="home-outline" size={16} color={colorObj.primarColor} /> Blogs</Text></TouchableOpacity>
                <TouchableOpacity style={styles.DrawerItem}><Text style={styles.drawerItemTxt}><Icon name="information-circle-outline" size={16} color={colorObj.primarColor} /> About Us</Text></TouchableOpacity>

                <TouchableOpacity style={styles.DrawerItem}><Text style={styles.drawerItemTxt}><Icon name="help-outline" size={16} color={colorObj.primarColor} /> Support</Text></TouchableOpacity>
                <TouchableOpacity style={styles.DrawerItem}><Text style={styles.drawerItemTxt}><Icon name="help-circle-outline" size={16} color={colorObj.primarColor} /> FAQs</Text></TouchableOpacity>
                <TouchableOpacity style={styles.DrawerItem}><Text style={styles.drawerItemTxt}><Icon name="document-text-outline" size={16} color={colorObj.primarColor} /> Policies</Text></TouchableOpacity>
                <TouchableOpacity style={styles.DrawerItem}><Text style={styles.drawerItemTxt}><Icon name="log-out-outline" size={16} color={colorObj.primarColor} /> Logout</Text></TouchableOpacity>

            </View>
            <View style={styles.teacherContainer} >
                <Text style={styles.teacherHeading}>Become Teacher</Text>
                <Image source={require('../../../assets/images/teacherVector.png')} />
                <Text style={[styles.teacherHeading, { fontSize: 12, fontFamily: 'OpenSans-Regular' }]}>List your profile on Electura and spread your word</Text>
                <View style={styles.teachButton}>
                    <Text style={styles.teachText}>Teach</Text>
                </View>
            </View>
        </DrawerContentScrollView>
    );
}


export default function MainDrawer() {
    return (
        <Drawer.Navigator screenOptions={{ headerShown: false }} drawerContent={props => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="MainBottomTab" component={MainBottomTab} />
            <Drawer.Screen name="AccountEdit" component={AccountEdit} />
        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({
    DrawerItem: {
        marginLeft: 22,
        marginTop: 10
    },

    drawerItemTxt: {
        color: colorObj.primarColor,
        fontFamily: "OpenSans-Regular",
        textTransform: "capitalize",
        fontSize: 16,
        marginVertical: 5
    },
    Name: {
        fontWeight: '900',
        fontSize: 19,
        justifyContent: "center",
        color: colorObj.primarColor,
        marginLeft: 15,
        fontFamily: "OpenSans-SemiBold",

    },
    profilePicContainer: {
        // backgroundColor: "#f2f2f2",
        height: 140,
        width: 140,
        marginTop: hp(2),
        display: "flex",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 150
    },
    profilePic: {
        borderRadius: 100,
        width: 120,
        height: 120
    },
    userName: {
        fontSize: 18,
        marginTop: 18,
        textAlign: "center",
        textTransform: 'capitalize',
        fontFamily: "OpenSans-Bold",
    },
    Logoutbtn: {
        backgroundColor: "#FFCB05",
        marginLeft: 22,
        position: "absolute",
        bottom: 80,
        // paddingHorizontal: 15
        width: 130,
        height: 35,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 2,

    },
    logoutBtnTxt: {
        fontFamily: "OpenSans-Regular",
        textTransform: "capitalize",
        color: "#6b6a6a",
    },
    teacherContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 20
    },
    teacherHeading: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: colorObj.primarColor,
        marginVertical: 10,
        textAlign: 'center',
        paddingHorizontal: 20
    },
    teachButton: {
        backgroundColor: colorObj.primarColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 3
    },
    teachText: {
        fontFamily: 'OpenSans-SemiBold',
        color: colorObj.whiteColor
    }
});
