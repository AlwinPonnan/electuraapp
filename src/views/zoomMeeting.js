import React, { useEffect, useState, useContext } from 'react'
import { View, Text, StyleSheet, Image, Pressable, Modal, TextInput } from 'react-native'
import ZoomUs from 'react-native-zoom-us';

import { useIsFocused } from '@react-navigation/core';
import { getQueryParams } from '../globals/utils';
import { colorObj } from '../globals/colors';
import { loadingContext } from '../navigators/stacks/RootStack';

import { Rating, AirbnbRating } from 'react-native-ratings';
import { successAlertContext } from '../../App';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { newMeetingFeedback } from '../Services/MeetingFeedback';

export default function zoomMeeting(props) {

    const focused = useIsFocused()

    const [propsObj, setPropsObj] = useState(props.route.params.data);
    const [isUser, setIsUser] = useState(props.route.params.isUser);

    console.log(JSON.stringify(props.route.params.data, null, 2), "PROPS%%%%%%%%%%%%%%%%%%%%5")

    const [MeetingText, setMeetingText] = useState("Please Wait ...");
    const [isLoading, setIsLoading] = useContext(loadingContext);

    const [responseMessage, setResponseMessage] = useState('');
    const [rating, setRating] = useState(3);
    const [responseModal, setResponseModal] = useState(false);

    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr
    const [meetingEndedToggle, setMeetingEndedToggle] = useState(false);
    const handleSubmitFeedBack = async () => {
        setResponseModal(false)
        try {
            let obj = {
                rating,
                message: responseMessage,
                enquiryId: props?.route?.params?.enquiryId
                // orderId: orderObj._id,
                // courseId: orderObj?.courseObj?._id

            }
            const { data: res } = await newMeetingFeedback(obj)
            if (res.success) {
                setAlertText("Feedback Successfully recorded")
                setSuccessAlert(true)
                props.navigation.goBack()
            }
        } catch (error) {
            if (error.response.data.message) {
                setErrorAlert(true)
                setAlertText(error.response.data.message)
            }
            else {
                setErrorAlert(true)
                setAlertText(error.message)
            }
        }
    }
    useEffect(() => {

        (async () => {
            try {
                setTimeout(() => { setMeetingText("Meeting Ended"); setIsLoading(false); setMeetingEndedToggle(true) }, 10000)
                console.log(propsObj)
                setIsLoading(true)
                if (isUser) {
                    const initializeResult = await ZoomUs.initialize({
                        clientKey: propsObj?.enquiryObj?.slotObj?.sdkObj?.sdkKey, clientSecret: propsObj?.enquiryObj?.slotObj?.sdkObj?.sdkSecret
                    }, { enableCustomizedMeetingUI: false });
                    console.log({ initializeResult });
                    await ZoomUs.joinMeeting({
                        userName: propsObj?.userObj?.name,
                        password: propsObj?.enquiryObj?.slotObj?.meetingPasscode,
                        meetingNumber: propsObj?.enquiryObj?.slotObj?.meetingNumber
                    })
                    setIsLoading(false)

                }
                else {
                    let queryParams = getQueryParams(propsObj?.zoomMeetingObj?.start_url)
                    const initializeResult = await ZoomUs.initialize({
                        clientKey: propsObj?.zoomSdkObj?.sdkKey, clientSecret: propsObj?.zoomSdkObj?.sdkSecret
                    },
                        {
                            enableCustomizedMeetingUI: false,
                        },
                    );
                    console.log({ initializeResult });
                    await ZoomUs.startMeeting({
                        userName: 'Teacher',
                        meetingNumber: propsObj?.zoomMeetingObj?.id,
                        userId: propsObj?.zoomMeetingObj?.host_email,
                        zoomAccessToken: queryParams?.zak,
                    })

                    setIsLoading(false)

                }
                setIsLoading(false)

            } catch (e) {
                // Alert.alert('Error', 'Could not execute initialize');
                setIsLoading(false)
                console.error(e);
                if (e?.response?.data?.message) {

                    console.error(e.response.data.message)
                }
                else {
                    console.error(e.message)
                }

            }
        })();

    }, [focused]);
    return (
        <View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('../../assets/images/Icon.png')} style={{ marginBottom: 30, maxWidth: '90%', padding: '5%' }} resizeMode="contain" />
            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 20 }}>{MeetingText}</Text>
            <Pressable style={styles.btn} onPress={() => props.navigation.goBack()}>
                <Text style={styles.btnTxt}>Go Back</Text>
            </Pressable>
            {
                meetingEndedToggle &&
                <Pressable style={styles.btn} onPress={() => setResponseModal(true)}>
                    <Text style={styles.btnTxt}>Give Feedback</Text>
                </Pressable>
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={responseModal}
                onRequestClose={() => {
                    setResponseModal(false);
                }}
            >
                <Pressable style={styles.centeredView} onPress={() => setResponseModal(false)}>
                    <Pressable style={styles.modalView}>
                        <Text style={styles.responseModalHeading}>Feedback</Text>



                        <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Rating</Text>

                        <Rating
                            style={{ alignSelf: 'flex-start', marginVertical: 5 }}
                            type='custom'
                            startingValue={rating}
                            onFinishRating={(val) => setRating(val)}
                            ratingCount={5}
                            imageSize={25}
                            showRating
                            ratingTextColor={colorObj.primarColor}
                            showRating={false}

                        />
                        <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Message</Text>
                        <TextInput style={[styles.textInput]} multiline numberOfLines={4} value={responseMessage} onChangeText={(e) => setResponseMessage(e)} />
                        <Pressable style={styles.submitBtn} onPress={() => handleSubmitFeedBack()}>
                            <Text style={styles.submitBtnText}>Submit</Text>
                        </Pressable>

                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    btn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 5,
        // width: wp(20),
        paddingHorizontal: 10,
        // height: 40,
        paddingVertical: 5,
        marginVertical: 10,
        marginLeft: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    btnTxt: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 13,
        color: "white",
        // marginTop: 15
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.6)'

    },
    modalView: {
        margin: 20,
        width: widthPercentageToDP(90),
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    responseModalHeading: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 20,
        color: '#000',
        textAlign: 'left',
        marginVertical: 10,

        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },

    //text input styles
    textInputLabel: {
        fontFamily: 'RedHatText-SemiBold',
        fontSize: 16,
        color: '#000'
    },
    textInput: {
        backgroundColor: '#F5F6FA',
        borderRadius: 5,
        marginVertical: 10,
        width: '100%',
        fontFamily: 'Montserrat-Regular'

    },

    submitBtn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 25,
        marginVertical: 10,
        alignSelf: 'flex-end'
    },
    submitBtnText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: colorObj.whiteColor,
        textAlign: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20
    },
})