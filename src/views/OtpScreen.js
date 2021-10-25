import React, { useEffect, useContext, useRef, useState } from 'react'
import { View, Text, StyleSheet, Image, TextInput, Pressable } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj } from '../globals/colors';
import { imageObj } from '../globals/images';

import Icon from 'react-native-vector-icons/Ionicons'
import { CheckValidOtp, loginUser } from '../Services/User';
import EncryptedStorage from 'react-native-encrypted-storage';

import { AuthContext, loadingContext, roleContext } from '../navigators/stacks/RootStack';
import LoadingContainer from './LoadingContainer';
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


    const handleOtpSubmit = async () => {
        try {
            setLoading(true)
            let obj = {
                phone: props.route.params.data
            }
            let otp = `${val1}${val2}${val3}${val4}${val5}${val6}`
            let sessionId = await EncryptedStorage.getItem("sessionIdOtp");
            const { data: resOtpVerify } = await CheckValidOtp(sessionId, otp)
            if (resOtpVerify.Status == "Success") {
                alert(`${resOtpVerify.Details} Successfully`)
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


    return (
        <View style={styles.container}>
            {
                loading
                    ?
                    <LoadingContainer />
                    :
                    <>
                        <View style={styles.topContainer}>
                            <Image source={imageObj.verifyOtpImage} />
                        </View>
                        <View style={styles.bottomContainer}>
                            <View style={styles.textContainer}>
                                <Text style={styles.labelHeading}>Verify your number</Text>
                                <Text style={styles.labelSubHeading}>OTP will be sent on this number</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholderTextColor="black"
                                    placeholder="*"
                                    onChangeText={(val) => {
                                        if (val) {
                                            input2.current.focus()
                                        }
                                        setVal1(val)
                                    }}
                                    keyboardType="numeric"
                                    ref={input1} value={val1} style={styles.inputStyles} maxLength={1} keyboardType="numeric" />



                                <TextInput ref={input2}
                                    placeholderTextColor="black"
                                    placeholder="*"
                                    onChangeText={(val) => {
                                        if (val) {
                                            input3.current.focus()
                                        }
                                        else {
                                            input1.current.focus()
                                        }
                                        setVal2(val)
                                    }} value={val2} style={styles.inputStyles} maxLength={1} keyboardType="numeric" />


                                <TextInput
                                    placeholderTextColor="black"
                                    placeholder="*"
                                    onChangeText={(val) => {
                                        if (val) {
                                            input4.current.focus()
                                        }
                                        else
                                            input2.current.focus()
                                        setVal3(val)
                                    }}
                                    keyboardType="numeric"
                                    maxLength={1}


                                    ref={input3} value={val3} style={styles.inputStyles} maxLength={1} keyboardType="numeric" />
                                <TextInput
                                    placeholderTextColor="black"
                                    placeholder="*"
                                    onChangeText={(val) => {
                                        if (val) {
                                            input5.current.focus()
                                        }
                                        else
                                            input3.current.focus()
                                        setVal4(val)
                                    }}
                                    keyboardType="numeric"
                                    maxLength={1}


                                    ref={input4} value={val4} style={styles.inputStyles} maxLength={1} keyboardType="numeric" />
                                <TextInput
                                    placeholderTextColor="black"
                                    placeholder="*"
                                    onChangeText={(val) => {
                                        if (val) {
                                            input6.current.focus()
                                        }
                                        else
                                            input4.current.focus()
                                        setVal5(val)
                                    }}
                                    keyboardType="numeric"
                                    maxLength={1}

                                    ref={input5} value={val5} style={styles.inputStyles} maxLength={1} keyboardType="numeric" />
                                <TextInput
                                    placeholderTextColor="black"
                                    placeholder="*"
                                    onChangeText={(val) => {
                                        if (!val) {
                                            input5.current.focus()
                                        }
                                        setVal6(val)
                                    }}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    ref={input6} value={val6} style={styles.inputStyles} maxLength={1} keyboardType="numeric" />



                            </View>
                            <View >
                                <Pressable style={styles.btn} onPress={() => handleOtpSubmit()}>
                                    <Text style={styles.btnText}>Verify</Text>
                                </Pressable>
                            </View>
                            <View style={styles.btnContainer}>
                                <Text style={styles.termsText}>Already have an account ?<Text style={{ color: colorObj.primarColor }}> LogIn</Text></Text>

                            </View>
                        </View>
                    </>

            }
        </View>
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
        height: hp(60)
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
        marginVertical: 10
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
    btnContainer: {
        width: wp(90),
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 50,
        // backgroundColor:'red',
        left: 20
    }
})

