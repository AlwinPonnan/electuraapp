import React, { useState, useContext, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj, light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import NavBar from '../components/Navbar';
import { Switch } from 'react-native-paper';

import { roleContext } from '../navigators/stacks/RootStack';
import { getUser, toggleOnline } from '../Services/User';
import { useIsFocused } from '@react-navigation/core';
import { successAlertContext } from '../../App';

export default function Profile(props) {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);

    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    const [roleName, setRoleName] = useContext(roleContext);

    const focused = useIsFocused()

    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr



    const handleToggle = async () => {
        try {
            let { data: res } = await toggleOnline();
            if (res.success) {
                setSuccessAlert(true)
                setAlertText(`${res.message}`)
                // alert(res.message)
                userGet()
            }
        } catch (error) {
            console.error(error)
        }
    }



    const userGet = async () => {
        try {
            const { data: res } = await getUser();
            if (res.success) {
                console.log(res.data.onlineToggle)
                setIsSwitchOn(res.data.onlineToggle)
                // if (res.data.onlineToggle) {
                // }
                // userGet()
            }
        } catch (error) {
            console.error(error)
        }
    }


    useEffect(() => {
        userGet()
    }, [focused])

    return (
        <View style={styles.container}>
            <NavBar rootProps={props} />
            <View style={styles.innerContainer}>
                <View style={styles.flexRow}>

                    <Text style={styles.mainHeading}>My Account</Text>
                    {roleName == "TEACHER" &&

                        <View style={styles.flexRow}>
                            <Text style={styles.onlineText}>Online</Text>
                            <Switch color={colorObj.primarColor} value={isSwitchOn} onValueChange={() => handleToggle()} />
                        </View>
                    }
                </View>
                <Pressable onPress={() => props.navigation.navigate('Learnings')}>

                    <Text style={styles.subHeading}>My Courses</Text>
                </Pressable>

                <Pressable onPress={() => props.navigation.navigate('ShoppingCart')}>

                    <Text style={styles.subHeading}>My Cart</Text>
                </Pressable>
                <Pressable onPress={() => props.navigation.navigate('wishlist')}>

                    <Text style={styles.subHeading}>My Wishlist</Text>
                </Pressable>

                <Pressable onPress={() => props.navigation.navigate('Orders')}>

                    <Text style={styles.subHeading}>My Orders</Text>
                </Pressable>
                {roleName == "TEACHER" &&
                    <>
                        <Pressable onPress={() => props.navigation.navigate('IncomingOrders')}>

                            <Text style={styles.subHeading}>Incoming Orders</Text>
                        </Pressable>
                    </>
                }
                <Pressable onPress={() => props.navigation.navigate('Enquiry')}>

                    <Text style={styles.subHeading}>My Enquires</Text>
                </Pressable>

                {/* <Text style={styles.subHeading}>My Teachers</Text> */}
                <Text style={styles.subHeading}>Feedbacks</Text>
                {
                    roleName == "USER" &&
                    <>
                        <Pressable onPress={()=>props.navigation.navigate('RegisterTeacher')}>

                            <Text style={[styles.subHeading, { fontFamily: 'RedHatText-SemiBold', color: "#085A4E" }]}>Become a Teacher</Text>
                        </Pressable>
                        
                        {/* <Text style={[styles.subHeading, { fontFamily: 'RedHatText-SemiBold', color: "#085A4E" }]}>Create Your Course</Text> */}
                    </>
                }
                <View style={styles.flexRow}>

                    <Text style={[styles.subHeading, { fontFamily: 'RedHatText-SemiBold', borderBottomWidth: 0, color: "#085A4E" }]}>Logout</Text>
                    <Icon name="log-out-outline" size={16} color={colorObj.primarColor} />
                </View>


            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FEFEFE',
        flex: 1,
    },
    innerContainer: {
        alignSelf: 'center',
        width: wp(90),
        height: hp(80),
        marginTop: 20
        // backgroundColor:'red'        

    },
    mainHeading: {
        fontFamily: 'RedHatText-SemiBold',
        fontSize: 20,
        color: '#27303E'
    },
    subHeading: {
        fontFamily: 'RedHatText-Regular',
        fontSize: 14,
        color: '#27303E',
        marginTop: 20,
        borderBottomColor: '#27303E',
        borderBottomWidth: 0.5,
        paddingBottom: 10

    },
    onlineText: {
        fontFamily: 'RedHatText-Regular',
        fontSize: 14,
        color: '#27303E',
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})