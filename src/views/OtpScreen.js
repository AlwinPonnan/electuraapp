import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, Appearance, Pressable, Image, ScrollView, TextInput } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { Headline, Button, Text, Subheading, Checkbox } from 'react-native-paper'
import { dark_colors, light_colors } from '../globals/colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/core';
export default function OtpScreen(props) {
    const [phone, setphone] = useState("");

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ padding: 15 }}
            >
                <View style={styles.imgContainer}>
                    <Image source={require('../../assets/Logo.png')} style={styles.img} resizeMode="contain" />
                    <Image source={require("../../assets/20944201.jpg")} style={{ width: wp(80), height: hp(30), }} />
                </View>

                <Text style={styles.label}>
                    Your OTP
                </Text>
                <View style={styles.flexRow}>

                    <TextInput onChangeText={setphone} keyboardType={"number-pad"} maxLength={6} placeholder="Enter OTP" style={styles.textInput} />

                </View>

                <Pressable style={styles.btn} onPress={() => props.navigation.navigate('MainBottomTab')}>
                    <Text style={styles.btnTxt}>Submit OTP</Text>
                </Pressable>

            </ScrollView>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: '100%',
        backgroundColor: Appearance.getColorScheme() == 'dark' ? dark_colors.backgroundColor : light_colors.backgroundColor,
        display: 'flex',
    },
    headerText: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 24,
        textAlign: 'center',
        color: Appearance.getColorScheme() == 'dark' ? dark_colors.textColor : light_colors.textColor,
        fontFamily: 'OpenSans-Bold',
    },
    textInput: {
        borderColor: "rgba(0,0,0,0.02)",
        borderWidth: 2,
        borderRadius: 7,
        paddingLeft: 20,
        backgroundColor: "#F1F3FD",
        marginVertical: 8
    },
    label: {
        fontFamily: 'OpenSans-SemiBold',
        color: "black",
        fontSize: 14,
        marginBottom: 8,
        color: "grey",
        paddingLeft: 5,
        marginTop: 15,
    },
    btn: {
        backgroundColor: "#363D4D",
        borderRadius: 8,
        width: wp(92),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 30,
        paddingVertical: 10,
    },

    btnTxt: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: "grey",
        paddingLeft: 5,
        color: "white"
    },
    img: {
        width: '80%',
        height: 120
    },
    imgContainer: {
        width: '100%',
        // maxHeight: 150,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginTop: 33
    },

})