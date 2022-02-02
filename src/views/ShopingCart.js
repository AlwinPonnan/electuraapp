import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, Modal, ScrollView, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { getCart, getDecodedToken, removeFromCart } from '../Services/User';
import { useIsFocused, useNavigation } from '@react-navigation/core';
import { generateImageUrl } from '../globals/utils';
import { widthPercentageToDP } from 'react-native-responsive-screen';


import { loadingContext } from '../navigators/stacks/RootStack';
import { successAlertContext } from '../../App';
import { createOrder, paymentCallBack } from '../Services/Order';

import RazorpayCheckout from 'react-native-razorpay';
import { colorObj } from '../globals/colors';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed';
import GeneralInnerHeader from '../components/GeneralInnerHeader';
export default function ShoppingCart(props) {
    const navigation = useNavigation()

    const [cartObj, setCartObj] = useState({});

    const focused = useIsFocused()

    const [isLoading, setIsLoading] = useContext(loadingContext);


    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)
    const [isrefreshing, setIsrefreshing] = useState(false);


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr


    const [couponModal, setCouponModal] = useState(false);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [line2, setLine2] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [shippingState, setShippingState] = useState('');


    const getUserCart = async () => {
        setIsrefreshing(true)
        setIsLoading(true)
        try {
            const { data: res } = await getCart();
            if (res.success) {
                console.log(res.data)
                setCartObj(res.data)
                setIsrefreshing(false)
            }
        } catch (error) {
            console.error(error)
            setIsrefreshing(false)
        }
        setIsLoading(false)
    }

    const handleRemoveFromCart = async (id) => {
        setIsLoading(true)
        try {
            const { data: res } = await removeFromCart(id);
            if (res.success) {
                getUserCart()
            }
        } catch (error) {
            console.error(error)
        }
        setIsLoading(false)
    }


    useEffect(() => {
        getUserCart()
    }, [focused])


    const renderItem = ({ item }) => (
        <View style={[styles.topView, { marginVertical: 10 }]}>
            <Image
                style={[styles.img]}
                source={{
                    uri:
                        generateImageUrl(item?.courseObj?.thumbnailImage?.url)
                }}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.listTitle]}>{item?.courseObj?.name}</Text>
                {/* <Text style={[styles.address, { marginTop: 5, color: '#929292', }]}>{item.content}</Text> */}
                {/* <Text style={[styles.address, { marginTop: 5, color: '#FFA949' }]}>{item?.courseObj?.description.slice(0, 50)}...</Text> */}
                <Pressable onPress={() => handleRemoveFromCart(item?.courseObj?._id)}>

                    <Text style={[styles.address, { marginTop: 5, color: '#FFA949' }]}>Remove</Text>
                </Pressable>
            </View>
            <View style={[styles.topView, { marginTop: -40 }]}><FontAwesome name="inr" size={12} color={'#085A4E'} />
                <Text style={[{ color: '#085A4E', marginLeft: 5, fontSize: 14, fontFamily: 'RedHatText-SemiBold', }]}>{item?.courseObj?.price}</Text></View>
        </View>
    );



    const handleOrderCheckForAddress = () => {
        console.log(JSON.stringify(cartObj.courseArr, null, 2))
        if (cartObj?.courseArr?.some(el => el?.courseObj?.ClassType == "offline")) {
            setCouponModal(true)
        }
        else {
            buyPackage()
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

        setCouponModal(false)

        setIsLoading(true)
        try {
            let decoded = await getDecodedToken()
            if (decoded) {
                let obj = {

                    userId: decoded.userId,
                    addressObj: {
                        line1: address,
                        line2,
                        city,
                        pincode,
                        state: shippingState
                    }
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


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {/* <View style={{ flexDirection: 'row', padding: 10, backgroundColor: 'white', paddingTop: 20 }}>
                <Pressable onPress={() => props.navigation.goBack()}>

                    <AntDesign name='arrowleft' size={20} style={{ color: 'black' }} />
                </Pressable>
                <Text style={[styles.topText, { flex: 1, marginLeft: 20 }]}>Shopping Cart</Text>
                <Pressable onPress={() => props.navigation.navigate("MainTopTab")}>
                    <AntDesign name='message1' size={20} style={{ color: 'black', marginRight: 20 }} />
                </Pressable>
                <Pressable onPress={() => props.navigation.navigate("Notification")}>
                    <Feather name='bell' size={20} style={{ color: 'black' }} />
                </Pressable>
            </View> */}
            <GeneralInnerHeader heading="Shopping Cart" rootProps={props}/>
            {cartObj?.courseArr?.length == 0
                ?
                <View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                    <Image source={require('../../assets/images/cart.png')} style={{ height: 200, width: 200, marginBottom: 30, }} resizeMethod='scale' resizeMode="cover" />
                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 20 }}>Your Cart is empty</Text>
                </View>
                :
                <>
                    <FlatList data={[]}
                        refreshing={isrefreshing}
                        onRefresh={() => getUserCart()}
                        renderItem={() => null}
                        scrollEnabled={true}
                        contentContainerStyle={{ backgroundColor: 'red' }}
                        ListHeaderComponent={

                            <View style={[styles.container]}>
                                <View style={{ padding: 20 }}>

                                    <View style={{ marginTop: 20 }}>
                                        <FlatList
                                            scrollEnabled={false}
                                            data={cartObj?.courseArr}
                                            renderItem={renderItem}
                                            keyExtractor={(item, index) => `${item.courseId}`}
                                            ListEmptyComponent={
                                                <Text>Your cart is empty</Text>
                                            }
                                            contentContainerStyle={{ backgroundColor: 'white' }}
                                        />
                                    </View>
                                </View>
                                <View style={{ backgroundColor: '#F9F9F9', padding: 20 }}>
                                    <Text style={{ fontSize: 14, fontFamily: 'RedHatText-SemiBold', color: 'black' }}>PRICE DETAILS ({cartObj?.courseArr?.length} Items)</Text>
                                    <View style={[styles.border]}></View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ flex: 1, fontFamily: "RedHatText-Regular", fontSize: 13, color: 'black' }}>Total MRP</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: "RedHatText-Regular", fontSize: 13, color: 'black' }}>₹ {cartObj?.courseArr?.reduce((acc, el) => acc + el.courseObj.price, 0)}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 7 }}>
                                        {/* <Text style={{ flex: 1, fontFamily: "RedHatText-Regular", fontSize: 13, color: 'black' }}>Coupon Discount</Text> */}
                                        {/* <Text style={{ fontFamily: "RedHatText-Regular", fontSize: 13, color: '#FFA949' }}>Apply Coupon</Text> */}
                                    </View>
                                    <View style={[styles.border]}></View>
                                    <Text style={{ fontSize: 14, fontFamily: 'RedHatText-SemiBold', color: 'black' }}>Total Amount</Text>
                                </View>





                            </View>
                        }

                    />
                    <View style={{ backgroundColor: 'white' }}>
                        {/* <Text style={{ textAlign: 'center', backgroundColor: '#FFA949', paddingVertical: 5, fontSize: 14, fontFamily: "RedHatText-Regular", color: 'black' }}>2 Items selected for order</Text> */}
                        <View style={{ flexDirection: 'row', padding: 20 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 13, fontFamily: "RedHatText-Regular", color: 'black' }}>PAYABLE</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <Text style={{ fontFamily: "RedHatText-SemiBold", fontSize: 24, color: 'black' }}>
                                        ₹ {cartObj?.courseArr?.reduce((acc, el) => acc + el.courseObj.price, 0)}
                                    </Text>
                                </View></View>

                            <Pressable disabled={cartObj?.courseArr?.length == 0} onPress={() => handleOrderCheckForAddress()} style={cartObj?.courseArr?.length == 0 && { backgroundColor: 'gray' }, { backgroundColor: '#085A4E', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 5 }}>
                                <Text style={{ color: '#fff', fontSize: 16, fontFamily: "RedHatText-Regular" }}>PLACE ORDER</Text>
                            </Pressable>
                        </View>
                    </View>
                </>
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={couponModal}
                onRequestClose={() => {
                    setCouponModal(false);
                }}
            >
                <Pressable style={styles.centeredView} onPress={() => setCouponModal(false)}>
                    <Pressable style={styles.modalView}>
                        <ScrollView>

                            <Text style={styles.responseModalHeading}>Shipping address</Text>

                            <>
                                <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Address Line 1</Text>
                                <TextInput style={[styles.textInput]} value={address} onChangeText={(e) => setAddress(e)} />

                                <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Address Line 2</Text>
                                <TextInput style={[styles.textInput]} value={line2} onChangeText={(e) => setLine2(e)} />

                                <Text style={[styles.textInputLabel, { marginTop: 10 }]}>City</Text>
                                <TextInput style={[styles.textInput]} value={city} onChangeText={(e) => setCity(e)} />


                                <Text style={[styles.textInputLabel, { marginTop: 10 }]}>State</Text>
                                <TextInput style={[styles.textInput]} value={shippingState} onChangeText={(e) => setShippingState(e)} />


                                <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Pincode</Text>
                                <TextInput style={[styles.textInput]} maxLength={6} keyboardType="numeric" value={pincode} onChangeText={(e) => setPincode(e)} />
                            </>


                            <Pressable style={[styles.submitBtn, { marginTop: 20 }]} onPress={() => buyPackage()}>
                                <Text style={styles.submitBtnText}>Submit</Text>
                            </Pressable>
                        </ScrollView>

                    </Pressable>
                </Pressable>
            </Modal>


        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        // padding:20
    },

    topText: {
        fontSize: 18,
        fontFamily: 'RedHatText-SemiBold',
        //fontWeight:'500',
    },
    topView: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    img: {
        width: 100,
        height: 140,
        resizeMode: 'contain',
        borderRadius: 5
    },
    listTitle: {
        fontSize: 15,
        // fontWeight:'500',
        color: 'black',
        fontFamily: 'RedHatText-SemiBold',
    },
    address: {
        fontSize: 12,
        // fontWeight:'400',
        color: '#828282',
        fontFamily: "RedHatText-Regular",
    },
    border: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginVertical: 7
    },


    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.6)'

    },
    modalView: {
        margin: 20,
        width: wp(90),
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    responseModalHeading: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginVertical: 10
    },
    radioText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14
    },
    submitBtn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 5,
        marginVertical: 10
    },
    submitBtnText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: colorObj.whiteColor,
        textAlign: 'center',
        paddingVertical: 10,
    },
    //text input styles
    textInputLabel: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: '#000'
    },
    textInput: {
        backgroundColor: '#F5F6FA',
        borderRadius: 5,
        marginVertical: 10,
        width: '100%',
        fontFamily: 'OpenSans-Regular'

    },


    coursePrice: {
        fontSize: 20,
        fontFamily: 'Montserrat-SemiBold',
        color: 'black'
    },
    searchContainer: {
        backgroundColor: "#F5F5F5",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 1,
        paddingHorizontal: 15,
        width: wp(73),

        borderRadius: 5,
        marginRight: 10,
        justifyContent: "space-between"
    },
    searchInput: {
        width: wp(55)
    },
    flexRowAlignCenter: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },

    applyText: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular'
    }

})