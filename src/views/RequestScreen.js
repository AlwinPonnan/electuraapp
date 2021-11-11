import { useIsFocused } from '@react-navigation/core';
import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, FlatList, Pressable } from 'react-native'
import { Searchbar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { successAlertContext } from '../../App';
import { colorObj } from '../globals/colors';
import { generateImageUrl } from '../globals/utils';
import { loadingContext } from '../navigators/stacks/RootStack';
import { checkNcreateChatRoom, getAllEnquiryRequests } from '../Services/Enquiry';

export default function Requestscreen(props) {


    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = query => setSearchQuery(query);

    const focused = useIsFocused()

    const [requestArr, setRequestArr] = useState([]);

    const [loading, setLoading] = useContext(loadingContext);

    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr

    const getRequests = async () => {
        try {
            const { data: res } = await getAllEnquiryRequests();
            console.log(res.data)
            if (res.success) {
                setRequestArr(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleAccept = async (id) => {
        setLoading(true)
        try {
            const { data: res } = await checkNcreateChatRoom(id);
            if (res.success) {
                setAlertText("Request Successfully Accepted")
                setSuccessAlert(true)
                props.navigation.navigate("Chat")
            }
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }


    const handleOnint = () => {
        getRequests()
    }

    useEffect(() => {
        handleOnint()
    }, [focused])


    return (
        <View style={styles.container}>
            <Searchbar
                style={styles.searchBar}
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />

            <FlatList
                data={requestArr}
                keyExtractor={(item, index) => `${item._id}`}
                renderItem={({ item, index }) => {
                    return (
                        <View style={styles.card}>
                            <View style={styles.flexRow}>
                                <Image source={{ uri: generateImageUrl(item?.userObj?.profileImage) }} style={styles.cardImage} />
                                <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                                    <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', width: wp(70) }]}>

                                        <Text style={styles.cardHeading}>{item?.userObj?.name}</Text>
                                        <Pressable onPress={() => handleAccept(item._id)}>
                                            <Text style={styles.acceptStyles}>Accept</Text>
                                        </Pressable>
                                    </View>
                                    <Text style={styles.cardSmallData}>{new Date(item?.createdAt).toDateString()}</Text>
                                </View>

                            </View>

                        </View>

                    )
                }}
            />


        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "white"
    },
    searchBar: {
        width: wp(95),
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
        fontFamily: 'Montserrat-Regular', fontSize: 15, color: '#000',
        marginBottom: 3,
    },
    cardSmallData: {
        fontFamily: 'Montserrat-Thin', fontSize: 10, color: '#000000'
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
    acceptStyles: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 12,
        color: colorObj.primarColor
    }
})