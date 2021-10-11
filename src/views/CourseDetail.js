import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj, light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import NavBar from '../components/Navbar';
export default function CourseDetail(props) {
    return (
        <View style={styles.container}>
            <NavBar rootProps={props} />
            <View style={styles.innerContainer}>

                <View style={[styles.flexRow, { alignItems: "center", justifyContent: "space-between", }]}>
                    <View style={[styles.flexRow]} >
                        <Text style={styles.pageHeading}>The Art of Film Making</Text>
                        <View style={[styles.flexRow, { alignItems: "center" }]}>
                            <Text style={styles.ratingTxt}>4.2</Text>
                            <Icon name="star" size={10} color="rgba(8, 90, 78, 1)" />
                        </View>
                    </View>
                    <Icon name="heart-outline" size={20} color="rgba(8, 90, 78, 1)" />
                </View>
                <View style={[styles.flexRow, { alignItems: "center", marginTop: 5 }]}>
                    <Image source={require("../../assets//images/user.jpg")} style={styles.img} />
                    <Text style={styles.userName}>Dave O’sean</Text>
                </View>

                <Image source={require("../../assets//images/Banner1.png")} resizeMode="cover" style={styles.bannerimg} />


                <View style={[styles.flexRow, { marginVertical: 15 }]}>
                    <Text style={styles.dataItem}>16 Enrollments</Text>
                    <Text style={styles.dataItem}>8 Hours</Text>
                    <Text style={styles.dataItem}>4 Assignments</Text>
                </View>
                <Text style={styles.description}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla netus molestie cras malesuada malesuada nisi, mauris. Nibh pulvinar elit enim varius donec.
                </Text>
            </View>
            <Pressable style={styles.btn} onPress={() => props.navigation.navigate('OtpScreen')}>
                <Text style={styles.btnText}>Buy Now</Text>
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FEFEFE',
        flex: 1,
    },
    innerContainer: {
        width: wp(95),
        alignSelf: "center",
        display: "flex",
        marginTop: 15,
        flexDirection: "column",
        justifyContent: "center",
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
    pageHeading: {
        fontFamily: 'Montserrat-SemiBold', fontSize: 18, color: '#000000', marginRight: 10
    },
    ratingTxt: {
        color: "rgba(8, 90, 78, 1)",
        fontFamily: 'Montserrat-Regular',
        marginRight: 5,
        fontSize: 12
    },
    img: {
        height: 30,
        width: 30,
        borderRadius: 8,
        marginRight: 10
    },
    bannerimg: {
        display: "flex",
        alignSelf: "center",
        marginLeft: wp(5)
    },
    userName: {
        fontFamily: 'Montserrat-Regular', fontSize: 14, color: '#000000',

    },
    dataItem: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 13,
        color: 'grey',
        marginRight: 20,
        marginLeft: 7
    },
    btn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 61,
        width: wp(80),
        alignSelf: "center",
        display: "flex",
        marginTop: 100,
        position: "absolute",
        bottom: 30,
        paddingVertical: 15
    },
    btnText: {
        fontFamily: 'Montserrat-SemiBold',
        color: colorObj.whiteColor,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 20
    },
    description: { fontFamily: 'Montserrat-Regular', fontSize: 14, color: 'rgba(0,0,0,0.6)', paddingHorizontal: 8 },
})