import React from 'react'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { colorObj } from '../globals/colors'

export default function PaymentFailed() {

    const handleTrackStatus = () => {

    }
    const handleBackHome = () => {

    }

    return (
        <View style={[styles.container]}>
            <View style={{ alignItems: 'center' }}>
                <Image source={require('../images/Payment_Failed.png')} style={styles.img} />
                <Text style={[styles.title]}>Payment Failed</Text>
                <View style={[styles.contentView]}>
                    <Text style={[styles.content]}>Your payment was Failed!</Text>
                    <Text style={[styles.content]}>Please go to payment mode and try again</Text>
                </View></View>
                           <View  style={{ marginTop:20, padding: 20,paddingHorizontal:50 }}>
                               <Pressable style={[styles.Btn, { backgroundColor: '#E75430', }]} onPress={() => handleBack()}>
                    <Text style={[styles.BtnText, { color: '#FFF', }]}>Back</Text>
                </Pressable>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        paddingTop: 70,
        backgroundColor: '#fff',
        flex: 1,
        //justifyContent:'center',
    },
    img: {
        height: 200,
        width: 200
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