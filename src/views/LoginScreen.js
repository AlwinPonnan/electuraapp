import React, { useState, useEffect, useContext, useRef } from 'react'
import { View, Text, StyleSheet, Image, TextInput, Pressable, KeyboardAvoidingView, ScrollView, ActivityIndicator,Linking } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj } from '../globals/colors';
import { imageObj } from '../globals/images';

import Icon from 'react-native-vector-icons/Ionicons'

import { SendOtp } from '../Services/User';
import { checkValidPhone } from '../globals/utils';
import { loadingContext } from '../navigators/stacks/RootStack';
import LoadingContainer from './LoadingContainer';
import EncryptedStorage from 'react-native-encrypted-storage';
import { successAlertContext } from '../../App';



export default function login(props) {
    const [loading, setLoading] = useContext(loadingContext);
    const [phone, setPhone] = useState('');

    const phoneRef = useRef(null);
    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr

    const LinkingPrivacy=()=>{
        Linking.openURL("https://www.electura.co/privacy_policy")
    }
    const handleOtpSend = async () => {
        try {
            if (checkValidPhone(phone)) {
                setLoading(true)
                const { data: res } = await SendOtp(phone)
                if (res.Status) {
                    setLoading(false)
                    setAlertText(`OTP sent successfully on ${phone} , Do not share Otp with anyone.`)
                    setSuccessAlert(true)
                    await EncryptedStorage.setItem("sessionIdOtp", res.Details)
                    props.navigation.navigate('OtpScreen', { data: phone })
                }
            }
            else {
                setWarningAlert(true)
                setAlertText("Enter valid phone number")
            }
        } catch (error) {
            console.error(error)
            setLoading(false)
            setErrorAlert(true)
            setAlertText("Unable To Send Otp")

        }
    }
    return (

            <ScrollView contentContainerStyle={styles.innerContainer}>
                <View style={[styles.flexRow,{alignItems:'center',justifyContent:'space-between',width:wp(96),paddingHorizontal:10}]}>
                    <Image source={imageObj.loginLogo} style={{width:100,height:100}} resizeMode='contain' />
                    <Image source={imageObj.loginSideText} style={{width:50,height:50}} resizeMode='contain' />

                </View>
                <Image source={imageObj.loginImage} style={{ alignSelf: 'center', marginTop: 10 }} />
                <View style={styles.textContainer}>
                    <Text style={styles.mainHeading}>Find The Best In Education</Text>
                    <Text style={styles.labelSubHeading}>Discover teacher and courses. Learn wherever you are.</Text>
                </View>

                <KeyboardAvoidingView style={styles.inputContainer}>
                    <Icon name="call-outline" size={14} color="black" />
                    <Pressable onPress={() => phoneRef.current.focus()}>
                        <Text style={{ marginLeft: 10 }}>+91</Text>
                    </Pressable>
                    <TextInput placeholderTextColor="black" ref={phoneRef} maxLength={10} style={styles.inputStyles} onChangeText={(val) => setPhone(val)} keyboardType="numeric" placeholder="Enter Number" />
                </KeyboardAvoidingView>
                <View style={styles.btnContainer}>
                    <Pressable onPress={()=>LinkingPrivacy()}><Text style={styles.termsText}>By Continuing you accept the <Text style={{ color: colorObj.primarColor }}>terms and conditions</Text></Text></Pressable>
                    <Pressable style={styles.btn} onPress={() => handleOtpSend()}>
                        <Text style={styles.btnText}>Send Otp</Text>
                    </Pressable>
                </View>
            </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    flexRow:{
        display:'flex',
        flexDirection:'row'
    },
    innerContainer: {
        minHeight: hp(100),
        minWidth: wp(100),
        paddingBottom:100,
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
        position:"relative",
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        paddingHorizontal: 20,
        elevation: 3,
        marginTop: 10,
        borderColor: 'transparent',
        backgroundColor: colorObj.whiteColor
    },
    inputStyles: {
        fontFamily: 'Montserrat-Regular',
        width: '100%',
        color: "black",
        // flex:1,
        paddingLeft: 10,
    },
    btn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 61,
        width: wp(80),
        marginTop:10,
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
        // position: 'relative',
        // bottom: 50,
        // backgroundColor:'red',
        left: 20
    }
})
