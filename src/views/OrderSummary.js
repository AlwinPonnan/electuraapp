import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused, useNavigation } from '@react-navigation/core';
import { colorObj } from '../globals/colors'
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed';
import { getCart, getDecodedToken } from '../Services/User';
import { generateImageUrl } from '../globals/utils';

import RazorpayCheckout from 'react-native-razorpay';
import { createOrder, paymentCallBack } from '../Services/Order';
import { loadingContext } from '../navigators/stacks/RootStack';
import { successAlertContext } from '../../App';




export default function OrderSummary(props) {

    const [isLoading, setIsLoading] = useContext(loadingContext);

    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr
    const navigation = useNavigation()

    const [cartObj, setCartObj] = useState({});

    const focused = useIsFocused()
    const getUserCart = async () => {
        try {
            const { data: res } = await getCart();
            if (res.success) {
                console.log(res.data)
                setCartObj(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }



    const handleRazorPay = (obj, ourOrderId) => {
        try {
            console.log(obj)
            var options = {
                description: 'Order',
                image: 'https://i.imgur.com/3g7nmJC.png',
                currency: 'INR',
                key: 'rzp_test_0pQxHrWF15Wco6',
                amount: obj.amount,
                name: 'Electura',
                order_id: obj.id,//Replace this with an order_id created using Orders API.

                theme: { color: '#ff1b35' }
            }
            RazorpayCheckout.open(options).then(async (data) => {
                // handle success
                let tempObj = {
                    orderId: ourOrderId,
                    ...data,
                    amount: obj.amount
                }
                await handlePaymentCallBack(tempObj)
            }).catch((error) => {
                // handle failure
                console.error(error)
                console.log(typeof error.description)
                if (error?.error?.description) {
                    setAlertText(error?.error?.description)
                    setErrorAlert(true)
                }
                else {
                    setAlertText(`Error: ${error.code} | ${error.description}`)
                    setErrorAlert(true)
                }
            });
        } catch (error) {
            console.log(error)
        }
    }


    const handlePaymentCallBack = async (obj) => {
        try {
            let { data: res, status: statusCode } = await paymentCallBack(obj.orderId);
            if (res) {
                getCart()
                setAlertText(res.message)
                setSuccessAlert(true)
                navigation.navigate(PaymentSuccess)

                // alert(res.message)

            }
        } catch (error) {
            console.error(error)
        }
    }


    const buyPackage = async () => {


        setIsLoading(true)
        try {

            let decoded = await getDecodedToken()
            if (decoded) {
                let obj = {

                    userId: decoded.userId,
                }
                let { data: res, status: statusCode } = await createOrder(obj)
                if (res) {
                    // alert(res.message);
                    handleRazorPay(res.data, res.orderId)
                }
            }
        }
        catch (err) {
            console.error(err);
            console.log(err.description);
            props.navigation.navigate('PaymentFailed')
            // if (err?.response?.data?.message) {
            //     console.log(err?.response?.data?.message);
            //     alert(err?.response?.data?.message);
            // }
            // else if (err.error.reason) {
            //     console.error(err);
            //     console.log(err.description);
            // }
            // else {
            //     console.error(err);
            //     console.log(err.description);
            //     alert(err);
            // }
        }
        setIsLoading(false)


    }





    useEffect(() => {
        getUserCart()
    }, [focused])


    const handlePay = () => {
        navigation.navigate(PaymentSuccess)
    }

    const renderItem = ({ item }) => (
        <View style={[styles.topView, { marginTop: 10 }]}>
            <Image
                style={[styles.img]}
                source={{
                    uri:
                        generateImageUrl(item?.courseObj?.thumbnailImage?.url)
                }}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.listTitle]}>{item?.courseObj?.name}</Text>
                <Text style={[styles.address, { color: '#929292' }]}>{item?.courseObj?.description}</Text>
            </View>
            <View style={[styles.topView]}><FontAwesome name="inr" size={12} color={'black'} />
                <Text style={[styles.address, { color: 'black', marginLeft: 5 }]}>{item?.courseObj?.price}</Text></View>
        </View>
    );

    return (
        <View style={[styles.container]}>
            <View style={[styles.topView]}>
                <AntDesign name="left" size={12} onPress={() => navigation.goBack()} />
                <Text style={[styles.topTextView, styles.topText]}>Order Summary</Text>
            </View>


            <View style={[styles.addressView]}>
                <View style={[styles.topView]}><Text style={[styles.address, { color: 'black', marginBottom: 7 }]}>Shipping Address </Text>
                    <FontAwesome5 name="pen" size={9} style={{ color: '#828282', marginLeft: 5 }} />
                </View>
                <Text style={[styles.address, { color: '#929292' }]}>Jelly Sams</Text>
                <Text style={[styles.address, { color: '#929292' }]}>+91 995-9672-678</Text>
                <Text style={[styles.address, { color: '#929292' }]}>983  Ranibagh Street (Between jones & Bekianer sweets) Shakurpur, Delhi</Text>
            </View>
            <Text style={[styles.topText, { marginTop: 15 }]}>Order  Details</Text>
            <View>
                <FlatList
                    data={cartObj?.courseArr}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item?.courseId}`}

                />
                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between' }}><Text style={[styles.topText]}>Total Price</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}><FontAwesome name="inr" size={12} color={'black'} />
                        <Text style={[styles.address, { color: 'black', marginLeft: 5, fontFamily: "Montserrat-Bold", }]}>{cartObj?.courseArr?.reduce((acc, el) => acc + el.courseObj.price, 0)}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{ justifyContent: 'flex-end', flex: 1 }}>
                <Pressable style={styles.submitBtn} onPress={() => buyPackage()}>
                    <Text style={styles.submitBtnText}>Pay</Text>
                </Pressable></View>

        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        padding: 15,
        flex: 1,
    },
    img: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        borderRadius: 10
    },
    listTitle: {
        fontSize: 13,
        color: 'black',
        fontFamily: "Montserrat-Regular",
    },
    topView: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    topTextView: {
        textAlign: 'center',
        width: wp(80)
    },
    topText: {
        fontSize: 15,
        fontFamily: 'Montserrat-SemiBold',
    },

    addressView: {
        marginTop: 30
    },
    address: {
        fontSize: 12,
        fontFamily: "Montserrat-Regular",
    },
    submitBtn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 25,
        marginVertical: 10,
    },
    submitBtnText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: colorObj.whiteColor,
        textAlign: 'center',
        paddingVertical: 10,
    }
});