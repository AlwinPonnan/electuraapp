import React, { useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, TextInput, Pressable } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj } from '../globals/colors';
import { imageObj } from '../globals/images';

import Icon from 'react-native-vector-icons/Ionicons'
import { loginUser } from '../Services/User';
import EncryptedStorage from 'react-native-encrypted-storage';

import { AuthContext } from '../navigators/stacks/RootStack';
export default function VerifyOtp(props) {
    const [isAuthorized, setIsAuthorized] = useContext(AuthContext);

    const handleOtpSubmit = async () => {
        try {
            console.log("hello")
            let obj = {
                phone: props.route.params.phone
            }
            const { data: res } = await loginUser(obj);
            if (res.success) {
                await EncryptedStorage.setItem('AUTH_TOKEN', res.data)
                await EncryptedStorage.setItem('AUTH_REFRESH_TOKEN', res.refreshToken)
                setIsAuthorized(true)
            }
        } catch (error) {
            console.error(error, "error")
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Image source={imageObj.verifyOtpImage} />
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.labelHeading}>Verify your number</Text>
                    <Text style={styles.labelSubHeading}>OTP will be sent on this number</Text>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.inputStyles} maxLength={1} keyboardType="numeric" />
                    <TextInput style={styles.inputStyles} maxLength={1} keyboardType="numeric" />
                    <TextInput style={styles.inputStyles} maxLength={1} keyboardType="numeric" />
                    <TextInput style={styles.inputStyles} maxLength={1} keyboardType="numeric" />
                    <TextInput style={styles.inputStyles} maxLength={1} keyboardType="numeric" />
                    <TextInput style={styles.inputStyles} maxLength={1} keyboardType="numeric" />



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

