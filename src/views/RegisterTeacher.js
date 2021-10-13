import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, Image, TextInput, Pressable, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj } from '../globals/colors';
import { imageObj } from '../globals/images';

import Icon from 'react-native-vector-icons/Ionicons'

import { SendOtp } from '../Services/User';
import { checkValidPhone } from '../globals/utils';
import NavBar from '../components/Navbar'

export default function RegisterTeacher(props) {
    const [qualificationArr, setQualificationArr] = useState([]);
    const [phone, setPhone] = useState();




    return (

        <View style={styles.container}>
            <NavBar rootProps={props} />
            <View style={styles.innerContainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                        <Image source={imageObj.loginImage} style={{ alignSelf: 'center', marginTop: 10, height: hp(30), width: wp(80) }} />
                        <View style={styles.textContainer}>
                            <Text style={styles.mainHeading}>Become a Teacher</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <Icon name="person-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setPhone(val)} keyboardType="numeric" placeholder="Enter your Name" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="mail-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setPhone(val)} keyboardType="email-address" placeholder="Enter your Email" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="call-outline" size={14} color="black" />
                            <TextInput maxLength={10} style={styles.inputStyles} onChangeText={(val) => setPhone(val)} keyboardType="numeric" placeholder="+91     Enter Number" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="home-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setPhone(val)} placeholder="Enter Address" multiline={true} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="library-outline" size={14} color="black" />
                            <TextInput multiline={true} style={styles.inputStyles} onChangeText={(val) => setPhone(val)} placeholder="Enter your Qualification" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="file-tray-full-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setPhone(val)} placeholder="Enter Subject" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="desktop-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setPhone(val)} keyboardType="numeric" placeholder="Enter Class" />
                        </View>

                        <View style={[styles.inputContainer, { minHeight: 80 }]}>
                            <Icon name="chatbox-ellipses-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setPhone(val)} placeholder="Enter Description" multiline={true} />
                        </View>



                        <View style={styles.btnContainer}>
                            <Text style={styles.termsText}>By Continuing you accept the <Text style={{ color: colorObj.primarColor }}>terms and conditions</Text></Text>
                            <Pressable style={styles.btn} onPress={() => handleOtpSend()}>
                                <Text style={styles.btnText}>Become A Teacher</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // display: 'flex',
        // flexDirection: 'column',
    },

    innerContainer: {
        minHeight: hp(100),
        minWidth: wp(100),
        backgroundColor: colorObj.whiteColor
    },
    textContainer: {
        padding: 20,
    },

    mainHeading: {
        fontFamily: 'Montserrat-Bold',
        // lineHeight: 21,
        marginVertical: 5,
        fontSize: 30,
        color: colorObj.primarColor
    },
    labelSubHeading: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#828282',
        lineHeight: 15,
        marginTop: 2
    },
    inputContainer: {
        width: wp(90),
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        paddingHorizontal: 20,
        elevation: 3,
        marginTop: 20,
        borderColor: 'transparent',
        backgroundColor: colorObj.whiteColor
    },
    inputStyles: {
        fontFamily: 'Montserrat-Regular',
        width: '100%',
        paddingLeft: 10,
    },
    btn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 61,
        width: wp(80),
        paddingVertical: 15
    },
    btnText: {
        fontFamily: 'Montserrat-SemiBold',
        color: colorObj.whiteColor,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 20
    },
    termsText: {
        fontSize: 12,
        color: '#828282',
        fontFamily: 'Montserrat-Regular',
        marginVertical: 10,
        textAlign: 'center'
    },
    btnContainer: {
        width: wp(90),
        paddingHorizontal: 20,
        // position: 'absolute',
        // bottom: 50,
        // backgroundColor:'red',
        left: 20
    }
})
