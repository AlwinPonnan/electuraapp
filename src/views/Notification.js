import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, Pressable, Linking } from 'react-native'
import { colorObj } from '../globals/colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from '../components/Navbar';
import { useIsFocused } from '@react-navigation/core';
import { getAllNotifications, getAllNotificationsPageWise, markNotificationAsRead } from '../Services/User';
import { FlatList } from 'react-native-gesture-handler';
import { generateImageUrl } from '../globals/utils';

import { loadingContext } from '../navigators/stacks/RootStack';

export default function Notification(props) {

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [notificationArr, setNotificationArr] = useState([]);

    const focused = useIsFocused()


    const [isLoading, setIsLoading] = useContext(loadingContext);
    const [lazyLoading, setLazyLoading] = useState(true);
    const [itemCountPerRequest, setItemCountPerRequest] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [maxPageCount, setMaxPageCount] = useState(0);

    const getNotifications = async () => {
        setIsLoading(true)
        setIsRefreshing(true)
        try {
            const { data: res } = await getAllNotifications()
            if (res.success) {
                console.log(JSON.stringify(res.data, null, 2))
                setNotificationArr(res.data.reverse())
                setIsRefreshing(false)

            }
        } catch (error) {
            console.error(error)
            setIsRefreshing(false)
            setIsLoading(false)
        }
        setIsLoading(false)
        setIsRefreshing(false)
    }


    // const getNotifications = async () => {
    //     // setIsLoading(true)
    //     setIsRefreshing(true)
    //     try {
    //         // if (lazyLoading) {

    //             const { data: res } = await getAllNotificationsPageWise(itemCountPerRequest, currentPage + 1)
    //             if (res.success) {
    //                 if (res.data.length == 0) {
    //                     setLazyLoading(false)
    //                 }
    //                 console.log(JSON.stringify(res.data, null, 2))
    //                 setCurrentPage(prevState => prevState + 1)
    //                 setNotificationArr(prevState => [...prevState, ...res.data.reverse()])
    //                 setMaxPageCount(res.totalPages)
    //                 setIsRefreshing(false)

    //             }
    //         // }
    //         // else {
    //             // console.log("lazy loading stopped")
    //         // }
    //     } catch (error) {
    //         console.error(error)
    //         setIsRefreshing(false)
    //         setIsLoading(false)
    //     }
    //     // setIsLoading(false)
    //     setIsRefreshing(false)
    // }



    const handleNotificationRedirect = async (item) => {
        setIsLoading(true)
        let { data: res } = await markNotificationAsRead(item._id)
        if (res.success) {
            if (item.redirectTo) {

                if (item.redirectTo != "") {
                    Linking.openURL(item.redirectTo)
                }
            }
        }
        setIsLoading(false)
    }


    useEffect(() => {
        if (focused) {
            getNotifications()
        }
        
        return ()=>setLazyLoading(true)
    }, [focused])
    return (
        <>
            <View style={styles.container}>

                {/* <NavBar rootProps={props} /> */}
                {/* <View style={styles.innerContainer}> */}
                <View style={{ paddingHorizontal: wp(2), marginTop: 20 }}>

                    <View style={[styles.flexRow, { alignItems: 'center' }]}>
                        <Pressable onPress={() => props.navigation.goBack()}>
                            <Icon name="chevron-back-outline" size={20} color={colorObj.primarColor} />
                        </Pressable>
                        <Text style={styles.heading}>Notification</Text>
                        {/* <Text style={styles.markAsReadText} >Mark as read</Text> */}
                    </View>


                </View>

                <FlatList
                    data={notificationArr}
                    refreshing={isRefreshing}
                    onRefresh={() => getNotifications()}
                    contentContainerStyle={{ paddingBottom: 80, marginTop: 10 }}
                    keyExtractor={(item, index) => `${index}`}
                    // onEndReached={() => getNotifications()}
                    // // removeClippedSubviews={true}
                    // initialNumToRender={6}
                    // onEndReachedThreshold={1}
                    renderItem={({ item, index }) => {
                        return (

                            <Pressable style={item.read ? styles.notiCard : styles.unreadnotiCard} onPress={() => handleNotificationRedirect(item)}>
                                <View style={[styles.flexRow, { alignItems: 'center', marginHorizontal: 5 }]}>
                                    <View>
                                        {(item?.userObj?.profileImage && item?.sentByObj?.profileImage) &&
                                            <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: generateImageUrl(item?.sentByObj?.profileImage) }} />
                                        }
                                        {(item?.userObj?.profileImage && !item?.sentByObj?.profileImage) &&
                                            <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: generateImageUrl(item?.userObj?.profileImage) }} />
                                        }
                                        {
                                            (!item?.userObj?.profileImage && !item?.sentByObj?.profileImage) &&

                                            <Image style={{ height: 50, width: 50, borderRadius: 50 }} resizeMode='contain' source={require('../../assets/images/Icon.png')} />
                                        }

                                    </View>

                                    <View style={styles.notificationInnerContainer}>
                                        <Text style={styles.cardHeading}>{item?.title}</Text>
                                        <View>

                                            <Text style={styles.cardData}>{item?.content}</Text>
                                            <Text style={styles.cardData}>{`${new Date(item?.createdAt).getDate()}/${new Date(item?.createdAt).getMonth() + 1}/${new Date(item?.createdAt).getFullYear()}`}</Text>
                                        </View>
                                    </View>
                                </View>
                                {/* <Text style={[styles.cardData, { alignSelf: "flex-end", paddingRight: 20 }]}>{`${new Date(item?.createdAt).getHours()}:${new Date(item?.createdAt).getMinutes()}`}</Text> */}

                            </Pressable>
                        )
                    }}
                />

                {/* </View> */}
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
    TeacherName: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
        color: colorObj.primarColor,
        marginTop: 15
    },
    smallTxt: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: "black",
        marginLeft: 5
    },
    description: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 13,
        color: "black",
        lineHeight: 20,
        marginTop: 8,
        marginBottom: 8,
    },
    cardHeading: {
        fontFamily: 'RedHatText-Medium',
        fontSize: 12,
        color: '#27303E',
        // marginTop: 8,
    },
    cardData: {
        fontFamily: 'RedHatText-Medium',
        fontSize: 10,
        color: "#828282",
    },

    cardTime: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 11,
        display: "flex",
        alignSelf: "flex-end",
        color: "rgba(0,0,0,0.3)",
        // marginTop: 8,
        // marginBottom: 8,
    },

    btnTxt: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 13,
        color: "white",
        // marginTop: 15
    },

    heading: {
        fontFamily: 'RedHatText-Medium',
        fontSize: 20,
        paddingHorizontal: 15,
        // marginTop: 15,
        // paddingHorizontal:10,
        // textAlign: "center",
        // display: "flex",
        // alignSelf: "center",
        color: colorObj.primarColor,
    },
    btn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 6,
        width: wp(20),
        height: 40,
        // paddingVertical: 10,
        marginVertical: 10,
        marginLeft: 40,
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
    notiCard: {
        width: wp(100),
        borderBottomColor: '#BDBDBD',
        borderBottomWidth: 0.5,
        display: 'flex',
        alignSelf: 'center',
        // marginVertical: 10,
        padding: 15,
        // backgroundColor: 'rgba(0,0,0,0.)'
    },
    unreadnotiCard: {
        width: wp(100),
        borderBottomColor: '#BDBDBD',
        borderBottomWidth: 0.5,
        display: 'flex',
        alignSelf: 'center',
        // marginVertical: 10,
        padding: 15,
        backgroundColor: '#f2f2f2'
    },


    ////

    markAsReadText: {
        color: '#085A4E',
        fontFamily: 'RedHatText-Bold',
        fontSize: 12
    },
    innerContainer: {
        width: wp(90),
        alignSelf: 'center',
        marginTop: 20
    },
    notificationInnerContainer: {
        paddingHorizontal: 10
    }


})