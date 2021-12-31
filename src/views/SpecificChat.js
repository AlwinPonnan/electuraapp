import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'


import { useIsFocused } from '@react-navigation/native'
import { getDecodedToken } from '../Services/User';

import { joinRoom, leaveRoom, listenToMessages, sendMessage } from '../globals/socket'
import { FlatList } from 'react-native-gesture-handler';
import { getChatHistoryByRoomId, readAllChatMessage } from '../Services/Chat';
import uuid from 'react-native-uuid';
import { colorObj } from '../globals/colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons'
import { Avatar, Badge } from 'react-native-paper';
import { generateImageUrl } from '../globals/utils';
export default function SpecificChat(props) {

    const [chatArr, setChatArr] = useState([]);

    const [chatRoomObj, setChatRoomObj] = useState({});
    const focused = useIsFocused()
    const [messageStr, setMessageStr] = useState('');

    const [chatUserObj, setChatUserObj] = useState({});
    const [tokenObj, setTokenObj] = useState({});
    const chatRoomId = props.route.params.chatRoomId


    const flatListRef = useRef()

    const getToken = async () => {
        let tempTokenObj = await getDecodedToken();
        setTokenObj(tempTokenObj)
    }

    const handleOnint = () => {
        flatListRef.current.scrollToEnd({ animated: false })
        getToken()
        getChatHistory()
        readChatMessage()
        joinRoom(chatRoomId);
        listenToMessages((data) => {
            let tempObj = { ...data, _id: uuid.v4() }
            setChatArr(prevState => {
                prevState.push(tempObj)
                return [...prevState]
            })
            readChatMessage()
            console.log("ASdADsADs")
        })

    }



    const getChatHistory = async () => {
        try {
            const { data: res } = await getChatHistoryByRoomId(chatRoomId);
            if (res.success) {
                setChatArr(res.data.chatArr)
                setChatRoomObj(res.data.chatRoomObj)
                let decodedToken = await getDecodedToken()
                console.log(JSON.stringify(res.data.chatRoomObj, null, 2))
                setChatUserObj(res.data.chatRoomObj.userArr.filter(el => el.userId != decodedToken.userId)[0])


            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleChatSend = () => {
        if (messageStr.length > 0) {
            sendMessage(chatRoomId, messageStr)
            setMessageStr("")
            flatListRef.current.scrollToEnd({ animated: false })
        }
    }

    const readChatMessage = async() => {
        try {
            const { data: res } = await readAllChatMessage(chatRoomId)
            console.log(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const renderChats = ({ item, index }) => {
        return (
            <View>
                {tokenObj?.userId == item.sentBy ?
                    <View style={styles.myChatContainer}>
                        {/* left chat */}
                        <Text style={styles.myChatText}>{item.message}</Text>

                    </View>
                    :
                    <View style={styles.othersChatContainer}>
                        {/* right chat */}
                        <Text style={styles.othersChatText}>{item.message}</Text>
                    </View>
                }

            </View>
        )
    }


    useEffect(() => {
        if (focused)
            handleOnint()
        else
            leaveRoom(chatRoomId)
        return () => leaveRoom(chatRoomId)
    }, [focused])


    return (

        <FlatList
            keyboardShouldPersistTaps="always"
            ListHeaderComponent={
                <View style={styles.container}>
                    <View style={styles.innerContainer}>

                        <View style={[styles.flexRow, { alignItems: 'center', height: hp(5) }]}>
                            <Pressable onPress={() => props.navigation.goBack()}>
                                <Icon name="chevron-back-outline" size={20} color="black" />
                            </Pressable>
                            <Pressable style={[styles.flexRow, { alignItems: 'center', paddingHorizontal: 20 }]}>
                                <Avatar.Image size={35} source={{ uri: generateImageUrl(chatUserObj.userObj?.profileImage) }} />
                                <View style={styles.userProfileContainer}>
                                    <Text style={styles.userName}>{chatUserObj?.userObj?.name}</Text>
                                    {chatUserObj?.userObj?.onlineToggle &&
                                        <View style={[styles.flexRow, { alignItems: 'center' }]}>
                                            <Text style={styles.userStatus}>Active</Text>
                                            <Badge size={8} style={{ marginHorizontal: 5, backgroundColor: colorObj.primarColor }} />
                                        </View>
                                    }
                                </View>
                            </Pressable>
                        </View>
                        <View style={styles.chatContainer}>

                            <FlatList
                                data={chatArr}
                                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: false })}
                                onLayout={() => flatListRef.current.scrollToEnd({ animated: false })}
                                ref={flatListRef}

                                keyExtractor={(item, index) => `${item._id}`}
                                renderItem={renderChats}
                            />
                        </View>
                        <View >

                            <View style={styles.searchContainer}>
                                <View style={styles.flexRowAlignCenter}>
                                    <TextInput style={styles.searchInput} multiline={true} numberOfLines={3} value={messageStr} onChangeText={(val) => setMessageStr(val)} placeholder="Message..." placeholderTextColo="#828282" />
                                </View>
                                <Pressable onPress={() => handleChatSend()}>
                                    <Icon name="send-outline" size={20} color="#828282" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>

            }
            data={[]}
            renderItem={({ item, index }) => null}

        />

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
    innerContainer: {
        width: wp(90),
        alignSelf: 'center',
        marginVertical: 20,
        position: 'relative',
        flex: 1,
        justifyContent: 'space-between'
    },
    //userProfile
    userProfileContainer: {
        marginHorizontal: 10,
    },
    userName: {
        fontFamily: 'OpenSans-Medium',
        fontSize: 12,
        color: '#27303E',
    },
    userStatus: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 10,
        color: '#828282'
    },
    searchContainer: {
        backgroundColor: "#F5F5F5",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 1,
        paddingHorizontal: 15,
        width: wp(90),

        borderRadius: 50,
        justifyContent: "space-between"
    },
    searchInput: {
        maxHeight: 80,
        width: "95%",
        borderRightColor: "rgba(0,0,0,0.2)",
        borderRightWidth: 1
    },
    flexRowAlignCenter: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    myChatContainer: {
        backgroundColor: '#F2F2F2',
        alignSelf: 'flex-end',
        display: "flex",
        width: wp(70),
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5
    },
    myChatText: {
        color: '#000',
        fontFamily: 'OpenSans-Regular'
    },
    othersChatContainer: {
        backgroundColor: colorObj.primarColor,
        alignSelf: 'flex-start',
        width: wp(70),
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5
    },
    othersChatText: {
        color: colorObj.whiteColor,
        fontFamily: 'OpenSans-Regular'
    },
    chatContainer: {
        // backgroundColor:'red',
        height: hp(80)
    }
})
