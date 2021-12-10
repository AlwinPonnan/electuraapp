import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable,StatusBar } from 'react-native'
import { useIsFocused } from '@react-navigation/core';

// import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';



export default function Testzoom(props) {



    const focused = useIsFocused()


    // const initZoom = async () => {

    // const onConferenceTerminated = (nativeEvent) => {
    //     /* Conference terminated event */
    //     JitsiMeet.endCall();
    //     props.navigation.goBack()
    //     alert("Ending")
    // }

    // const onConferenceJoined = (nativeEvent) => {
    //     /* Conference joined event */
    //     console.log(nativeEvent)
    // }

    // const onConferenceWillJoin = (nativeEvent) => {
    //     StatusBar.setHidden(false, 'none'); // don't remove this
    //     StatusBar.setTranslucent(false); // don't remove this.
    //     StatusBar.setBackgroundColor('#000000'); // you can remove
    //     StatusBar.setBarStyle('light-content');
    //     /* Conference will join event */
    // }
    // useEffect(() => {
    //     return () => {
    //         JitsiMeet.endCall();
    //     };
    // });
    // console.log(temp)


    // await ZoomUs.startMeeting({
    //     userName: 'Johny',
    //     meetingNumber: '12345678',
    //     userId: 'sampleUser123',
    //     // zoomAccessToken: zak,
    //     enableCustomizedMeetingUI: true
    // })
    // }

    // const startMeeting = async () => {

    // }

    // useEffect(() => {
    //     if (focused) {
    //         // you can remove
    //         setTimeout(()=>{

    //             const url = 'https://meet.jit.si/deneme'; // can also be only room name and will connect to jitsi meet servers
    //             const userInfo = { displayName: 'User', email: 'user@example.com', avatar: 'https:/gravatar.com/avatar/abc123' };
    //             JitsiMeet.call(url, userInfo,);
    //             /* You can also use JitsiMeet.audioCall(url) for audio only call */
    //             /* You can programmatically end the call with JitsiMeet.endCall() */
    //         },1000)
                
    //     }
    //     else {
    //         JitsiMeet.endCall()
    //     }
    //     return () => JitsiMeet.endCall()
    // }, [])


    return (
        <View style={{flex:1}}>

        {/* <JitsiMeetView onConferenceTerminated={onConferenceTerminated} onConferenceJoined={onConferenceJoined} onConferenceWillJoin={onConferenceWillJoin} style={{
            flex: 1,
            height: '100%',
            width: '100%',
        }} /> */}
        </View>
    )

}
