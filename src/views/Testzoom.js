import React, { useEffect, useState, useContext } from 'react'
import { View, Text, StyleSheet, Pressable, StatusBar } from 'react-native'
import { useIsFocused } from '@react-navigation/core';

// import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import { WebView } from 'react-native-webview';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { loadingContext } from '../navigators/stacks/RootStack';


export default function Testzoom(props) {



    const focused = useIsFocused()
    const [isLoading, setIsLoading] = useContext(loadingContext);
    const [count, setCount] = useState(0);

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

    // console.log(temp)






    useEffect(() => {
        if (focused) {
            setIsLoading(true)
        }
        else {
            setCount(0)
        }
        return () => setCount(0)
    }, [focused])

    useEffect(() => {
        if (count == 2) {
            setIsLoading(false)
        }
        
    }, [count])
    const handleNavigationStateChange = (e) => {
        setCount(prev => prev + 1)
        console.log(count)
        console.log(e)
        if (e.url == "https://meet.jit.si/static/close3.html") {
            props.navigation.goBack()
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {/* <JitsiMeetView onConferenceTerminated={onConferenceTerminated} onConferenceJoined={onConferenceJoined} onConferenceWillJoin={onConferenceWillJoin} style={{ flex: 1, height: '100%', width: '100%' }} /> */}
            <WebView

                style={{ height: heightPercentageToDP(100), width: widthPercentageToDP(100) }}
                onNavigationStateChange={(e) => handleNavigationStateChange(e)}
                injectedJavaScript={`[...document.querySelectorAll('button')].find(elx=>elx.textContent=="Launch in web")?.click()`}
                source={{ uri: `https://meet.jit.si/${props.route.params.data._id}` }}
            />

        </View>
    )

}
