import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Appearance } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from "react-native-vector-icons/Ionicons"
import { dark_colors, light_colors } from '../globals/colors';
export default function AccountScreen(props) {
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>

                <View style={[styles.flexRow, { justifyContent: "space-between" }]}>
                    <View style={styles.profileImageContainer}>
                        <Image style={styles.profileImage} source={require("../assets/images/user.jpg")} />
                    </View>

                    <View style={styles.joinedContainer}>
                        <View style={styles.flexColumn}>
                            <Text style={styles.greyTxt}>Joined</Text>
                            <View style={[styles.flexRow, { alignItems: "center" }]}>
                                <Text style={styles.largetxt}>6</Text>
                                <Text style={styles.smallTxt}>Months Ago</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <Text style={styles.userFirstName}>John</Text>
                <Text style={styles.userSecondName}>Emanuel</Text>


                <View style={[styles.itemContainer, { marginTop: hp(5) }]}>
                    <View style={[styles.itemIconContainer, { backgroundColor: "rgba(74, 152, 255,0.2)" }]}>
                        <Icon name="mail-outline" size={20} color="rgba(74, 152, 255,1)" />
                    </View>
                    <View style={styles.flexColumn}>
                        <Text style={styles.ItemName}>Email</Text>
                        <Text style={styles.ItemValue}>electura@electura.com</Text>
                    </View>

                </View>
                <View style={styles.itemContainer}>
                    <View style={[styles.itemIconContainer, { backgroundColor: "rgba(255, 158, 74,0.2)" }]}>
                        <Icon name="call-outline" size={20} color="rgba(255, 158, 74,1)" />
                    </View>
                    <View style={styles.flexColumn}>
                        <Text style={styles.ItemName}>Mobile Number</Text>
                        <Text style={styles.ItemValue}>9919291919</Text>
                    </View>

                </View>
                <View style={styles.itemContainer}>
                    <View style={[styles.itemIconContainer, { backgroundColor: "rgba(38, 131, 181,0.2)" }]}>
                        <Icon name="call-outline" size={20} color="rgba(38, 131, 181,1)" />
                    </View>
                    <View style={styles.flexColumn}>
                        <Text style={styles.ItemName}>Your Courses</Text>
                        <Text style={styles.ItemValue}>20</Text>
                    </View>

                </View>


                <TouchableOpacity style={styles.becomeATeacherBtn} onPress={() => props.navigation.navigate("AccountEdit")}>
                    <Icon name="person-outline" size={25} color={light_colors.primary} />
                    <Text style={styles.btnTxt}>become a teacher</Text>
                </TouchableOpacity>

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
        marginVertical: 20,
        alignItems: "center"
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
        fontFamily: 'OpenSans-Bold',
        color: "black",
        fontSize: 35,
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
        color: "black",
        fontSize: 20,
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
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
})
