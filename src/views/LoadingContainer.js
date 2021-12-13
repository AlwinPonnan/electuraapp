import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj } from '../globals/colors';
import LottieView from 'lottie-react-native';

export default function LoadingContainer() {
    return (
        <>
            <View style={styles.container}>
                <LottieView source={require('../../assets/images/loading.json')} autoSize resizeMode="cover" autoPlay loop={true} style={styles.lottieStyle} />

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: hp(100),
        width: wp(100),
        // backgroundColor: "green",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    lottieStyle: {
        height: 200,
        width: 200,
        alignSelf: 'center'
    },
})