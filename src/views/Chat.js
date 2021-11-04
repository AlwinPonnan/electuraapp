import { useIsFocused } from '@react-navigation/core';
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, FlatList } from 'react-native'
import { Searchbar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { getAllChats } from '../Services/Chat';

export default function Chat() {

    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = query => setSearchQuery(query);
    const [chatArr, setChatArr] = useState([]);


    const focused = useIsFocused()

    const getChats = async () => {
        try {
            const { data: res } = await getAllChats();
            if (res.success) {
                setChatArr(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }


    const handleOnint = () => {
        getChats()
    }

    useEffect(() => {
        handleOnint()
    }, [focused])



    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>

                <Searchbar
                    style={styles.searchBar}
                    placeholder="Search"
                    inputStyle={{ fontFamily: 'OpenSans-Regular', fontSize: 14 }}
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />

                <FlatList
                    data={chatArr}
                    keyExtractor={(item, index) => `${item._id}`}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={styles.card}>
                                <View style={styles.flexRow}>
                                    <Image source={require("../../assets/images/user.png")} style={styles.cardImage} />
                                    <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                                        <Text style={styles.cardHeading}>Ishaan Sharma</Text>
                                        <Text style={styles.cardSmallData}>The course price will be 600 . 52m ago</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                />
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1
    },
    innerContainer: {
        width: wp(90),
        // paddingHorizontal:20,
        // backgroundColor:'red',
        alignSelf: 'center'
    },
    searchBar: {
        width: '100%',
        display: "flex",
        alignSelf: "center",
        borderRadius: 10,
        marginVertical: 15,
        fontSize: 11,
        backgroundColor: "rgba(245, 245, 245, 1)",
        borderColor: "transparent",
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
        fontFamily: 'OpenSans-Regular'
    },



    card: {
        width: wp(95),
        borderRadius: 10,
        padding: 8,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",

    },
    cardImage: {
        height: 50,
        width: 50,
        borderRadius: 50,
        marginRight: 15
    },
    cardHeading: {
        fontFamily: 'OpenSans-Regular', fontSize: 15, color: '#27303E',
        marginBottom: 3,
    },
    cardSmallData: {
        fontFamily: 'OpenSans-Light', fontSize: 10, color: '#828282'
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
})