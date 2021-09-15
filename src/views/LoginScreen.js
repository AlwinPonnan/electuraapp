import React, { useState, useEffect, useContext } from 'react'
import { View, StyleSheet, Appearance, Pressable, Image, ScrollView, TextInput, ImageBackground } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';



///////context
import { isAuthorisedContext } from '../navigators/stacks/RootStack';
import Icon from 'react-native-vector-icons/Ionicons'

import { Headline, Button, Text, Subheading, Checkbox } from 'react-native-paper'
import { dark_colors, light_colors } from '../globals/colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/core';
import { getToken, loginUser, setToken } from '../Services/User';
import { useIsFocused } from '@react-navigation/native';

export default function LoginScreen(props) {
    const navigation = useNavigation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isAuth, setIsAuth] = useContext(isAuthorisedContext);

    const focused = useIsFocused();




    const handleLogin = async () => {
        try {
            if (email == "") {
                alert("Please Enter Email")
            }
            if (password == "") {
                alert("Please Enter Password")
            }
            else {
                let obj = {
                    email,
                    password,
                }
                const res = await loginUser(obj)
                console.log(res)
                if (res?.data?.message) {
                    alert(res.data.message);
                    await setToken(res.data.token);
                    setIsAuth(true)
                }
            }
        }
        catch (err) {
            if (err?.response?.data?.message) {
                console.log(err?.response?.data?.message)
                alert(err?.response?.data?.message)
            }
            else {
                alert(err)
                console.log(err)
            }
        }
    }



    const checkLogin = async () => {
        let tokken = await getToken()
        if (tokken) {
            setIsAuth(true)
        }
        console.log(tokken)
    }


    useEffect(() => {
        if (focused) {
            checkLogin()
        }
    }, [focused])



    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <View style={styles.imgContainer}>
                    <Image source={require('../../assets/Logo.png')} style={styles.img} resizeMode="contain" />
                </View>
                {/* <Image source={require("../../assets/2137.jpg")} style={{ width: wp(80), height: hp(30), }} /> */}
                <Image source={require("../../assets/20943501.jpg")} style={{ width: wp(80), height: hp(30), }} />
                <Text style={styles.headerText} >Let's log you in !</Text>
                <Text style={styles.label}>
                    Your Mobile Number
                </Text>
                <TextInput placeholder="Mobile Number" onChangeText={setEmail} keyboardType="number-pad" maxLength={10} style={styles.txtInput} />

                <Pressable style={styles.btn} onPress={() => props.navigation.navigate("OtpScreen")}>
                    <Text style={styles.btnTxt}>Login</Text>
                </Pressable>
                {/* <Pressable style={styles.button} onPress={() => handleLogin()}>
                    <LinearGradient colors={[light_colors.primary, light_colors.primary2,]} start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} useAngle={true} angle={45} style={{ padding: 12 }} >
                        <Text style={styles.buttonText}>
                            Submit
                        </Text>
                    </LinearGradient>
                </Pressable> */}

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText} >Don't have an Account? </Text><Pressable style={styles.registerButton} android_ripple={{ color: '#ddd' }} onPress={() => navigation.navigate('Register')}  ><Text style={styles.registerButtonText}>Register.</Text></Pressable>
                </View>

                <View style={styles.skipForNowContainer}>
                    <Pressable style={styles.skipForNowButton} android_ripple={{ color: '#ddd' }} onPress={() => navigation.navigate('MainBottomTab')} ><Text style={styles.skipForNowText}>Skip For Now</Text></Pressable>
                </View>
            </ScrollView>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: '100%',
        backgroundColor: Appearance.getColorScheme() == 'dark' ? dark_colors.backgroundColor : light_colors.backgroundColor,
        // padding: 15,
        display: 'flex',
        // justifyContent: 'center'
    },
    headerText: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 24,
        textAlign: 'center',
        color: Appearance.getColorScheme() == 'dark' ? dark_colors.textColor : light_colors.textColor,
        fontFamily: 'OpenSans-Bold',
    },

    label: {
        fontFamily: 'OpenSans-SemiBold',
        color: "black",
        fontSize: 14,
        width: wp(85),
        marginBottom: 8,
        color: "grey",
        paddingLeft: 5,
        marginTop: 30,
        // paddingTop: 15,
        textTransform: "capitalize",
    },
    btn: {
        backgroundColor: "#363D4D",
        borderRadius: 8,
        width: wp(85),
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
        // paddingTop: 15,
        textTransform: "capitalize",
        color: "white"
    },

    //////txtinput
    txtInput: {
        borderColor: "rgba(0,0,0,0.02)",
        width: wp(85),
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 20,
        backgroundColor: "#F1F3FD",
        marginVertical: 8
    },

    buttonStyles: {

    },
    button: {
        borderRadius: 5,
        marginVertical: 10,
        display: 'flex',
        overflow: 'hidden'
    },
    buttonText: {
        color: Appearance.getColorScheme() == 'dark' ? dark_colors.buttonText : light_colors.buttonText,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'OpenSans-Regular',
    },
    img: {
        width: '80%',
        height: '80%'
    },
    imgContainer: {
        width: '100%',
        maxHeight: 150,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginTop: 33
    },
    showPassword: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    showPasswordText: {
        color: Appearance.getColorScheme() == 'dark' ? dark_colors.textColor : light_colors.textColor,
        marginLeft: 5,
        fontFamily: 'OpenSans-Regular',
    },
    registerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    registerText: {
        color: Appearance.getColorScheme() == 'dark' ? dark_colors.textColor : light_colors.textColor,
        fontFamily: 'OpenSans-Regular',
    },
    registerButton: {

    },
    registerButtonText: {
        color: Appearance.getColorScheme() == 'dark' ? dark_colors.primary : light_colors.primary,
        fontFamily: 'OpenSans-Regular',
    },
    skipForNowContainer: {
        marginTop: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    skipForNowButton: {

    },
    skipForNowText: {
        color: Appearance.getColorScheme() == 'dark' ? dark_colors.primaryDark : light_colors.primaryDark,
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular',
    }
})