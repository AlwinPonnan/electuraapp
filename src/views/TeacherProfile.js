import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import NavBar from '../components/Navbar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { colorObj } from '../globals/colors';

export default function TeacherProfile(props) {
    return (
        <>
            <NavBar rootProps={props} />
            <Image source={require('../../assets/images/teacherBackBanner.png')} style={{ width: wp(100), height: hp(20) }} resizeMode="cover" />
            <View style={[styles.flexRow, { width: wp(90), alignSelf: "center" }]}>
                <Image source={require('../../assets/images/user.png')} style={{ width: 100, height: 100, position: "relative", top: -40, }} resizeMode="cover" />
                <View style={[styles.flexColumn, { marginLeft: 15, marginTop: -8 }]}>
                    <Text style={styles.TeacherName}>Annie Besant</Text>
                    <View style={[styles.flexRow, { marginTop: 3 }]}>
                        <Icon name="star" style={{ marginHorizontal: 3 }} size={15} color="orange" />
                        <Icon name="star" style={{ marginHorizontal: 3 }} size={15} color="orange" />
                        <Icon name="star" style={{ marginHorizontal: 3 }} size={15} color="orange" />
                        <Icon name="star" style={{ marginHorizontal: 3 }} size={15} color="orange" />
                        <Icon name="star" style={{ marginHorizontal: 3 }} size={15} color="orange" />
                    </View>
                </View>
                <Pressable style={styles.btn}>
                    <Text style={styles.btnTxt}>Nudge</Text>
                </Pressable>
            </View>
            <View style={[styles.flexRow, { width: wp(90), alignSelf: "center" }]}>
                <View style={[styles.flexRow, { width: "33%" }]}>
                    <Image source={require("../../assets/images/office.png")} />
                    <Text style={styles.smallTxt}>Mayo Clinic</Text>
                </View>
                <View style={[styles.flexRow, { width: "33%" }]}>
                    <Image source={require("../../assets/images/medal.png")} />
                    <Text style={styles.smallTxt}>MBBS, MD</Text>

                </View>
                <View style={[styles.flexRow, { width: "33%" }]}>
                    <Image source={require("../../assets/images/time.png")} />
                    <Text style={styles.smallTxt}>10 year experience</Text>
                </View>
            </View>


            <View style={[styles.flexColumn, { width: wp(90), alignSelf: "center", marginTop: 20, }]}>
                <Text style={styles.heading}>Expertise:</Text>
                <Text style={styles.description}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis ducimus quasi quis. Qui, neque fugit </Text>
                <Text style={styles.heading}>About:</Text>
                <Text style={styles.description}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis ducimus quasi quis. Qui, neque fugit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat quos dolore repudiandae nisi, perferendis sunt culpa provident! Dignissimos quos dolores tempora repellendus necessitatibus soluta, eligendi delectus cupiditate corporis exercitationem ipsa? </Text>
                <Text style={styles.heading}>Qualification:</Text>
                <Text style={styles.description}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis ducimus quasi quis.</Text>
                <Text style={styles.heading}>Experience:</Text>
                <Text style={styles.description}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis ducimus quasi quis.</Text>
            </View>


        </>
    )
}
const styles = StyleSheet.create({
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
    TeacherName: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
        color: colorObj.primarColor,
        marginTop: 15
    },
    smallTxt: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: "black",
        marginLeft: 5
    },
    description: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 13,
        color: "black",
        lineHeight: 20,
        marginTop: 8,
        marginBottom: 8,
    },
    btnTxt: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 13,
        color: "white",
        // marginTop: 15
    },

    heading: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        color: "black",
    },

    btn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 6,
        width: wp(20),
        height: 40,
        // paddingVertical: 10,
        marginVertical: 10,
        marginLeft: 40,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
})