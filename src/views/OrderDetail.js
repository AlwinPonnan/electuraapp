import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, Modal } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { deliverOrder, dispatchImage, dispatchOrder, getById, getMyOrders } from '../Services/Order';
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
import DocumentPicker from 'react-native-document-picker'

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

    const [activeStepper, setActiveStepper] = useState(0);


    const [dispatchImageFile, setDispatchImageFile] = useState();

    const pickImg = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.images],
            })
            console.log(
                res.uri,
                res.type, // mime type
                res.name,
                res.size,
            )
            setDispatchImageFile(res)
            handleDispatchOrder()


        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err
            }
        }
    }


    const getOrders = async () => {
        try {
            let tempOrderId = props.route.params.data
            let decodedToken = await getDecodedToken();
            setDecodedJwtToken(decodedToken)
            const { data: res } = await getById(tempOrderId);
            if (res) {
                let tempObj = res.data;
                if (tempObj?.statusObj?.status == "PLACED") {
                    setActiveStepper(1)
                }
                else if (tempObj?.statusObj?.status == "DISPATCHED") {
                    setActiveStepper(2)
                }
                else if (tempObj?.statusObj?.status == "DELIVERED") {
                    setActiveStepper(3)
                }

                setOrderObj(tempObj)
                console.log(JSON.stringify(res.data, null, 2))


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
                let formData = new FormData()
                formData.append('file', dispatchImageFile)
                const { data: response } = await dispatchImage(orderObj?._id, formData)
                getOrders()
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
        setIsLoading(true)
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
        setIsLoading(false)
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
                    <Pressable onPress={() => props.navigation.navigate('MainTopTab')}>

                        <AntDesign name='message1' size={20} style={{ color: 'black', marginRight: 20 }} />
                    </Pressable>
                    <Pressable onPress={() => props.navigation.navigate('Notification')}>

                        <Feather name='bell' size={20} style={{ color: 'black' }} />
                    </Pressable>
                </View>

                {orderObj?.teacherId != decodedJwtToken.userId &&

                    <ProgressSteps isComplete={activeStepper == 3} completedStepIconColor={colorObj.primarColor} completedProgressBarColor={colorObj.primarColor} activeStepIconBorderColor={colorObj.primarColor} activeLabelColor={colorObj.primarColor} labelFontFamily="RedHatText-Medium" completedLabelColor={colorObj.primarColor} activeStep={activeStepper} >
                        <ProgressStep removeBtnRow={true} label="Placed">
                            <View style={{ alignItems: 'center' }}>
                                <Text></Text>
                            </View>
                        </ProgressStep>
                        <ProgressStep removeBtnRow={true} label="Dispatched">
                            <View style={{ alignItems: 'center' }}>
                                <Text></Text>
                            </View>
                        </ProgressStep>
                        <ProgressStep removeBtnRow={true} label="Delivered">
                            <View style={{ alignItems: 'center' }}>
                                <Text></Text>
                            </View>
                        </ProgressStep>
                    </ProgressSteps>
                }
                {/* <View style={{ flex: 1 }}> */}
                {/* </View> */}

                <View style={[styles.topView, { marginTop: 50 }]}>

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
                    {/* <View style={{ width: widthPercentageToDP(35) }}> */}


                    {orderObj?.teacherId == decodedJwtToken.userId ?
                        // <View >

                        //     <Picker


                        //         dropdownIconColor={colorObj.whiteColor}
                        //         // mode="dropdown"
                        //         selectedValue={selectedOrderStatus}
                        //         onValueChange={(itemValue, itemIndex) =>
                        //             // setSelectedOrderStatus(itemValue)
                        //             handleOrderStatusUpdate(itemValue)
                        //         }>
                        //         {orderStatusArr.map((el, i) => {
                        //             return (
                        //                 <Picker.Item  key={i} label={el} value={el} />
                        //             )
                        //         })}

                        //     </Picker>
                        // </View>
                        <View>
                            {orderObj?.statusObj?.status == "PLACED" &&
                                <Pressable style={{ backgroundColor: colorObj.primarColor, borderRadius: 5 }} onPress={() => pickImg()}>
                                    <Text style={{ color: colorObj.whiteColor, textAlign: 'center', fontFamily: 'RedHatText-Regular', paddingHorizontal: 20, paddingVertical: 5 }}>Dispatch</Text>
                                </Pressable>
                            }
                            {/* {orderObj?.statusObj?.status == "DISPATCHED" &&
                                <Pressable style={{ backgroundColor: colorObj.primarColor, borderRadius: 5 }} onPress={() => handleDeliverOrder()}>
                                    <Text style={{ color: colorObj.whiteColor, textAlign: 'center', fontFamily: 'RedHatText-Regular', paddingHorizontal: 20, paddingVertical: 5 }}>Deliver</Text>
                                </Pressable>
                            } */}
                            {orderObj?.statusObj?.status == "DELIVERED" &&
                                <Pressable style={{ backgroundColor: colorObj.primarColor, borderRadius: 5 }}>
                                    <Text style={{ color: colorObj.whiteColor, textAlign: 'center', fontFamily: 'RedHatText-Regular', paddingHorizontal: 20, paddingVertical: 5 }}>Delivered</Text>
                                </Pressable>
                            }

                        </View>

                        :
                        <>
                            {orderObj?.statusObj?.status == "DISPATCHED" ?
                                <Pressable style={{ backgroundColor: colorObj.primarColor, borderRadius: 5 }} onPress={() => handleDeliverOrder()}>
                                    <Text style={{ color: colorObj.whiteColor, textAlign: 'center', fontFamily: 'RedHatText-Regular', paddingHorizontal: 20, paddingVertical: 5 }}>Mark Delivered</Text>
                                </Pressable>
                                :
                                <View style={styles.topView}>
                                    <Text style={[{ color: '#828282', marginLeft: 5, fontSize: 14, fontFamily: 'RedHatText-Regular', }]}>{new Date(orderObj?.createdAt).toDateString()}</Text>
                                </View>
                            }
                        </>

                    }

                    {/* </View> */}
                </View>




            </View>
            <View style={styles.addressBox}>
                <Text style={styles.addressHeading}>Student Details</Text>
                <View style={styles.bottomLine}></View>
                <View style={[styles.flexRow, { alignItems: 'center', marginHorizontal: 20, marginTop: 10 }]}>
                    <Icon name="call-outline" size={12} color="black" />
                    <Text style={styles.addressText}>{orderObj?.userDetails?.phone}</Text>
                </View>
                <View style={[styles.flexRow, { alignItems: 'center', marginHorizontal: 20, marginVertical: 10 }]}>
                    <Icon name="mail-outline" size={12} color="black" />
                    <Text style={styles.addressText}>{orderObj?.userDetails?.email}</Text>
                </View>
            </View>

            <View style={[styles.addressBox, { marginVertical: 30 }]}>
                <Text style={styles.addressHeading}>Price Details</Text>
                <View style={styles.bottomLine}></View>
                <View style={[styles.flexRow, { alignItems: 'center', marginHorizontal: 20, justifyContent: 'space-between', marginTop: 10 }]}>
                    <Text style={styles.addressText}>Total Mrp</Text>

                    <Text style={styles.addressText}>₹ {orderObj?.subTotalAmount}</Text>
                </View>
                <View style={[styles.flexRow, { alignItems: 'center', marginHorizontal: 20, justifyContent: 'space-between', marginTop: 10 }]}>
                    <Text style={styles.addressText}>Coupon Discount</Text>

                    <Text style={styles.addressText}>₹ {orderObj?.discountedAmountByCoupon}</Text>
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