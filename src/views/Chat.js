import { useIsFocused } from '@react-navigation/core';
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, FlatList, Pressable } from 'react-native'
import { Searchbar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { getAllChats } from '../Services/Chat';
import { generateImageUrl } from '../globals/utils'
export default function Chat(props) {

    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = query => setSearchQuery(query);
    const [chatArr, setChatArr] = useState([]);


    const focused = useIsFocused()

    const getChats = async () => {
        try {
            const { data: res } = await getAllChats();
            if (res.success) {
                console.log(JSON.stringify(res.data, null, 2))
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
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={({ item, index }) => {
                        return (
                            <Pressable onPress={() => props.navigation.navigate('SpecificChat', { chatRoomId: item.chatRoomId })} style={styles.card}>
                                <View style={styles.flexRow}>
                                    <Image source={{ uri: generateImageUrl(item?.userObj?.profileImage) }} style={styles.cardImage} />
                                    <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                                        <Text style={styles.cardHeading}>{item?.userObj?.name}</Text>
                                        
                                            <Text style={styles.cardSmallData}>{item?.lastMessage ?item?.lastMessage : ""}</Text>
                                        
                                    </View>
                                </View>
                            </Pressable>
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