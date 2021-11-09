import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj, light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import NavBar from '../components/Navbar';
import { Switch } from 'react-native-paper';
export default function Profile(props) {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);

    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    return (
        <View style={styles.container}>
            <NavBar rootProps={props} />
            <View style={styles.innerContainer}>
                <View style={styles.flexRow}>

                    <Text style={styles.mainHeading}>My Account</Text>
                    <View style={styles.flexRow}>
                        <Text style={styles.onlineText}>Online</Text>
                        <Switch color={colorObj.primarColor} value={isSwitchOn} onValueChange={onToggleSwitch} />
                    </View>
                </View>
                <Text style={styles.subHeading}>My Courses</Text>
                <Text style={styles.subHeading}>My Enquires</Text>

                <Text style={styles.subHeading}>My Teachers</Text>
                <Text style={styles.subHeading}>Feedbacks</Text>
                <Text style={[styles.subHeading, { fontFamily: 'RedHatText-SemiBold', color: "#085A4E" }]}>Become a Teacher</Text>

                <Text style={[styles.subHeading, { fontFamily: 'RedHatText-SemiBold', color: "#085A4E" }]}>Create Your Course</Text>
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
    onlineText:{
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