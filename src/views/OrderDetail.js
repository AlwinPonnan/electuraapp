import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, Modal } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { deliverOrder, dispatchOrder, getById, getMyOrders } from '../Services/Order';
import { useIsFocused } from '@react-navigation/core';
import { colorObj } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'

import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { generateImageUrl } from '../globals/utils';

import { Picker } from '@react-native-picker/picker';
import { getDecodedToken } from '../Services/User';
import { successAlertContext } from '../../App';

import { loadingContext } from '../navigators/stacks/RootStack';

export default function OrderDetail(props) {
    const [isLoading, setIsLoading] = useContext(loadingContext);
    const [orderObj, setOrderObj] = useState({});

    const focused = useIsFocused()

    const [orderStatusArr, setOrderStatusArr] = useState(["Choose", "Dispatch", "Deliver"]);
    const [selectedOrderStatus, setSelectedOrderStatus] = useState("Choose");

    const [decodedJwtToken, setDecodedJwtToken] = useState('');


    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr

    const getOrders = async () => {
        try {
            let tempOrderId = props.route.params.data
            let decodedToken = await getDecodedToken();
            setDecodedJwtToken(decodedToken)
            const { data: res } = await getById(tempOrderId);
            if (res) {
                console.log(JSON.stringify(res.data, null, 2))
                setOrderObj(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }


    const handleOrderStatusUpdate = (value) => {
        try {
            if (value == "Dispatch") {
                handleDispatchOrder()
            }
            else if (value == "Deliver") {
                handleDeliverOrder()
            }
            getOrders()
        } catch (error) {
            console.error(error)
        }
    }
    
    const handleDispatchOrder = async () => {
        setIsLoading(true)
        try {
            
            const { data: res } = await dispatchOrder(orderObj?._id)
            if (res) {
                setAlertText(res.message)
                setSuccessAlert(true)
            }
        } catch (error) {
            console.error(error)
            setAlertText(error.message)
            setErrorAlert(true)
            
        }
        setIsLoading(false)
    }

    const handleDeliverOrder = async () => {
        try {
            const { data: res } = await deliverOrder(orderObj?._id)
            if (res) {
                setAlertText(res.message)
                setSuccessAlert(true)
            }

        } catch (error) {
            console.error(error)
            setAlertText(error.message)
            setErrorAlert(true)

        }
    }


    useEffect(() => {
        getOrders()
    }, [focused])


    return (
        <View style={{ flex: 1, backgroundColor: colorObj.whiteColor }}>

            <View style={[styles.container]}>
                {/* <View style={{ flex: 1 }}> */}
                {/* </View> */}
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Pressable onPress={() => props.navigation.goBack()}>

                        <AntDesign name='arrowleft' size={20} style={{ color: 'black' }} />
                    </Pressable>
                    <Text style={[styles.topText, { flex: 1, marginLeft: 20 }]}>Summary</Text>
                    <AntDesign name='message1' size={20} style={{ color: 'black', marginRight: 20 }} />
                    <Feather name='bell' size={20} style={{ color: 'black' }} />
                </View>

                {/* <View style={{ flex: 1 }}> */}
                {/* <ProgressSteps isComplete={true} completedStepIconColor={colorObj.primarColor} completedProgressBarColor={colorObj.primarColor} activeStepIconBorderColor={colorObj.primarColor} activeLabelColor={colorObj.primarColor} labelFontFamily="RedHatText-Medium" completedLabelColor={colorObj.primarColor} activeStep={3} >
                    <ProgressStep removeBtnRow={true} label="Placed">
                        <View style={{ alignItems: 'center' }}>
                            
                        </View>
                    </ProgressStep>
                    <ProgressStep removeBtnRow={true} label="Dispatched">
                        <View style={{ alignItems: 'center' }}>
                                <Text>DISPATCHED</Text>
                            </View>
                    </ProgressStep>
                    <ProgressStep removeBtnRow={true} label="Delivered">
                        <View style={{ alignItems: 'center' }}>
                        </View>
                    </ProgressStep>
                </ProgressSteps> */}
                {/* </View> */}

                <View style={[styles.topView]}>

                    <Image
                        style={[styles.img]}
                        source={{
                            uri:
                                generateImageUrl(orderObj?.courseObj?.thumbnailImage?.url)
                        }}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={[styles.listTitle]}>{orderObj?.courseObj?.name}</Text>
                        <Text style={[styles.address, { marginTop: 5, color: '#929292', }]}>{orderObj?.statusObj?.status}</Text>
                        <Text style={[styles.address, { marginTop: 5, color: '#FFA949' }]}>SUMMARY</Text>
                    </View>
                    <View style={{ width:widthPercentageToDP(35) }}>
                        {orderObj?.teacherId == decodedJwtToken.userId ?
                            <View style={{ backgroundColor: colorObj.primarColor, borderRadius: 5 }}>

                                <Picker

                                    style={{ color: colorObj.whiteColor, }}
                                    dropdownIconColor={colorObj.whiteColor}
                                    // mode="dropdown"
                                    selectedValue={selectedOrderStatus}
                                    onValueChange={(itemValue, itemIndex) =>
                                        // setSelectedOrderStatus(itemValue)
                                        handleOrderStatusUpdate(itemValue)
                                    }>
                                    {orderStatusArr.map((el, i) => {
                                        return (
                                            <Picker.Item  key={i} label={el} value={el} />
                                        )
                                    })}

                                </Picker>
                            </View>

                            :
                            <View style={styles.topView}>
                                <Text style={[{ color: '#828282', marginLeft: 5, fontSize: 14, fontFamily: 'RedHatText-Regular', }]}>{new Date(orderObj?.createdAt).toDateString()}</Text>
                            </View>

                        }

                    </View>
                </View>




            </View>
            <View style={styles.addressBox}>
                <Text style={styles.addressHeading}>Student Details</Text>
                <View style={styles.bottomLine}></View>
                <View style={[styles.flexRow, { alignItems: 'center', marginHorizontal: 20, marginTop: 10 }]}>
                    <Icon name="call-outline" size={12} color="black" />
                    <Text style={styles.addressText}>9999999999</Text>
                </View>
                <View style={[styles.flexRow, { alignItems: 'center', marginHorizontal: 20, marginVertical: 10 }]}>
                    <Icon name="mail-outline" size={12} color="black" />
                    <Text style={styles.addressText}>sample@gmail.com</Text>
                </View>
            </View>

            <View style={[styles.addressBox, { marginVertical: 30 }]}>
                <Text style={styles.addressHeading}>Price Details</Text>
                <View style={styles.bottomLine}></View>
                <View style={[styles.flexRow, { alignItems: 'center', marginHorizontal: 20, justifyContent: 'space-between', marginTop: 10 }]}>
                    <Text style={styles.addressText}>Total Mrp</Text>

                    <Text style={styles.addressText}>₹ {orderObj?.payableAmount}</Text>
                </View>
                <View style={[styles.flexRow, { alignItems: 'center', marginHorizontal: 20, justifyContent: 'space-between', marginTop: 10 }]}>
                    <Text style={styles.addressText}>Coupon Discount</Text>

                    <Text style={styles.addressText}>₹ 0</Text>
                </View>
                <View style={styles.bottomLine}></View>
                <View style={[styles.flexRow, { alignItems: 'center', marginHorizontal: 20, justifyContent: 'space-between', marginVertical: 10 }]}>
                    <Text style={[styles.addressText, { fontFamily: 'RedHatText-SemiBold', fontSize: 14 }]}>Total Amount</Text>

                    <Text style={styles.addressText}>₹ {orderObj?.payableAmount}</Text>
                </View>

            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        // backgroundColor:'red',
        height: heightPercentageToDP(40)
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
    //address box

    addressBox: {
        backgroundColor: '#F9F9F9',

    },
    addressHeading: {
        fontFamily: 'RedHatText-Medium',
        fontSize: 14,
        color: '#000',
        marginHorizontal: 20,
        marginVertical: 20
    },
    bottomLine: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 20,
        marginTop: 10
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row'
    },
    addressText: {
        fontFamily: 'RedHatText-Regular',
        color: '#4F4F4F',
        fontSize: 12,
        paddingHorizontal: 10
    }
})