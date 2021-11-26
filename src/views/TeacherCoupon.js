import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, Modal } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import NavBar from '../components/Navbar';
import { FAB, RadioButton } from 'react-native-paper';
import { colorObj } from '../globals/colors';
import { loadingContext } from '../navigators/stacks/RootStack';
import { successAlertContext } from '../../App';
import { useIsFocused } from '@react-navigation/core';
import { getCouponsByTeacherId } from '../Services/Coupons';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Icon from 'react-native-vector-icons/Ionicons'
export default function TeacherCoupons(props) {

    const [isLoading, setIsLoading] = useContext(loadingContext);

    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr;

    const focused = useIsFocused()

    const [couponArr, setCouponArr] = useState([]);

    const [couponModal, setCouponModal] = useState(false);

    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [expiry, setExpiry] = useState('');

    const getCoupons = async () => {
        setIsLoading(true)
        try {
            let { data: res } = await getCouponsByTeacherId();
            if (res.success) {
                setCouponArr(res.data)
            }
        } catch (error) {
            console.error(error)
        }
        setIsLoading(false)
    }


    const handleOnInit = () => {
        getCoupons()
    }


    useEffect(() => {
        handleOnInit()
    }, [focused])


    return (
        <View style={[styles.container]}>
            <NavBar rootProps={props} />

            <View style={{ padding: 20 }}>



                <View style={styles.inputView}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter coupon code"
                        keyboardType="numeric"
                    />

                </View>
            </View>

            <View style={{ backgroundColor: '#F9F9F9', padding: 20 }}>
                <View style={{ flexDirection: 'row', }}>
                    <AntDesign name='checksquare' size={18} style={{ color: '#085A4E', marginRight: 20 }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ marginLeft: 7, color: '#085A4E', fontFamily: "RedHatText-SemiBold", borderStyle: 'dashed', borderWidth: 1, borderColor: '#085A4E', padding: 5, width: 100, textAlign: 'center' }}>ELECTURA</Text>
                        <Text style={{ color: '#4F4F4F', fontSize: 13, fontFamily: "RedHatText-Regular", marginTop: 10 }}>Save $50</Text>
                        <Text style={{ color: '#4F4F4F', fontSize: 13, fontFamily: "RedHatText-Regular", marginTop: 10 }}>Expires on: 09th December 202 1</Text>
                    </View>
                </View>


            </View>
           
            <FAB
                style={styles.fab}
                small
                color={colorObj.whiteColor}

                icon="plus"
                label="Add Coupons"
                onPress={() => props.navigation.navigate('AddCoupons')}
            />



        </View>
    )
}
const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: colorObj?.primarColor,
        fontFamily: 'Montserrat-SemiBold'
    },
    container: {
        // padding:20,
        backgroundColor: '#fff',
        flex: 1,
    },
    topText: {
        fontSize: 18,
        fontFamily: 'RedHatText-SemiBold',
        //fontWeight:'500',
    },
    inputView: {
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 25,
        borderRadius: 5,
        borderColor: '#E0E0E0'
    },
    input: {
        width: '80%',
        fontSize: 14,
        fontFamily: 'RedHatText-Regular',
    },
    check: {
        color: '#085A4E',
        fontSize: 15,
        fontFamily: 'RedHatText-SemiBold',
    },


   
})