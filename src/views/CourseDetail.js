import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView, Linking, Button, ImageBackground, Modal, TextInput, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj, light_colors } from '../globals/colors';
import NavBar from '../components/Navbar';
import { getById } from '../Services/Course';
import { useIsFocused } from '@react-navigation/core';
import OrderSummary from './OrderSummary';
import { useNavigation } from '@react-navigation/core';
import { addToCart, addTOWishList, getDecodedToken } from '../Services/User';
import { successAlertContext } from '../../App';
import { loadingContext } from '../navigators/stacks/RootStack';
import { generateImageUrl } from '../globals/utils';
import { createSingleOrder, paymentCallBack } from '../Services/Order';
import { WebView } from 'react-native-webview';
import RazorpayCheckout from 'react-native-razorpay';


import Icon from 'react-native-vector-icons/Ionicons'
import { getCouponByCode } from '../Services/Coupons';

export default function CourseDetail(props) {
    const [loading, setLoading] = useContext(loadingContext);

    const [courseObj, setCourseObj] = useState({});
    const navigation = useNavigation()
    const isFocused = useIsFocused();

    const [userId, setUserId] = useState("");


    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr

    const [code, setCode] = useState('');
    const [playing, setPlaying] = useState(false);


    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [line2, setLine2] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [shippingState, setShippingState] = useState('');

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
            setSuccessAlert(true)
            setAlertText("video has finished playing!")
        }
    }, []);



    const [watchVideo, setWatchVideo] = useState(false);

    const [youtubeVideoId, setYoutubeVideoId] = useState('');

    const [couponObj, setCouponObj] = useState({});

    const [couponModal, setCouponModal] = useState(false);


    const [discountApplied, setDiscountApplied] = useState(false);



    const togglePlaying = useCallback(() => {
        setPlaying((prev) => !prev);
    }, []);

    const getCourseById = async () => {
        setLoading(true)
        try {
            const { data: res } = await getById(props.route.params.data)
            console.log(res.data.youtubeLink.split('/')[3])
            setYoutubeVideoId(res.data.youtubeLink.split('/')[3])
            if (res.success) {
                console.log(res.data)
                setCourseObj({ ...res.data, discountPrice: 0 })
            }
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }

    const handleLinkingOpen = () => {
        Linking.openURL(courseObj?.youtubeLink)
        navigation.navigate(OrderSummary)
    }


    const handleAddCourseToWhishlist = async () => {
        setLoading(true)
        try {
            let tokenObj = await getDecodedToken()
            let obj = {
                userId: tokenObj?.userId,
                courseId: courseObj?._id
            }
            console.log(obj)
            const { data: res } = await addTOWishList(obj);
            if (res.success) {
                getCourseById()
                setAlertText(res.message);
                setSuccessAlert(true)
            }
        } catch (error) {
            console.error(error)
            if (error.response.data.message) {
                setErrorAlert(true)
                setAlertText(error.response.data.message)
            }
            else {
                setErrorAlert(true)
                setAlertText(error.message)
            }
        }
        setLoading(false)
    }


    const handleAddCourseToCart = async () => {
        setLoading(true)
        try {
            let tokenObj = await getDecodedToken()
            let obj = {
                userId: tokenObj?.userId,
                courseId: courseObj?._id
            }
            console.log(obj)
            const { data: res } = await addToCart(obj);
            if (res.success) {
                setAlertText(res.message);
                setSuccessAlert(true)
            }
        } catch (error) {
            console.error(error)
            if (error.response.data.message) {
                setErrorAlert(true)
                setAlertText(error.response.data.message)
            }
            else {
                setErrorAlert(true)
                setAlertText(error.message)
            }
        }
        setLoading(false)
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
                // getCart()
                setAlertText(res.message)
                setSuccessAlert(true)
                props.navigation.navigate("PaymentSuccess")

                // alert(res.message)

            }
        } catch (error) {
            console.error(error)
        }
    }


    const buyPackage = async () => {
        setCouponModal(false)

        setLoading(true)
        try {

            let decoded = await getDecodedToken()
            if (decoded) {
                let obj = {

                    userId: decoded.userId,
                    courseId: courseObj?._id,
                    couponCode: code,
                    addressObj: {
                        line1: address,
                        line2,
                        city,
                        pincode,
                        state: shippingState
                    }
                }
                let { data: res, status: statusCode } = await createSingleOrder(obj)
                if (res) {
                    // alert(res.message);
                    handleRazorPay(res.data, res.orderId)
                }
            }
        }
        catch (err) {
            console.error(err);
            console.log(err.description);
            if (err?.response?.data?.message) {
                setAlertText(err?.response?.data?.message)
                setErrorAlert(true)
                // console.log(err?.response?.data?.message);
                // alert(err?.response?.data?.message);
            }
            else if (err.error.reason) {
                setAlertText(err.description)
                setErrorAlert(true)
                // console.error(err);
                // console.log(err.description);
            }
            else {

                setAlertText(err.message)
                setErrorAlert(true)
                // console.error(err);
                // console.log(err.description);
                // alert(err);
            }
            props.navigation.navigate('PaymentFailed')
        }
        setLoading(false)


    }


    const getCouponCode = async () => {
        setLoading(true)
        try {
            const { data: res } = await getCouponByCode(code);
            if (res.success) {
                console.log(res.data)
                setCouponObj(res.data)
                let tempObj = { ...courseObj }
                setDiscountApplied(true)
                tempObj.discountPrice = courseObj?.price * (res.data.amountOff / 100)
                setCourseObj({ ...tempObj })
            }
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }





    const handleOnint = async () => {
        let tokenObj = await getDecodedToken()

        setUserId(tokenObj?.userId)
        getCourseById()
    }

    useEffect(() => {
        if (isFocused)
            handleOnint()
        else{
            setCouponObj({})
        }
        return ()=>setCouponObj({})
    }, [isFocused])

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colorObj.whiteColor }}>

            <View style={[styles.container]}>
                <NavBar rootProps={props} />
                <View style={[styles.innerContainer, { flex: 1 }]}>

                    <View style={[styles.flexRow, { alignItems: "center", justifyContent: "space-between", }]}>
                        <View style={[styles.flexRow]} >
                            <Text style={styles.pageHeading}>{courseObj?.name}</Text>
                            <View style={[styles.flexRow, { alignItems: "center" }]}>
                                {/* { courseObj?.rating &&
                                    <>
                                        <Text style={styles.ratingTxt}>{courseObj?.rating}</Text>
                                        <Icon name="star" size={10} color="rgba(8, 90, 78, 1)" />
                                    </>
                                } */}
                            </View>
                        </View>
                        {/* <Pressable onPress={() => handleAddCourseToWhishlist()}>
                            <Icon name="heart-outline" size={20} color="rgba(8, 90, 78, 1)" />
                        </Pressable> */}
                    </View>
                    <Pressable onPress={() => props.navigation.navigate("TeacherProfile", { data: userId })} style={[styles.flexRow, { alignItems: "center", marginTop: 5, marginBottom: 5 }]}>
                        <Image source={require("../../assets//images/user.png")} style={styles.img} />
                        <Text style={styles.userName}>{courseObj?.teacherName}</Text>
                    </Pressable>
                    <Pressable style={{ marginTop: 5 }} >
                        <ImageBackground source={{ uri: generateImageUrl(courseObj?.thumbnailImage?.url) }} imageStyle={{ borderRadius: 6 }} resizeMode="cover" style={[styles.bannerimg, { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
                            {/* <Icon name="play-circle-outline" size={50} color="black" /> */}
                        </ImageBackground>
                    </Pressable>
                    {/* <View style={[styles.flexRow, { alignItems: "center" }]}>
                        <Text style={styles.ratingTxt}>4.2</Text>
                        <Icon name="star" size={10} color="rgba(8, 90, 78, 1)" />
                    </View> */}




                    <View style={[styles.flexRow, { marginVertical: 15, justifyContent: 'space-between' }]}>
                        <Text style={[styles.dataItem, { textTransform: 'capitalize' }]}> <Icon name="tv-outline" size={12} />  {courseObj?.ClassType} Mode</Text>
                        <Text style={styles.dataItem}><Icon name="time-outline" size={12} />  {courseObj?.hours} Hours</Text>
                        <Text style={styles.dataItem}><Icon name="clipboard-outline" size={12} /> {courseObj?.assignments} Assignments</Text>
                    </View>

                    <Text style={styles.coursePrice}>Description</Text>
                    <Text style={[styles.description, { marginVertical: 10 }]}>

                        {courseObj?.description}
                    </Text>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={[styles.coursePrice, { marginBottom: 10 }]}>Preview Video</Text>

                        <View style={{ flex: 1 }}>
                            {
                                isFocused &&
                                <WebView

                                    style={{ height: 250, width: wp(100) }}
                                    source={{ uri: 'https://www.youtube.com/embed/' + youtubeVideoId }}
                                />
                            }
                        </View>

                    </View>

                    <Text style={[styles.coursePrice, { fontSize: 15 }]}>
                        ₹ {courseObj?.price}
                    </Text>
                    <Pressable style={[styles.btn, { width: wp(90), marginVertical: 10 }]} onPress={() => setCouponModal(true)}>
                        <Text style={styles.btnText}>Buy Now</Text>
                    </Pressable>
                    <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', width: wp(90), marginTop: 10, marginBottom: 50, alignSelf: 'center' }]}>

                        <Pressable style={[styles.btn, { flex: 1, marginRight: 5, borderColor: colorObj.primarColor, borderWidth: 1, backgroundColor: 'white' }]} onPress={() => handleAddCourseToCart()}>
                            <Text style={[styles.btnText, { fontSize: 14, color: colorObj.primarColor }]}>Add to cart</Text>
                        </Pressable>
                        <Pressable style={[styles.btn, { flex: 1, marginLeft: 5, borderColor: colorObj.primarColor, borderWidth: 1, backgroundColor: 'white' }]} onPress={() => handleAddCourseToWhishlist()}>
                            <Text style={[styles.btnText, { fontSize: 14, color: colorObj.primarColor }]}> {courseObj?.isWishListed ? "Wishlisted" : "Add to wishlist"} </Text>
                        </Pressable>
                    </View>




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

                                    <Text style={styles.responseModalHeading}>Order Summary</Text>
                                    {courseObj?.ClassType == "offline" &&

                                        <>
                                            <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Address Line 1</Text>
                                            <TextInput style={[styles.textInput]} value={address} onChangeText={(e) => setAddress(e)} />

                                            <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Address Line 2</Text>
                                            <TextInput style={[styles.textInput]} value={line2} onChangeText={(e) => setLine2(e)} />
                                            {/* 
                                            <Text style={[styles.textInputLabel, { marginTop: 10 }]}>City</Text>
                                            <TextInput style={[styles.textInput]} value={city} onChangeText={(e) => setCity(e)} />


                                            <Text style={[styles.textInputLabel, { marginTop: 10 }]}>State</Text>
                                            <TextInput style={[styles.textInput]} value={shippingState} onChangeText={(e) => setShippingState(e)} /> */}


                                            <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Pincode</Text>
                                            <TextInput style={[styles.textInput]} maxLength={6} keyboardType="numeric" value={pincode} onChangeText={(e) => setPincode(e)} />
                                        </>
                                    }

                                    <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Enter Coupon Code (if any)</Text>
                                    <View style={styles.searchContainer}>
                                        <View style={styles.flexRowAlignCenter}>
                                            <TextInput style={styles.searchInput} placeholder="Enter Code" onChangeText={(e) => setCode(e)} placeholderTextColor="#828282" />
                                        </View>
                                        <Pressable disabled={discountApplied} onPress={() => getCouponCode()} style={[styles.flexRow, { alignItems: 'center' }]}>

                                            <Text style={styles.applyText}>{discountApplied ? "Applied" : "Apply"}</Text>
                                            {
                                                !discountApplied &&
                                                <Icon name="checkmark-outline" size={20} color="#828282" />
                                            }
                                        </Pressable>
                                        {/* <Image style={styles.searchImages} source={require('../../assets/images/Filter.png')} /> */}
                                    </View>
                                    <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]} >

                                        <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Course Amount :</Text>
                                        <Text style={[styles.textInputLabel, { marginTop: 10 }]}> ₹ {courseObj?.price}</Text>

                                    </View>
                                    {
                                        discountApplied &&
                                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]} >

                                            <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Discount Amount:{discountApplied && "(Applied)"}</Text>
                                            <Text style={[styles.textInputLabel, { marginTop: 10 }]}> ₹ {courseObj?.discountPrice}</Text>

                                        </View>
                                    }
                                    <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]} >

                                        <Text style={[styles.textInputLabel, { marginTop: 10 }]}>final Amount:</Text>
                                        <Text style={[styles.textInputLabel, { marginTop: 10 }]}> ₹ {courseObj?.price - courseObj?.discountPrice}</Text>

                                    </View>
                                    {/* <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Discount Amount : ₹ 00.00</Text>

                                    <Text style={[styles.textInputLabel, { marginTop: 10 }]}>FInal Amount : ₹ {courseObj?.price}</Text> */}


                                    <Pressable style={[styles.submitBtn, { marginTop: 20 }]} onPress={() => buyPackage()}>
                                        <Text style={styles.submitBtnText}>Submit</Text>
                                    </Pressable>
                                </ScrollView>

                            </Pressable>
                        </Pressable>
                    </Modal>
                </View>
            </View>
        </ScrollView>

    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FEFEFE',
        flex: 1,
    },
    innerContainer: {
        width: wp(95),
        alignSelf: "center",
        display: "flex",
        marginTop: 15,
        paddingHorizontal: 10,
        flexDirection: "column",
        // justifyContent: "center",
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
    pageHeading: {
        fontFamily: 'Montserrat-SemiBold', fontSize: 18, color: '#000000', marginRight: 10
    },
    ratingTxt: {
        color: "rgba(8, 90, 78, 1)",
        fontFamily: 'Montserrat-Regular',
        marginRight: 5,
        fontSize: 12
    },
    img: {
        height: 30,
        width: 30,
        borderRadius: 8,
        marginRight: 10
    },
    bannerimg: {
        display: "flex",
        alignSelf: "center",
        marginLeft: wp(2),
        marginTop: 10,
        height: 250,
        width: wp(90)
    },
    userName: {
        fontFamily: 'Montserrat-Regular', fontSize: 14, color: '#000000',

    },
    dataItem: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 11,
        color: 'grey',
        marginVertical: 5
        // marginRight: 20,
        // marginLeft: 7
    },
    btn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 5,
        alignSelf: "center",
        display: "flex",

        paddingVertical: 15,
        paddingHorizontal: 30
    },
    btnText: {
        fontFamily: 'Montserrat-SemiBold',
        color: colorObj.whiteColor,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 16,

    },
    description: { fontFamily: 'RedHatText-Regular', fontSize: 12, color: 'rgba(0,0,0,0.6)', },
    //modal styles

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
        fontSize: 18,
        fontFamily: 'RedHatText-SemiBold',
        color: '#828282'
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

