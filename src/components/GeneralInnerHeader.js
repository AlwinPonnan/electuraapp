import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, Modal, ScrollView, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { colorObj } from '../globals/colors';
import { useIsFocused } from '@react-navigation/native';
import { getAllNotifications } from '../Services/User';
import { getAllEnquiryRequests } from '../Services/Enquiry';
import { Badge } from 'react-native-paper';

export default function GeneralInnerHeader(props) {
    console.log(props.heading)
    const [requestArr, setRequestArr] = useState([]);
    const [notificationArr, setNotificationArr] = useState([]);
    const focused = useIsFocused()
    const getRequests = async () => {
        try {
            const { data: res } = await getAllEnquiryRequests();
            if (res.success) {
                setRequestArr(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getNotification = async () => {
        try {
            const { data: res } = await getAllNotifications();
            if (res.success) {
                // console.log(JSON.stringify(res.data,null,2))
                setNotificationArr([...res.data.filter(el => !el.read)])
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getRequests()
        getNotification()
    }, [focused])

    return (
        <View>
            <View style={{ flexDirection: 'row', padding: 10, backgroundColor: 'white', paddingTop: 20 }}>
                <Pressable onPress={() => props.rootProps.navigation.goBack()}>

                    <AntDesign name='arrowleft' size={20} style={{ color: 'black' }} />
                </Pressable>
                <Text style={[styles.topText, { flex: 1, marginLeft: 20 }]}>{props.heading}</Text>
                <Pressable onPress={() => props.rootProps.navigation.navigate("MainTopTab")} style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                    <AntDesign name='message1' size={20} style={{ color: 'black', marginRight: 20 }} />
                    {requestArr?.length > 0 &&
                        <Badge size={12}>{requestArr?.length}</Badge>
                    }
                </Pressable>
                <Pressable onPress={() => props.rootProps.navigation.navigate("Notification")} style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                    <Feather name='bell' size={20} style={{ color: 'black' }} />
                    {notificationArr?.length > 0 &&
                        <Badge size={12}>{notificationArr?.length}</Badge>
                    }
                </Pressable>
            </View>
        </View>
    );
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


})