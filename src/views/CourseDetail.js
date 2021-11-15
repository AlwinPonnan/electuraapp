import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView, Linking, Button, ImageBackground } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj, light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
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

import RazorpayCheckout from 'react-native-razorpay';


import YoutubePlayer from "react-native-youtube-iframe";
export default function CourseDetail(props) {
    const [loading, setLoading] = useContext(loadingContext);

    const [courseObj, setCourseObj] = useState({});
    const navigation = useNavigation()
    const isFocused = useIsFocused();




    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr

    const [playing, setPlaying] = useState(false);

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
            Alert.alert("video has finished playing!");
        }
    }, []);

    const [watchVideo, setWatchVideo] = useState(false);

    const [youtubeVideoId, setYoutubeVideoId] = useState('');
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
                setCourseObj(res.data)
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
        try {
            let tokenObj = await getDecodedToken()
            let obj = {
                userId: tokenObj?.userId,
                courseId: courseObj?._id
            }
            console.log(obj)
            const { data: res } = await addTOWishList(obj);
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
    }


    const handleAddCourseToCart = async () => {
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


        setLoading(true)
        try {

            let decoded = await getDecodedToken()
            if (decoded) {
                let obj = {

                    userId: decoded.userId,
                    courseId: courseObj?._id
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






    const handleOnint = () => {

        getCourseById()
    }

    useEffect(() => {
        handleOnint()
    }, [isFocused])

    return (
        <ScrollView style={{ flex: 1 ,backgroundColor:colorObj.whiteColor }}>

            <View style={[styles.container]}>
                <NavBar rootProps={props} />
                <View style={[styles.innerContainer, { flex: 1 }]}>

                    <View style={[styles.flexRow, { alignItems: "center", justifyContent: "space-between", }]}>
                        <View style={[styles.flexRow]} >
                            <Text style={styles.pageHeading}>{courseObj?.name}</Text>
                            <View style={[styles.flexRow, { alignItems: "center" }]}>
                                <Text style={styles.ratingTxt}>4.2</Text>

                                <Icon name="star" size={10} color="rgba(8, 90, 78, 1)" />
                            </View>
                        </View>
                        <Pressable onPress={() => handleAddCourseToWhishlist()}>

                            <Icon name="heart-outline" size={20} color="rgba(8, 90, 78, 1)" />
                        </Pressable>
                    </View>
                    <View style={[styles.flexRow, { alignItems: "center", marginTop: 5 }]}>
                        <Image source={require("../../assets//images/user.png")} style={styles.img} />
                        <Text style={styles.userName}>{courseObj?.teacherName}</Text>
                    </View>
                    {
                        watchVideo ?

                            <YoutubePlayer
                                height={300}
                                play={playing}
                                videoId={`${youtubeVideoId}`}

                                onChangeState={onStateChange}
                            />

                            :
                            <Pressable onPress={() => { setWatchVideo(true) }}>

                                <ImageBackground source={{ uri: generateImageUrl(courseObj?.thumbnailImage?.url) }} resizeMode="cover" style={[styles.bannerimg, { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>

                                    <Icon name="play-circle-outline" size={50} color="black" />
                                </ImageBackground>
                            </Pressable>

                    }


                    <View style={[styles.flexRow, { marginVertical: 15 }]}>
                        <Text style={styles.dataItem}>4 Enrollments</Text>
                        <Text style={styles.dataItem}>{courseObj?.hours} Hours</Text>
                        <Text style={styles.dataItem}>{courseObj?.assignments} Assignments</Text>
                    </View>
                    <Text style={styles.description}>
                        {courseObj?.description}
                    </Text>
                    <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', width: wp(90), marginTop: 10, marginBottom:50,alignSelf: 'center' }]}>

                        <Pressable style={styles.btn} onPress={() => handleAddCourseToCart()}>
                            <Text style={styles.btnText}>Add to cart</Text>
                        </Pressable>
                        <Pressable style={styles.btn} onPress={() => buyPackage()}>
                            <Text style={styles.btnText}>Buy Now</Text>
                        </Pressable>
                    </View>
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
        fontSize: 13,
        color: 'grey',
        marginRight: 20,
        marginLeft: 7
    },
    btn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 10,
        // width: wp(80),
        alignSelf: "center",
        display: "flex",
        marginTop: 100,
        // position: "absolute",
        // bottom: 30,
        paddingVertical: 15,
        paddingHorizontal: 30
    },
    btnText: {
        fontFamily: 'Montserrat-SemiBold',
        color: colorObj.whiteColor,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 20,

    },
    description: { fontFamily: 'Montserrat-Regular', fontSize: 14, color: 'rgba(0,0,0,0.6)', paddingHorizontal: 8 },
})