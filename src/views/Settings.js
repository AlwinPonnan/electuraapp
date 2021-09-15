import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Appearance } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from "react-native-vector-icons/Ionicons"




///////context
import { isAuthorisedContext } from '../navigators/stacks/RootStack';



import { dark_colors, light_colors } from '../globals/colors';
import { removeToken } from '../Services/User';
export default function Settings(props) {

    const [isAuth, setIsAuth] = useContext(isAuthorisedContext);

    const focused = useIsFocused();




    const logout = async () => {
        try {
            await removeToken()
            setIsAuth(false)
        }
        catch (err) {

        }
    }



    useEffect(() => {
        if (focused) {
        }
    }, [focused])

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>

                <Text style={styles.userFirstName}>General Settings</Text>


                <View style={[styles.itemContainer, { marginTop: hp(5) }]}>
                    <View style={[styles.itemIconContainer, { backgroundColor: "rgba(74, 152, 255,0.2)" }]}>
                        <Icon name="ios-notifications-outline" size={20} color="rgba(74, 152, 255,1)" />
                    </View>
                    <View style={styles.flexRowBetween}>
                        <Text style={styles.ItemName}>Notification</Text>
                        <Icon name="chevron-forward-outline" size={20} color="rgba(0, 0, 0,0.5)" />
                    </View>
                </View>

                <Pressable onPress={() => props.navigation.navigate("Wallet")} style={styles.itemContainer}>
                    <View style={[styles.itemIconContainer, { backgroundColor: "rgba(255, 158, 74,0.2)" }]}>
                        <Icon name="wallet-outline" size={20} color="rgba(255, 158, 74,1)" />
                    </View>
                    <View style={styles.flexRowBetween}>
                        <Text style={styles.ItemName}>Your Wallet</Text>
                        <Icon name="chevron-forward-outline" size={20} color="rgba(0, 0, 0,0.5)" />
                    </View>
                </Pressable>

                <View style={styles.itemContainer}>
                    <View style={[styles.itemIconContainer, { backgroundColor: "rgba(38, 131, 181,0.2)" }]}>
                        <Icon name="call-outline" size={20} color="rgba(38, 131, 181,1)" />
                    </View>
                    <View style={styles.flexRowBetween}>
                        <Text style={styles.ItemName}>Your Courses</Text>
                        <Icon name="chevron-forward-outline" size={20} color="rgba(0, 0, 0,0.5)" />
                    </View>
                </View>

                <View style={styles.itemContainer}>
                    <View style={[styles.itemIconContainer, { backgroundColor: "rgba(237, 64, 133,0.2)" }]}>
                        <Icon name="md-list-outline" size={20} color="rgba(237, 64, 133,1)" />
                    </View>
                    <View style={styles.flexRowBetween}>
                        <Text style={styles.ItemName}>Your Queries</Text>
                        <Icon name="chevron-forward-outline" size={20} color="rgba(0, 0, 0,0.5)" />
                    </View>
                </View>



                <Text style={styles.userFirstName}>Account Settings</Text>

                <Pressable onPress={() => logout()} style={styles.itemContainer}>
                    <View style={[styles.itemIconContainer, { backgroundColor: "rgba(180, 46, 217,0.2)" }]}>
                        <Icon name="ios-trail-sign-outline" size={20} color="rgba(180, 46, 217,1)" />
                    </View>
                    <View style={styles.flexRowBetween}>
                        <Text style={styles.ItemName}>Logout</Text>
                        <Icon name="chevron-forward-outline" size={20} color="rgba(0, 0, 0,0.5)" />
                    </View>
                </Pressable>

            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        display: "flex",
        height: hp(85),
        backgroundColor: "white"
    },
    innerContainer: {
        width: wp(80),
        display: "flex",
        justifyContent: "center",
        paddingTop: 30,
        alignSelf: "center",
    },
    profileImageContainer: {
        height: 130,
        width: 130,
        borderRadius: 150,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: Appearance.getColorScheme() == 'dark' ? dark_colors.primary : light_colors.primary,
    },
    joinedContainer: {
        borderLeftColor: "rgba(0,0,0,0.2)",
        borderLeftWidth: 1,
        width: "40%",
        paddingLeft: "10%",
        paddingTop: 30,
    },
    itemContainer: {
        display: "flex",
        flexDirection: "row",
        // marginVertical: 20,
        paddingVertical: 10,
        alignItems: "center",
        borderTopColor: "rgba(0,0,0,0.05)",
        borderTopWidth: 1,
    },
    itemIconContainer: {
        height: 35,
        width: 35,
        borderRadius: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15
    },





    ///////txt
    greyTxt: {
        fontFamily: 'OpenSans-Regular',
        color: "grey",
        fontSize: 15,
        textTransform: "capitalize",

    },
    largetxt: {
        fontFamily: 'OpenSans-Bold',
        color: "black",
        fontSize: 40,
        textTransform: "capitalize",
    },
    smallTxt: {
        fontFamily: 'OpenSans-Regular',
        color: "black",
        fontSize: 13,
        paddingLeft: 5,
        paddingTop: 15,
        textTransform: "capitalize",
    },
    userFirstName: {
        fontFamily: 'OpenSans-SemiBold',
        color: "black",
        fontSize: 20,
        paddingLeft: 5,
        paddingTop: 15,
        textTransform: "capitalize",
    },
    userSecondName: {
        fontFamily: 'OpenSans-Light',
        color: "grey",
        fontSize: 35,
        paddingLeft: 5,
        // paddingTop: 15,
        textTransform: "capitalize",
    },
    ItemName: {
        fontFamily: 'OpenSans-SemiBold',
        color: "rgba(0,0,0,0.5)",
        fontSize: 17,
        paddingLeft: 5,
        textTransform: "capitalize",
    },
    ItemValue: {
        fontFamily: 'OpenSans-Regular',
        color: "black",
        fontSize: 15,
        color: "grey",
        paddingLeft: 5,
        // paddingTop: 15,
        textTransform: "capitalize",
    },
    btnTxt: {
        fontFamily: 'OpenSans-Regular',
        color: "black",
        fontSize: 15,
        color: "grey",
        paddingLeft: 5,
        // paddingTop: 15,
        textTransform: "capitalize",
    },

    ////image
    profileImage: {
        height: "95%",
        width: "95%",
        borderRadius: 150,
    },




    //////btn
    becomeATeacherBtn: {
        backgroundColor: "#F6F5F8",
        width: wp(50),
        marginTop: hp(2),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        height: 45,
        borderRadius: 10
    },

    //////flex
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexRowBetween: {
        display: "flex",
        flexDirection: "row",
        width: "90%",
        justifyContent: "space-between"
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
})
