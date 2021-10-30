import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { colorObj } from '../globals/colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from '../components/Navbar';
export default function Notification(props) {
    return (
        <>
            <View style={styles.container}>

                <NavBar rootProps={props} />

                <Text style={styles.heading}>Notification</Text>





                <View style={styles.notiCard}>
                    <Text style={styles.cardHeading}>Couse Purchased successfully !</Text>
                    <Text style={styles.cardData}>See the message and go to the your deshboard</Text>
                    <Text style={styles.cardTime}>08:20 am</Text>

                </View>
                <View style={styles.notiCard}>
                    <Text style={styles.cardHeading}>Couse Purchased successfully !</Text>
                    <Text style={styles.cardData}>See the message and go to the your deshboard</Text>
                    <Text style={styles.cardTime}>08:20 am</Text>

                </View>
                <View style={styles.notiCard}>
                    <Text style={styles.cardHeading}>Couse Purchased successfully !</Text>
                    <Text style={styles.cardData}>See the message and go to the your deshboard</Text>
                    <Text style={styles.cardTime}>08:20 am</Text>

                </View>
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
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
    cardHeading: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 16,
        color: colorObj.primarColor,
        lineHeight: 20,
        marginTop: 8,
        marginBottom: 8,
    },
    cardData: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: "rgba(0,0,0,0.3)",
        marginTop: 8,
        marginBottom: 8,
    },

    cardTime: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 11,
        display: "flex",
        alignSelf: "flex-end",
        color: "rgba(0,0,0,0.3)",
        // marginTop: 8,
        // marginBottom: 8,
    },

    btnTxt: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 13,
        color: "white",
        // marginTop: 15
    },

    heading: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 20,
        marginTop: 15,
        textAlign: "center",
        display: "flex",
        alignSelf: "center",
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
    notiCard: {
        width: wp(90),
        borderColor: colorObj.primarColor,
        borderWidth: 1,
        marginVertical: 10,
        display: "flex",
        alignSelf: "center",
        borderRadius: 10,
        padding: 15,
    },
})