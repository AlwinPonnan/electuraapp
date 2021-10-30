import React, { useEffect, useContext, useRef, useState } from 'react'
import { View, Text, StyleSheet, Image, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj } from '../globals/colors';
import { imageObj } from '../globals/images';

import Icon from 'react-native-vector-icons/Ionicons'
import { CheckValidOtp, loginUser, SendOtp } from '../Services/User';
import EncryptedStorage from 'react-native-encrypted-storage';

import { AuthContext, loadingContext, roleContext } from '../navigators/stacks/RootStack';
import LoadingContainer from './LoadingContainer';
import OTPInputView from '@twotalltotems/react-native-otp-input'
export default function VerifyOtp(props) {
    
    const [isAuthorized, setIsAuthorized] = useContext(AuthContext);
    const [loading, setLoading] = useContext(loadingContext);

    const [roleName, setRoleName] = useContext(roleContext);
    const [val1, setVal1] = useState("");
    const [val2, setVal2] = useState("");
    const [val3, setVal3] = useState("");
    const [val4, setVal4] = useState("");
    const [val5, setVal5] = useState("");
    const [val6, setVal6] = useState("");

    const input1 = useRef();
    const input2 = useRef();
    const input3 = useRef();
    const input4 = useRef();
    const input5 = useRef();
    const input6 = useRef();

    const [otpCode, setOtpCode] = useState();

    const handleOtpSubmit = async () => {
        try {
            setLoading(true)
            let obj = {
                phone: props.route.params.data
            }
            let otp = `${otpCode}`
            console.log(otp)
            let sessionId = await EncryptedStorage.getItem("sessionIdOtp");
            console.log(sessionId)
            const { data: resOtpVerify } = await CheckValidOtp(sessionId, otp)
            if (resOtpVerify.Status == "Success") {
                const { data: res } = await loginUser(obj);
                if (res) {
                    await EncryptedStorage.setItem('AUTH_TOKEN', res.data);
                    await EncryptedStorage.setItem('AUTH_REFRESH_TOKEN', res.refreshToken);
                    await EncryptedStorage.removeItem("sessionIdOtp");
                    setLoading(false)
                    setIsAuthorized(true)
                    setRoleName(res.data.role)
                }
            }
        }
        catch (error) {
            setLoading(false)
            alert("Invalid OTP")
            console.error(JSON.stringify(error, null, 2), "error in Otp verification")
        }
    }


    const handleResendOtp = async () => {
        setLoading(true)
        try {
            const { data: res } = await SendOtp(props.route.params.data)
            if (res.Status) {
                alert(`OTP sent successfully on ${props.route.params.data} , Do not share Otp with anyone.`)
                await EncryptedStorage.setItem("sessionIdOtp", res.Details)
            }
        } catch (error) {
            console.error(error)
            alert("Unable to send otp")
        }
        setLoading(false)
    }


    return (
        <ScrollView contentContainerStyle={styles.container}>
            {
                loading
                    ?
                    <LoadingContainer />
                    :
                    <>
                        <View style={styles.topContainer}>
                            <Image source={imageObj.verifyOtpImage} />
                        </View>
                        <KeyboardAvoidingView style={styles.bottomContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                            <View style={styles.textContainer}>
                                <Text style={styles.labelHeading}>Verify your number</Text>
                                <Text style={styles.labelSubHeading}>Enter the OTP sent to +91-{props.route.params.data}</Text>
                            </View>
                            <View style={styles.inputContainer}>

                                <OTPInputView
                                    style={{ width: '70%', height: 70, }}
                                    pinCount={6}
                                    placeholderCharacter="*"
                                    // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                                    onCodeChanged={code => setOtpCode(code)}
                                    autoFocusOnLoad
                                    selectionColor="black"
                                    editable={true}
                                    keyboardType="number-pad"

                                    codeInputFieldStyle={styles.underlineStyleBase}
                                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                                    onCodeFilled={(code) => {
                                        console.log(`Code is ${code}, you are good to go!`)
                                    }}
                                />

                            </View>
                            <Pressable onPress={() => handleResendOtp()}>
                                <Text style={[styles.resendOtp]}> Resend OTP</Text>
                            </Pressable>

                            <View >
                                <Pressable style={styles.btn} onPress={() => handleOtpSubmit()}>
                                    <Text style={styles.btnText}>Verify</Text>
                                </Pressable>
                            </View>
                            <View style={styles.btnContainer}>
                                <Text style={styles.termsText}>Already have an account ?<Text style={{ color: colorObj.primarColor }}> LogIn</Text></Text>

                            </View>
                        </KeyboardAvoidingView>
                    </>

            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colorObj.whiteColor
    },
    topContainer: {
        width: wp(100),
        alignItems: 'center',
        // marginTop:hp(8),
        height: hp(40),
        justifyContent: 'center'
    },
    bottomContainer: {
        width: wp(100),
        height: hp(60),
        // flex:1
    },
    textContainer: {
        padding: 20,
    },
    labelHeading: {
        fontFamily: 'Montserrat-SemiBold',
        marginVertical: 5,
        fontSize: 32,
        color: '#333333',
        textAlign: 'center',
    },
    labelSubHeading: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#828282',
        marginTop: 2,
        textAlign: 'center',
    },
    inputContainer: {
        width: wp(90),
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'transparent',
        marginVertical: 10,
        // backgroundColor:'red'
    },
    inputStyles: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        textAlign: "center",
        color: "black",
        marginVertical: 10,
        marginHorizontal: 10
    },
    btn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 61,
        width: wp(80),
        paddingVertical: 15,
        alignSelf: 'center',
        marginVertical: 10

    },
    btnText: {
        fontFamily: 'Montserrat-SemiBold',
        color: colorObj.whiteColor,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 20
    },
    termsText: {
        fontSize: 17,
        color: '#828282',
        fontFamily: 'Montserrat-Regular',
        marginVertical: 10,
        textAlign: 'center'
    },
    resendOtp: {
        fontSize: 17,
        color: '#828282',
        fontFamily: 'Montserrat-Regular',
        marginVertical: 10,
        textAlign: 'right',
        width: wp(85),
        // backgroundColor:'red'
    },
    btnContainer: {
        width: wp(90),
        paddingHorizontal: 20,
        // position: 'absolute',
        // bottom: 50,
        // backgroundColor:'red',
        // left: 20
    },

    borderStyleBase: {
        width: 30,
        height: 45,
        backgroundColor: 'black'
    },

    borderStyleHighLighted: {
        borderColor: "black",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        color: 'black',
        fontFamily: 'Montserrat-Regular'
    },

    underlineStyleHighLighted: {
        borderColor: "black",
    },
})

