import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import ZoomUs from 'react-native-zoom-us';

import { useIsFocused } from '@react-navigation/core';
import { getQueryParams } from '../globals/utils';
export default function zoomMeeting(props) {

    const focused = useIsFocused()

    const [propsObj, setPropsObj] = useState(props.route.params.data);
    const [isUser, setIsUser] = useState(props.route.params.isUser);

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

            } catch (e) {
                // Alert.alert('Error', 'Could not execute initialize');
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
        <View>
            <Text>END</Text>
        </View>
    )
}
