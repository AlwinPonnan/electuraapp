import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, Modal } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
export default function ShoppingCart() {

    const DATA = [
        {
            id: "1",
            title: "Stock Analysis ",
            content: 'Chris Parkar',
            price: '699',
            image: 'data:image/jpeg;base64,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',
        },
        {
            id: "2",
            title: "Stock Analysis",
            content: 'Chris Parkar',
            price: '699',
            image: 'data:image/jpeg;base64,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',
        },

    ];


    const handleFilter = () => {

    }

    const renderItem = ({ item }) => (
        <View style={[styles.topView,]}>
            <Image
                style={[styles.img]}
                source={{
                    uri:
                        item.image
                }}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.listTitle]}>{item.title}</Text>
                <Text style={[styles.address, { marginTop: 5, color: '#929292', }]}>{item.content}</Text>
                <Text style={[styles.address, { marginTop: 5, color: '#929292' }]}>abc</Text>
                <Text style={[styles.address, { marginTop: 5, color: '#FFA949' }]}>SUMMARY</Text>
            </View>
            <View style={[styles.topView, { marginTop: -40 }]}><FontAwesome name="inr" size={12} color={'#085A4E'} />
                <Text style={[{ color: '#085A4E', marginLeft: 5, fontSize: 14, fontFamily: 'RedHatText-SemiBold', }]}>{item.price}</Text></View>
        </View>
    );

    return (
        <View style={[styles.container]}>
            <View style={{ padding: 20 }}><View style={{ flexDirection: 'row' }}>
                <AntDesign name='arrowleft' size={20} style={{ color: 'black' }} />
                <Text style={[styles.topText, { flex: 1, marginLeft: 20 }]}>Shopping Cart</Text>
                <AntDesign name='message1' size={20} style={{ color: 'black', marginRight: 20 }} />
                <Feather name='bell' size={20} style={{ color: 'black' }} />
            </View>
                <View>
                    <FlatList
                        data={DATA}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => { return index.toString(); }}

                    /></View></View>

            <View style={{ backgroundColor: '#F9F9F9', padding: 20 }}>
                <Text style={{ fontSize: 14, fontFamily: 'RedHatText-SemiBold', color: 'black' }}>PRICE DETAILS (2 Items)</Text>
                <View style={[styles.border]}></View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ flex: 1, fontFamily: "RedHatText-Regular", fontSize: 13, color: 'black' }}>Total MRP</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Feather name='dollar-sign' size={12} color={'black'} />
                        <Text style={{ fontFamily: "RedHatText-Regular", fontSize: 13, color: 'black' }}>1400</Text></View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 7 }}>
                    <Text style={{ flex: 1, fontFamily: "RedHatText-Regular", fontSize: 13, color: 'black' }}>Coupon Discount</Text>
                    <Text style={{ fontFamily: "RedHatText-Regular", fontSize: 13, color: '#FFA949' }}>Apply Coupon</Text>
                </View>
                <View style={[styles.border]}></View>
                <Text style={{ fontSize: 14, fontFamily: 'RedHatText-SemiBold', color: 'black' }}>Total Amount</Text>
            </View>
            <View style={{ justifyContent: 'flex-end', flex: 1, }}>
                <Text style={{ textAlign: 'center', backgroundColor: '#FFA949', paddingVertical: 5, fontSize: 14, fontFamily: "RedHatText-Regular", color: 'black' }}>2 Items selected for order</Text>
                <View style={{ flexDirection: 'row', padding: 20 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontFamily: "RedHatText-Regular", color: 'black' }}>PAYABLE</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Feather name='dollar-sign' size={14} color={'black'} />
                            <Text style={{ fontFamily: "RedHatText-SemiBold", fontSize: 24, color: 'black' }}>1400</Text></View></View>
                    <Pressable style={{ backgroundColor: '#085A4E', justifyContent: 'center', paddingHorizontal: 15, borderRadius: 5 }}><Text style={{ color: '#fff', fontSize: 16, fontFamily: "RedHatText-Regular" }}>PLACE ORDER</Text></Pressable>
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