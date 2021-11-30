import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import { colorObj } from '../globals/colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import NavBar from '../components/Navbar';
import { useIsFocused } from '@react-navigation/core';
import { getAllNotifications } from '../Services/User';
import { FlatList } from 'react-native-gesture-handler';
import { generateImageUrl } from '../globals/utils';

import { loadingContext } from '../navigators/stacks/RootStack';

export default function Notification(props) {

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [notificationArr, setNotificationArr] = useState([]);

    const focused = useIsFocused()


    const [isLoading, setIsLoading] = useContext(loadingContext);

    const getNotifications = async () => {
        setIsLoading(true)
        setIsRefreshing(true)
        try {
            const { data: res } = await getAllNotifications()
            if (res.success) {
                console.log(JSON.stringify(res.data, null, 2))
                setNotificationArr(res.data)
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


    useEffect(() => {
        getNotifications()
    }, [focused])
    return (
        <>
            <View style={styles.container}>

                {/* <NavBar rootProps={props} /> */}
                <View style={styles.innerContainer}>

                    <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                        <Pressable onPress={() => props.navigation.goBack()}>
                            <Icon name="chevron-back-outline" size={20} color="black" />
                        </Pressable>
                        <Text style={styles.markAsReadText} >Mark as read</Text>
                    </View>

                    <Text style={styles.heading}>Notification</Text>


                    <FlatList
                        data={notificationArr}
                        refreshing={isRefreshing}
                        onRefresh={() => getNotifications()}
                        contentContainerStyle={{ paddingBottom: 80 }}
                        keyExtractor={(item, index) => `${item._id}`}
                        renderItem={({ item, index }) => {
                            return (

                                <View style={styles.notiCard}>
                                    <View style={[styles.flexRow, { alignItems: 'center', marginHorizontal: 5 }]}>
                                        <View>
                                            <Image style={{ height: 50, width: 50 }} source={{ uri: generateImageUrl(item?.userObj?.profileImage) }} />
                                        </View>

                                        <View style={styles.notificationInnerContainer}>
                                            <Text style={styles.cardHeading}>{item?.title}</Text>
                                            <View>

                                                <Text style={styles.cardData}>{item?.content} </Text>
                                                <Text style={styles.cardData}>{`${new Date(item?.createdAt).getDay()}/${new Date(item?.createdAt).getMonth() + 1}/${new Date(item?.createdAt).getFullYear()}`}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    {/* <Text style={[styles.cardData, { alignSelf: "flex-end", paddingRight: 20 }]}>{`${new Date(item?.createdAt).getHours()}:${new Date(item?.createdAt).getMinutes()}`}</Text> */}

                                </View>
                            )
                        }}
                    />

                </View>
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
        fontFamily: 'RedHatText-Regular',
        fontSize: 14,
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
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 20,
        marginTop: 15,
        // paddingHorizontal:10,
        // textAlign: "center",
        // display: "flex",
        // alignSelf: "center",
        color: "black",
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
        marginVertical: 10,
        padding: 15,
        // backgroundColor: 'rgba(0,0,0,0.)'
    },


    ////

    markAsReadText: {
        color: '#085A4E',
        fontFamily: 'RedHatText-Medium',
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