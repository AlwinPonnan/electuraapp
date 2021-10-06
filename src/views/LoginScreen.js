import React from 'react'
import { View, Text, StyleSheet, Image,TextInput,Pressable } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj } from '../globals/colors';
import { imageObj } from '../globals/images';

import Icon from 'react-native-vector-icons/Ionicons'
export default function login(props) {
    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Image source={imageObj.loginEllipse} />
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.labelHeading}>Enter Phone Number</Text>
                    <Text style={styles.labelSubHeading}>OTP will be sent on this number</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="call-outline" size={14} color="black" />
                    <TextInput style={styles.inputStyles} keyboardType="numeric" placeholder="+91 Enter Number"  />
                </View>
                <View style={styles.btnContainer}>
                    <Text style={styles.termsText}>By Continuing you accept the <Text style={{color:colorObj.primarColor}}>terms and conditions</Text></Text>
                    <Pressable style={styles.btn} onPress={()=>props.navigation.navigate('OtpScreen')}>
                        <Text style={styles.btnText}>Send Otp</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    topContainer: {
        height: hp(25),
        width: wp(100),
        backgroundColor: colorObj.orangeColor
    },
    bottomContainer: {
        height: hp(75),
        width: wp(100),
        backgroundColor: colorObj.whiteColor
    },
    textContainer: {
        padding: 20,
    },
    labelHeading: {
        fontFamily: 'RedHatText-SemiBold',
        lineHeight: 21,
        marginVertical: 5,
        fontSize: 16,
        color: 'black'
    },
    labelSubHeading: {
        fontFamily: 'RedHatText-Regular',
        fontSize: 12,
        color: '#828282',
        lineHeight: 15,
        marginTop: 2
    },
    inputContainer:{
        width:wp(90),
        alignSelf:'center',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        borderRadius:50,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        paddingHorizontal:20,
        elevation: 3,
        borderColor:'transparent',
        backgroundColor:colorObj.whiteColor
    },
    btn:{
        backgroundColor:colorObj.primarColor,
        borderRadius:61,
        width:wp(80),
        paddingVertical:15
    },
    btnText:{
        fontFamily:'Montserrat-SemiBold',
        color:colorObj.whiteColor,
        alignItems:'center',
        textAlign:'center',
        fontSize:20
    },
    termsText:{
        fontSize:12,
        color:'#828282',
        fontFamily:'Montserrat-Regular',
        marginVertical:10,
        textAlign:'center'
    },
    btnContainer:{
        width:wp(90),
        paddingHorizontal:20,
        position:'absolute',
        bottom:50,
        // backgroundColor:'red',
        left:20
    }
})
