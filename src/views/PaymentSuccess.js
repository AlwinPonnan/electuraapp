import React from 'react'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { colorObj } from '../globals/colors'

export default function PaymentSuccess(props) {

    const handleTrackStatus = () => {
        props.navigation.navigate('Orders')
        
    }
    const handleBackHome = () => {
        props.navigation.navigate('MainDrawer')
    }

    return (
        <View style={[styles.container]}>
            <View style={{ alignItems: 'center' }}>
                <Image source={require('../images/Payment_Success.png')} style={styles.img} />
                <Text style={[styles.title]}>Payment Success</Text>
                <View style={[styles.contentView]}>
                    <Text style={[styles.content]}>Your payment was succesful!</Text>
                    {/* <Text style={[styles.content]}>Just wait Java Book arrive at home</Text> */}
                </View></View>
            <View style={{ justifyContent: 'flex-end', flex: 1, padding: 20 }}>
                <Pressable style={[styles.Btn, { backgroundColor: colorObj.primarColor, }]} onPress={() => handleTrackStatus()}>
                    <Text style={[styles.BtnText, { color: colorObj.whiteColor, }]}>Track Order Status</Text>
                </Pressable>
                <Pressable style={[styles.Btn, { backgroundColor: '#F2C94C', }]} onPress={() => handleBackHome()}>
                    <Text style={[styles.BtnText, { color: 'black', }]}>Back to home</Text>
                </Pressable>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        backgroundColor: '#fff',
        flex: 1
    },
    img: {
        height: 250,
        width: 250
    },
    title: {
        fontSize: 23,
        fontFamily: 'Montserrat-SemiBold',
        fontWeight: '600'
    },
    content: {
        fontWeight: '500',
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        color: '#929292'
    },
    contentView: {
        marginTop: 15,
        alignItems: 'center'
    },
    Btn: {
        borderRadius: 25,
        marginVertical: 10,
    },
    BtnText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        textAlign: 'center',
        paddingVertical: 10,
    },


})