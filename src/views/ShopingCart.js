import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, Modal } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { getCart } from '../Services/User';
import { useIsFocused } from '@react-navigation/core';
import { generateImageUrl } from '../globals/utils';



export default function ShoppingCart(props) {

    const [cartObj, setCartObj] = useState({});

    const focused = useIsFocused()
    const getUserCart = async () => {
        try {
            const { data: res } = await getCart();
            if (res.success) {
                console.log(res.data)
                setCartObj(res.data)
            }
        } catch (error) {
            console.error(error)
        }
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
                {/* <Text style={[styles.address, { marginTop: 5, color: '#929292' }]}>abc</Text> */}
                <Text style={[styles.address, { marginTop: 5, color: '#FFA949' }]}>{item?.courseObj.description}</Text>
            </View>
            <View style={[styles.topView, { marginTop: -40 }]}><FontAwesome name="inr" size={12} color={'#085A4E'} />
                <Text style={[{ color: '#085A4E', marginLeft: 5, fontSize: 14, fontFamily: 'RedHatText-SemiBold', }]}>{item?.courseObj?.price}</Text></View>
        </View>
    );




    return (
        <View style={[styles.container]}>
            <View style={{ padding: 20 }}><View style={{ flexDirection: 'row' }}>
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
            </View>
                <View style={{ marginTop: 20 }}>
                    <FlatList
                        data={cartObj?.courseArr}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item.courseId}`}
                        ListEmptyComponent={
                            <Text>Your cart is empty</Text>
                        }
                    />
                </View>
            </View>

            <View style={{ backgroundColor: '#F9F9F9', padding: 20 }}>
                <Text style={{ fontSize: 14, fontFamily: 'RedHatText-SemiBold', color: 'black' }}>PRICE DETAILS (2 Items)</Text>
                <View style={[styles.border]}></View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ flex: 1, fontFamily: "RedHatText-Regular", fontSize: 13, color: 'black' }}>Total MRP</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: "RedHatText-Regular", fontSize: 13, color: 'black' }}>₹ {cartObj?.courseArr?.reduce((acc, el) => acc + el.courseObj.price, 0)}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 7 }}>
                    <Text style={{ flex: 1, fontFamily: "RedHatText-Regular", fontSize: 13, color: 'black' }}>Coupon Discount</Text>
                    <Text style={{ fontFamily: "RedHatText-Regular", fontSize: 13, color: '#FFA949' }}>Apply Coupon</Text>
                </View>
                <View style={[styles.border]}></View>
                <Text style={{ fontSize: 14, fontFamily: 'RedHatText-SemiBold', color: 'black' }}>Total Amount</Text>
            </View>
            <View style={{ justifyContent: 'flex-end', flex: 1, }}>
                {/* <Text style={{ textAlign: 'center', backgroundColor: '#FFA949', paddingVertical: 5, fontSize: 14, fontFamily: "RedHatText-Regular", color: 'black' }}>2 Items selected for order</Text> */}
                <View style={{ flexDirection: 'row', padding: 20 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontFamily: "RedHatText-Regular", color: 'black' }}>PAYABLE</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <Text style={{ fontFamily: "RedHatText-SemiBold", fontSize: 24, color: 'black' }}>
                                ₹ {cartObj?.courseArr?.reduce((acc, el) => acc + el.courseObj.price, 0)}
                            </Text>
                        </View></View>
                    <Pressable onPress={() => props.navigation.navigate('OrderSummary')} style={{ backgroundColor: '#085A4E', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 5 }}><Text style={{ color: '#fff', fontSize: 16, fontFamily: "RedHatText-Regular" }}>PLACE ORDER</Text></Pressable>
                </View>
            </View>




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
    }

})