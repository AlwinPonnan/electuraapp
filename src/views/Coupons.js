import { useIsFocused } from '@react-navigation/core';
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, FlatList } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { getCouponsByTeacherId } from '../Services/Coupons';

export default function Coupons() {


    const focused = useIsFocused();

    const [couponsArr, setCouponsArr] = useState([]);
    const getCoupons = async () => {
        try {
            const { data: res } = await getCouponsByTeacherId();
            if (res.success) {
                setCouponsArr(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleOnit = () => {
        getCoupons()
    }



    useEffect(() => {
        handleOnit()
    }, [focused])
    return (
        <View style={[styles.container]}>
            <View style={{ padding: 20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <AntDesign name='arrowleft' size={20} style={{ color: 'black' }} />
                    <Text style={[styles.topText, { flex: 1, marginLeft: 20 }]}>Coupons</Text>
                    <AntDesign name='message1' size={20} style={{ color: 'black', marginRight: 20 }} />
                    <Feather name='bell' size={20} style={{ color: 'black' }} />
                </View>


                <View style={styles.inputView}>
                    <TextInput
                        style={styles.input}
                        placeholder="Search coupon code"
                        keyboardType="numeric"
                    />
                    <Pressable>
                        <Text style={[styles.check]}>CHECK</Text>
                    </Pressable>
                </View>
            </View>

            <FlatList
                data={couponsArr}
                ListEmptyComponent={
                    <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:18,color:'black'}}>No Coupons Found</Text>
                }
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ backgroundColor: '#F9F9F9', padding: 20 }}>
                            <View style={{ flexDirection: 'row', }}>
                                <AntDesign name='checksquare' size={18} style={{ color: '#085A4E', marginRight: 20 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={{ marginLeft: 7, color: '#085A4E', fontFamily: "RedHatText-SemiBold", borderStyle: 'dashed', borderWidth: 1, borderColor: '#085A4E', padding: 5, width: 100, textAlign: 'center' }}>{item?.code}</Text>
                                    <Text style={{ color: '#4F4F4F', fontSize: 13, fontFamily: "RedHatText-Regular", marginTop: 10 }}>Save $50</Text>
                                    <Text style={{ color: '#4F4F4F', fontSize: 13, fontFamily: "RedHatText-Regular", marginTop: 10 }}>Expires on: 09th December 202 1</Text>
                                </View>
                            </View>


                        </View>
                    )
                }}
                keyExtractor={(item, index) => `${item._id}`}

            />


            <View style={{ justifyContent: 'flex-end', flex: 1, }}>
                <View style={{ flexDirection: 'row', padding: 20 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontFamily: "RedHatText-Regular", color: 'black' }}>YOUR SAVINGS</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Feather name='dollar-sign' size={14} color={'black'} />
                            <Text style={{ fontFamily: "RedHatText-SemiBold", fontSize: 24, color: 'black' }}>1,400</Text>
                        </View>
                    </View>
                    <Pressable style={{ backgroundColor: '#085A4E', justifyContent: 'center', paddingHorizontal: 35, borderRadius: 5 }}>
                        <Text style={{ color: '#fff', fontSize: 16, fontFamily: "RedHatText-Regular" }}>APPLY</Text>
                    </Pressable>
                </View>
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        // padding:20,
        backgroundColor: '#fff',
        flex: 1,
    },
    topText: {
        fontSize: 18,
        fontFamily: 'RedHatText-SemiBold',
        //fontWeight:'500',
    },
    inputView: {
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 25,
        borderRadius: 5,
        marginTop: 70,
        borderColor: '#E0E0E0'
    },
    input: {
        width: '80%',
        fontSize: 14,
        fontFamily: 'RedHatText-Regular',
    },
    check: {
        color: '#085A4E',
        fontSize: 15,
        fontFamily: 'RedHatText-SemiBold',
    },
})