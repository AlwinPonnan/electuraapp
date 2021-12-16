import React, { useEffect, useState,useContext } from 'react'
import { View, Text, StyleSheet,Image,Pressable } from 'react-native'
import ZoomUs from 'react-native-zoom-us';

import { useIsFocused } from '@react-navigation/core';
import { getQueryParams } from '../globals/utils';
import { colorObj } from '../globals/colors';
import { loadingContext } from '../navigators/stacks/RootStack';

export default function zoomMeeting(props) {

    const focused = useIsFocused()

    const [propsObj, setPropsObj] = useState(props.route.params.data);
    const [isUser, setIsUser] = useState(props.route.params.isUser);


    const [isLoading, setIsLoading] = useContext(loadingContext);

    useEffect(() => {
        (async () => {
            try {
                console.log(propsObj)
                if (isUser) {
                    const initializeResult = await ZoomUs.initialize({
                        clientKey: propsObj?.enquiryObj?.slotObj?.sdkObj?.sdkKey, clientSecret: propsObj?.enquiryObj?.slotObj?.sdkObj?.sdkSecret
                    },{enableCustomizedMeetingUI: false});
                    console.log({ initializeResult });
                    await ZoomUs.joinMeeting({
                        userName:propsObj?.userObj?.name,
                        password:propsObj?.enquiryObj?.slotObj?.meetingPasscode,
                        meetingNumber:propsObj?.enquiryObj?.slotObj?.meetingNumber
                    })
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
                        userName: 'Johny',
                        meetingNumber: propsObj?.zoomMeetingObj?.id,
                        userId: propsObj?.zoomMeetingObj?.host_email,
                        zoomAccessToken: queryParams?.zak,
                    })
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
            <Image source={require('../../assets/images/Icon.png')} style={{  marginBottom: 30,maxWidth:'90%',padding:'5%' }}  resizeMode="contain" />
            <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 20 }}>Meeting Ended</Text>
            <Pressable style={styles.btn} onPress={()=>props.navigation.goBack()}> 
                <Text style={styles.btnTxt}>Go Back</Text>
            </Pressable>
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

})