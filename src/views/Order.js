import React, { useState, useEffect,useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, Modal } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { getMyOrders } from '../Services/Order';
import { useIsFocused } from '@react-navigation/core';
import { generateImageUrl } from '../globals/utils';
import { widthPercentageToDP } from 'react-native-responsive-screen';

import { loadingContext } from '../navigators/stacks/RootStack';
export default function Order(props) {

    const [ordersArr, setOrdersArr] = useState([]);
    const [isrefreshing, setIsrefreshing] = useState(false);
    const focused = useIsFocused()


    const [isLoading, setIsLoading] = useContext(loadingContext);

    const getOrders = async () => {
        setIsLoading(true)
        try {
            
            setIsrefreshing(true)
            const { data: res } = await getMyOrders();
            if (res) {
                setOrdersArr(res.data)
                setIsrefreshing(false)
            }
        } catch (error) {
            console.error(error)
            setIsrefreshing(false)
        }
        setIsLoading(false)
    }


    useEffect(() => {
        getOrders()
    }, [focused])

    const renderItem = ({ item, index }) => (
        <Pressable style={[styles.topView,]} onPress={() => props.navigation.navigate('OrderDetail', { data: item._id })}>
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
                <Text style={[styles.address, { marginTop: 5, color: '#929292', }]}>{new Date(item.createdAt).toDateString()}</Text>

                {/* <Text style={[styles.address, { marginTop: 5, color: '#929292' }]}>abc</Text> */}
                <Text style={[styles.address, { marginTop: 5, color: '#FFA949' }]}>SUMMARY</Text>
            </View>
            <View style={[styles.topView, { marginTop: -40 }]}><FontAwesome name="inr" size={12} color={'#085A4E'} />
                <Text style={[{ color: '#085A4E', marginLeft: 5, fontSize: 14, fontFamily: 'RedHatText-SemiBold', }]}>{item?.payableAmount}</Text></View>
        </Pressable>
    );

    return (
        <View style={[styles.container]}>
            <View style={{ flexDirection: 'row' }}>
                <Pressable onPress={() => props.navigation.goBack()}>

                    <AntDesign name='arrowleft' size={20} style={{ color: 'black' }} />
                </Pressable>
                <Text style={[styles.topText, { flex: 1, marginLeft: 20 }]}>Orders</Text>
                <Pressable onPress={() => props.navigation.navigate('MainTopTab')}>

                    <AntDesign name='message1' size={20} style={{ color: 'black', marginRight: 20 }} />
                </Pressable>
                <Pressable onPress={() => props.navigation.navigate('Notification')}>
                    <Feather name='bell' size={20} style={{ color: 'black' }} />
                </Pressable>
            </View>

            <FlatList
                data={ordersArr}
                refreshing={isrefreshing}
                onRefresh={()=> getOrders()}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${index}`}
                ListEmptyComponent={
                    <View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop:"25%" }}>
                        <Image source={require('../../assets/images/cart.png')} style={{ height: 200, width: 200, marginBottom: 30, }} resizeMethod='scale' resizeMode="cover" />
                        <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 20 }}>No orders found</Text>
                    </View>
                }

            />

            {/* <Pressable onPress={() => handleFilter()} style={{ justifyContent: 'flex-end', flex: 1, flexDirection: 'row' }}><AntDesign name='menu-unfold' size={30} style={{ color: '#fff', alignSelf: 'flex-end', backgroundColor: '#085A4E', padding: 15, borderRadius: 30 }} /></Pressable> */}

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 20
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

})