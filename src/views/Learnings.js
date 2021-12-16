import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj, light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import NavBar from '../components/Navbar';
import { useIsFocused } from '@react-navigation/core';
import { getDecodedToken, getWishlist } from '../Services/User';
import { generateImageUrl } from '../globals/utils';
import { getByUser } from '../Services/LiveClass';
import { getMyOrders } from '../Services/Order';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { checkAndStartMeeting } from '../Services/Enquiry';
import { loadingContext } from '../navigators/stacks/RootStack';
import { successAlertContext } from '../../App';

import { WebView } from 'react-native-webview';

export default function Learnings(props) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [liveClassArr, setLiveClassArr] = useState([]);
    const focused = useIsFocused()
    const [ordersArr, setOrdersArr] = useState([]);
    const [decodedObj, setDecodedObj] = useState({});

    const [isLoading, setIsLoading] = useContext(loadingContext);

    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr
    const [alertText, setAlertText] = alertTextArr

    const [productsArr, setProductsArr] = useState([
        {
            name: "Lorem Course",
            categoryName: 'Science',
            teacher: "Mr. Teacher",
            teacherImg: "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
            imgUrl: "https://images.unsplash.com/photo-1475778057357-d35f37fa89dd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti atque cum id assumenda nesciunt modi asperiores totam in vel iure?",
            courseEstimatedTime: '1hr 30min',
            active: false,
            price: 100

        },
        {
            name: "Lorem Course2",
            categoryName: 'Physics',
            teacher: "Mr. Teacher",
            teacherImg: "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
            imgUrl: "https://images.unsplash.com/photo-1497002961800-ea7dbfe18696?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1052&q=80",
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti atque cum id assumenda nesciunt modi asperiores totam in vel iure?",
            courseEstimatedTime: '1hr 30min',
            price: 100,
            active: false
        },
        {
            name: "Lorem Course3",
            categoryName: 'A.I.',
            teacher: "Mr. CBSE",
            teacherImg: "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
            imgUrl: "https://images.unsplash.com/photo-1475778057357-d35f37fa89dd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
            price: 100,

            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti atque cum id assumenda nesciunt modi asperiores totam in vel iure?",
            active: false
        },
        {
            name: "Lorem Course",
            categoryName: 'Science',
            teacher: "Mr. Teacher",
            teacherImg: "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
            imgUrl: "https://images.unsplash.com/photo-1497002961800-ea7dbfe18696?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1052&q=80",
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti atque cum id assumenda nesciunt modi asperiores totam in vel iure?",
            price: 100,

            courseEstimatedTime: '1hr 30min',
            active: false
        },
    ])



    const handleOnit = () => {
        getLiveClass()
        getOrders()
    }

    const getOrders = async () => {
        try {
            setIsRefreshing(true)
            const { data: res } = await getMyOrders();
            if (res) {
                // console.log(JSON.stringify(res.data,null,2),"adad")
                setOrdersArr(res.data)
                setIsRefreshing(false)
            }
        } catch (error) {
            console.error(error)
            setIsRefreshing(false)
        }
    }




    const getLiveClass = async () => {
        try {
            setIsRefreshing(true)
            let decodedTokenObj = await getDecodedToken();
            setDecodedObj(decodedTokenObj)
            const { data: res } = await getByUser();
            if (res.success) {
                let tempArr = res.data;

                let temp = tempArr.map(el => {
                    let obj = {
                        ...el,
                        imgUrl: "https://images.unsplash.com/photo-1497002961800-ea7dbfe18696?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1052&q=80",

                    }
                    return obj
                })
                // console.log(JSON.stringify(temp,null,2),"adad")

                setLiveClassArr(temp)
                setIsRefreshing(false)
            }
        } catch (error) {
            setIsRefreshing(false)
            console.error(error)
        }
    }

    const handleMeetingStart = async (id) => {
        setIsLoading(true)
        try {


            const { data: res } = await checkAndStartMeeting(id);
            if (res.success) {
                if (res?.data?.isZoomEnabled) {
                    props.navigation.navigate('zoomMeeting', { data: res.data, isUser: false })
                }
                else {
                    props.navigation.navigate('TestZoom')

                }
            }
        } catch (error) {
            console.error(error)
        }
        setIsLoading(false)
    }
    const handleMeetingJoin = async (obj) => {
        try {
            if (!obj?.enquiryObj?.slotObj?.meetingStarted) {
                if (obj?.enquiryObj?.slotObj?.isZoomEnabled) {
                    props.navigation.navigate('zoomMeeting', { data: obj, isUser: true })
                }
                else {
                    setIsLoading(true)
                    // handle jitsi here   
                    props.navigation.navigate('TestZoom')
                }
            }
            else {
                setAlertText("Meeting Not Started Yet!")
                setErrorAlert(true)
            }


        } catch (error) {
            console.error(error)
        }
    }


    useEffect(() => {
        handleOnit()
    }, [focused])

    const renderItem = ({ item, index }) => {
        return (
            <Pressable style={styles.cardContainer}  >
                <Image style={styles.courseImg} source={{ uri: item?.imgUrl }} />
                <View style={styles.textCardContainer}>
                    <View>
                        {decodedObj?.userId == item?.teacherId ?
                            <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                                <Text style={styles.textCardMainHeading}>{item?.userObj?.name}</Text>
                                <Pressable style={styles.btn} onPress={() => { handleMeetingStart(item?.enquiryId) }}>
                                    <Text style={styles.btnTxt}>Start</Text>
                                </Pressable>
                            </View>
                            :
                            <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                                <Text style={styles.textCardMainHeading}>{item?.userObj?.name}</Text>
                                <Pressable style={styles.btn} onPress={() => { handleMeetingJoin(item) }}>
                                    <Text style={styles.btnTxt}>Join</Text>
                                </Pressable>
                            </View>
                        }

                        <Text style={styles.textCardMainSubHeading1}>{item?.teacherObj?.name}</Text>
                        {
                            item?.day ?
                                <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                                    <Text style={styles.textCardMainSubHeading2}>{item?.day} {item?.timeslotObj?.time}</Text>
                                    {/* <Text style={styles.textCardMainSubHeading2}><Icon name="star" size={14} color={colorObj.primarColor} />4.2</Text> */}
                                </View>

                                :
                                <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                                    <Text style={styles.textCardMainSubHeading2}>Connect Now</Text>
                                    {/* <Text style={styles.textCardMainSubHeading2}><Icon name="star" size={14} color={colorObj.primarColor} />4.2</Text> */}
                                </View>

                        }
                    </View>

                </View>
            </Pressable>
        )
    }



    const renderItem2 = ({ item, index }) => (
        <Pressable style={styles.cardContainer}  >
            <Image style={styles.courseImg} source={{ uri: generateImageUrl(item?.courseObj?.thumbnailImage?.url) }} />
            <View style={styles.textCardContainer}>
                <View>

                    <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                        <Text style={styles.textCardMainHeading}>{item?.courseObj?.name}</Text>
                    </View>

                    <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                        <Text style={styles.textCardMainSubHeading2}>₹{item?.payableAmount}</Text>
                        {/* <Text style={styles.textCardMainSubHeading2}><Icon name="star" size={14} color={colorObj.primarColor} />4.2</Text> */}
                    </View>


                </View>

            </View>
        </Pressable>

    );


    return (
        <View style={styles.container}>
            <NavBar rootProps={props} />

            {/* <ScrollView> */}



            <FlatList
                data={[]}
                contentContainerStyle={{ paddingBottom: 50 }}
                renderItem={() => null}
                ListFooterComponent={
                    <>
                        <FlatList
                            // horizontal
                            scrollEnabled={false}
                            ListHeaderComponent={
                                <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }]}>
                                    <Text style={styles.headingAboveCard}>Live Sessions</Text>
                                </View>
                            }
                            onRefresh={() => getLiveClass()}
                            refreshing={isRefreshing}
                            data={liveClassArr}
                            renderItem={renderItem}
                            numColumns={2}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => `${index}`}
                            ListEmptyComponent={
                                <Text>No Classes Found</Text>
                            }
                        />



                        <FlatList
                            scrollEnabled={false}
                            data={ordersArr}
                            ListHeaderComponent={
                                <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }]}>
                                    <Text style={styles.headingAboveCard}>Courses Bought</Text>
                                </View>
                            }
                            refreshing={isRefreshing}
                            onRefresh={() => getOrders()}
                            renderItem={renderItem2}
                            numColumns={2}
                            keyExtractor={(item, index) => `${index}`}
                            ListEmptyComponent={
                                <View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: "25%" }}>
                                    <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 20, textAlign: "center" }}>You havn't bought any courses yet !!</Text>
                                </View>
                            }

                        />


                    </>
                }
            />

            {/* </ScrollView> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container2: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 20
    },

    topText2: {
        fontSize: 18,
        fontFamily: 'RedHatText-SemiBold',
        //fontWeight:'500',
    },
    topView2: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    img2: {
        width: 100,
        height: 140,
        resizeMode: 'contain',
        borderRadius: 5
    },
    listTitle2: {
        fontSize: 15,
        // fontWeight:'500',
        color: 'black',
        fontFamily: 'RedHatText-SemiBold',
    },
    address2: {
        fontSize: 12,
        // fontWeight:'400',
        color: '#828282',
        fontFamily: "RedHatText-Regular",
    },
    container: {
        backgroundColor: '#FEFEFE',
        flex: 1,
    },
    cardContainer: {
        width: wp(45),
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        borderRadius: 14,
        marginHorizontal: 10,
        marginVertical: 10,
        paddingVertical: 10,
    },
    textCardContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10

    },
    courseImg: {
        height: 100,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 14
    },
    textCardMainHeading: {
        fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#232323'
    },
    textCardMainSubHeading1: {
        fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#7E7E7E', marginTop: 2
    },
    textCardMainSubHeading2: {
        fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#000', marginTop: 15
    },
    headingAboveCard: {
        fontSize: 16, fontFamily: 'RedHatText-SemiBold', color: '#303030', paddingLeft: 13, marginTop: 10
    },
    viewAllText: {
        fontSize: 14, fontFamily: 'RedHatText-Regular', color: '#828282', paddingRight: 13, marginTop: 10
    },
    categoryContainer: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 26,
        paddingVertical: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    categoryName: {
        color: colorObj.whiteColor,
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
    },
    categoryName: {
        color: colorObj.whiteColor,
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
        paddingHorizontal: 20
    },


    img: {
        height: hp(27),
        flex: 1,
        borderRadius: 3
    },


    bottomCardContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    flexRow: {
        flexDirection: 'row',
        display: 'flex'
    },
    btn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 5,
        // width: wp(20),
        paddingHorizontal: 10,
        // height: 40,
        paddingVertical: 5,
        marginVertical: 10,
        marginLeft: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    btnTxt: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 13,
        color: "white",
        // marginTop: 15
    },


})
