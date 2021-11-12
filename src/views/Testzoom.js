import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useIsFocused } from '@react-navigation/core';





export default function Testzoom() {



    const focused = useIsFocused()


    const initZoom = async () => {

      
        // console.log(temp)


        // await ZoomUs.startMeeting({
        //     userName: 'Johny',
        //     meetingNumber: '12345678',
        //     userId: 'sampleUser123',
        //     // zoomAccessToken: zak,
        //     enableCustomizedMeetingUI: true
        // })
    }

    const startMeeting = async () => {
       
    }

    useEffect(() => {
        initZoom()
    }, [focused])

    return (
        <View>
        </View>
    )
}
