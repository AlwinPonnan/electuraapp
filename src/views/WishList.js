import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, Modal } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/core';
import { getWishlist, removeFromWishlist } from '../Services/User';
import { generateImageUrl } from '../globals/utils';
export default function WishList(props) {

    const [wishListArr, setWishListArr] = useState([]);
    const focused = useIsFocused()
    const DATA = [


    ];

    const handleOnit = () => {
        getMyWishList()
    }

    const getMyWishList = async () => {
        try {
            const { data: res } = await getWishlist();
            if (res.success) {
                let tempArr = res.data;

                let temp = tempArr.map(el => {
                    let obj = {
                        ...el,
                        imgUrl: el?.thumbnailImage?.url ? generateImageUrl(el?.thumbnailImage?.url) : "https://images.unsplash.com/photo-1497002961800-ea7dbfe18696?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1052&q=80",

                    }
                    return obj
                })
                console.log(temp)
                setWishListArr(temp)
            }
        } catch (error) {
            console.error(error)
        }
    }


    const removeProductFromWishList = async (id) => {
        try {
            const { data: res } = await removeFromWishlist(id);
            if (res.success) {
                handleOnit()
            }
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        handleOnit()
    }, [focused])


    const renderItem = ({ item }) => (
        <Pressable style={[styles.topView,]}>
            <Image
                style={[styles.img]}
                source={{ uri: item?.imgUrl }}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.listTitle]}>{item?.name}</Text>
                <Text style={[styles.address, { marginTop: 5, color: '#929292', }]}>{item?.teacherName}</Text>
                {/* <Text style={[styles.address, { marginTop: 5, color: '#929292' }]}>abc</Text> */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, }}>
                    <Pressable onPress={() => removeProductFromWishList(item?._id)}>
                        <Text style={[styles.address, { color: '#FFA949' }]}>DELETE</Text>
                    </Pressable>
                    {/* <Text style={{ marginHorizontal: 5, color: '#085A4E', fontSize: 12, }}>-</Text><Text style={{ fontSize: 12, fontFamily: "RedHatText-SemiBold", color: '#085A4E' }}>MOVE TO CART</Text> */}
                </View>
            </View>
            <View style={[styles.topView, { marginTop: -40 }]}><FontAwesome name="inr" size={12} color={'#085A4E'} />
                <Text style={[{ color: '#085A4E', marginLeft: 5, fontSize: 14, fontFamily: 'RedHatText-SemiBold', }]}>{item?.price}</Text></View>
        </Pressable>
    );

    return (
        <View style={[styles.container]}>
            <View style={{ flexDirection: 'row' }}>
                <Pressable onPress={() => props.navigation.goBack()}>

                    <AntDesign name='arrowleft' size={20} style={{ color: 'black' }} />
                </Pressable>
                <Text style={[styles.topText, { flex: 1, marginLeft: 20 }]}>Wishlist</Text>
                <AntDesign name='message1' size={20} style={{ color: 'black', marginRight: 20 }} />
                <Feather name='bell' size={20} style={{ color: 'black' }} />
            </View>

            <FlatList
                contentContainerStyle={{ marginTop: 50 }}
                data={wishListArr}
                renderItem={renderItem}
                keyExtractor={(item, index) => { return index.toString(); }}
                ListEmptyComponent={
                    <Text style={{ fontFamily: 'Montserrat-Regular', padding: 10 }}>No Data found</Text>
                }
            />
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