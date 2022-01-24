import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, TextInput, Pressable, ScrollView, Linking } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icons from "react-native-vector-icons/FontAwesome";
import IconsFoundation from "react-native-vector-icons/Foundation";
import IconsFeather from "react-native-vector-icons/Feather";
import { successAlertContext } from '../../App';
import NavBar from '../components/Navbar';

import { loadingContext } from '../navigators/stacks/RootStack';
import { newGeneralFeedback } from '../Services/GeneralFeedback';
import { colorObj } from '../globals/colors';
import { socialLink } from '../globals/utils';
export default function Contact(props) {
    const [isLoading, setIsLoading] = useContext(loadingContext);

    const [message, setMessage] = useState('');

    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)

    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr
    const handleSubmit = async () => {
        try {

            if (message != "") {

                let obj = {
                    message
                }
                const { data: res } = await newGeneralFeedback(obj)
                if (res.success) {
                    setMessage("")
                    setSuccessAlert(true)
                    setAlertText(res.message)
                }
            }
            else {
                setAlertText("Please Enter Message")
                setErrorAlert(true)
            }
        } catch (error) {
            if (error?.response?.data?.message) {
                setAlertText(error.data.response.message)
                setErrorAlert(true)
            }
            else {
                setAlertText(error.message)
                setErrorAlert(true)
            }
        }
    }


    const handleShare = (url) => {
        Linking.openURL(url)
    }

    const handleWhatsapp = () => {
        Linking.openURL('whatsapp://send?text=hello&phone=919302275951')
    }

    const handleWebRedirect = () => {
        Linking.openURL("https://www.electura.co/")
    }

    // https://www.facebook.com/electura.co


    return (
        <ScrollView keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ backgroundColor: "white" }}>
            <NavBar rootProps={props} />
            <View style={styles.container}>
                <View style={styles.flexRow}>
                    <View style={styles.flexColumn}>
                        <Text style={styles.headingText}>Help Center</Text>
                        <Text style={styles.greyText}>
                            Please get in touch with team Electura and we’ll be happy to help you.
                        </Text>
                        <View style={[styles.flexRow, { marginTop: 20 }]}>
                            <Pressable onPress={() => handleShare(socialLink.instagram)} style={styles.circle}>
                                <Icons color="#E517DD" name="instagram" size={15} />
                            </Pressable>
                            <Pressable style={styles.circle} onPress={() => handleWhatsapp()} >
                                <Icons color="#64D315" name="whatsapp" size={15} />
                            </Pressable>
                            <Pressable style={styles.circle} onPress={() => handleShare(socialLink.linkdin)}>
                                <Icons color="#6747ED" name="linkedin" size={15} />
                            </Pressable>
                            <Pressable style={styles.circle} onPress={() => handleShare(socialLink.email)}>
                                <IconsFeather color="#FF900E" name="mail" size={15} />
                            </Pressable>
                            <Pressable style={styles.circle} onPress={() => handleShare(socialLink.facebook)}>
                                <Icons color="#0085FF" name="facebook" size={15} />
                            </Pressable>
                            <Pressable style={styles.circle} onPress={() => handleWebRedirect()}>
                                <IconsFoundation color="#085A4E" name="web" size={15} />
                            </Pressable>
                        </View>
                    </View>

                    <Image style={{ height: hp(17), flex: 0.6 }} resizeMode='contain' source={require('../../assets/images/contact.png')} />
                </View>
                <View style={{ height: 5, width: wp(100), backgroundColor: "#F5F6FA", position: "relative", left: wp(-5) }}></View>
                <View style={[styles.flexColumn, { marginTop: 40 }]}>
                    <Text style={[styles.headingText, { fontSize: 16 }]}>
                        Send Feedback
                    </Text>
                    <Text style={styles.greyText}>
                        Are you facing any issues? Report a bug? Suggest a new feature? Let us know. We’ll get back to you at earliest.
                    </Text>
                    <TextInput value={message} multiline={true} onChangeText={(val) => setMessage(val)} style={styles.textInput} />
                    <Pressable onPress={() => handleSubmit()} style={styles.submitBtn}>
                        <Text style={styles.btnText}>
                            Submit
                        </Text>
                    </Pressable>

                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: wp(90),
        paddingTop: hp(4),
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    flexRowAlignCenter: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },

    flexColumn: {
        display: "flex",
        flexDirection: "column",
        flex: 1.2,
    },
    headingText: {
        fontFamily: 'RedHatText-SemiBold',
        fontSize: 18
    },
    circle: {
        backgroundColor: "#F5F6FA",
        height: 30,
        width: 30,
        marginVertical: 8,
        marginRight: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50
    },
    greyText: {
        fontFamily: 'RedHatText-SemiBold',
        fontSize: 12,
        color: "#828282",
        marginTop: 10,
        // width: "90%",
    },
    submitBtn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 20,
        width: wp(25),
        alignSelf: "flex-end",
        marginBottom: 40,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",

    },
    btnText: {
        color: "white",
        fontSize: 12,
        fontFamily: 'Montserrat-Medium'
    },
    textInput: {
        backgroundColor: "#F5F6FA",
        height: hp(15),
        marginVertical: 20,
        borderRadius: 6,
        width: "100%"
    },

})