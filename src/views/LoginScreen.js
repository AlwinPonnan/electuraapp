import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, TextInput, Pressable, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj } from '../globals/colors';
import { imageObj } from '../globals/images';

import Icon from 'react-native-vector-icons/Ionicons'

import { SendOtp } from '../Services/User';
import { checkValidPhone } from '../globals/utils';
import { loadingContext } from '../navigators/stacks/RootStack';
import LoadingContainer from './LoadingContainer';
import EncryptedStorage from 'react-native-encrypted-storage';



export default function login(props) {
    const [loading, setLoading] = useContext(loadingContext);
    const [phone, setPhone] = useState('');

    const handleOtpSend = async () => {
        try {
            if (checkValidPhone(phone)) {
                setLoading(true)
                const { data: res } = await SendOtp(phone)
                if (res.Status) {
                    alert(`OTP sent successfully on ${phone} , Do not share Otp with anyone.`)
                    setLoading(false)
                    console.log(res.Details, "detailss")
                    await EncryptedStorage.setItem("sessionIdOtp", res.Details)
                    props.navigation.navigate('OtpScreen', { data: phone })
                }
            }
            else {
                alert("Enter valid phone number")
            }
        } catch (error) {
            console.error(error)
            setLoading(false)
            alert("Unable to send otp")
        }
    }
    return (
        <View style={styles.container}>
            {
                loading
                    ?
                    <LoadingContainer />
                    :
                    <ScrollView contentContainerStyle={styles.innerContainer}>
                        <Image source={imageObj.loginImage} style={{ alignSelf: 'center', marginTop: 10 }} />
                        <View style={styles.textContainer}>
                            <Text style={styles.mainHeading}>Find The Best In Education</Text>
                            <Text style={styles.labelSubHeading}>Learn new profession from the comfort of your home or anywhere</Text>
                        </View>

                        <KeyboardAvoidingView style={styles.inputContainer}>
                            <Icon name="call-outline" size={14} color="black" />
                            <TextInput placeholderTextColor="black" maxLength={10} style={styles.inputStyles} onChangeText={(val) => setPhone(val)} keyboardType="numeric" placeholder="+91     Enter Number" />
                        </KeyboardAvoidingView>
                        <View style={styles.btnContainer}>
                            <Text style={styles.termsText}>By Continuing you accept the <Text style={{ color: colorObj.primarColor }}>terms and conditions</Text></Text>
                            <Pressable style={styles.btn} onPress={() => handleOtpSend()}>
                                <Text style={styles.btnText}>Send Otp</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
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
        position: 'absolute',
        bottom: 50,
        // backgroundColor:'red',
        left: 20
    }
})
