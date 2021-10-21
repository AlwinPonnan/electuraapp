import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj } from '../globals/colors';

export default function LoadingContainer() {
    return (
        <>
            <View style={styles.container}>
                <ActivityIndicator size="large" color={colorObj.primarColor} />
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
    }
    ,
})