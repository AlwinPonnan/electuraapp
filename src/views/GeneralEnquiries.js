import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj, light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import NavBar from '../components/Navbar';
import { getAllEnquiries } from '../Services/Enquiry';
import { useIsFocused } from '@react-navigation/core';

export default function GeneralEnquiries(props) {
    const [enquiryArr, setEnquiryArr] = useState([]);
    const Focused = useIsFocused()
    const getYourEnquires = async () => {
        try {
            const { data: res } = await getAllEnquiries();
            if (res.success) {
                setEnquiryArr(res.data.map(el => {
                    let obj = {
                        ...el,
                        checked: false
                    }
                    return obj
                }))
            }
        } catch (error) {
            console.error(error)
        }
    }


    const handleOnint = () => {
        getYourEnquires()
    }


    useEffect(() => {
        handleOnint()
    }, [Focused])
    return (
        <>
            <NavBar rootProps={props} />
            <View style={styles.container}>
                <View style={styles.innerContainer}>

                    <View style={styles.flexRow}>

                        <View style={styles.searchContainer}>
                            <View style={styles.flexRowAlignCenter}>
                                <Icon name="search-outline" size={20} color="#828282" />
                                <TextInput style={styles.searchInput} placeholder="Search enquiries" placeholderTextColo="#828282" />
                            </View>
                            <Icon name="options-outline" size={20} color="#828282" />
                            {/* <Image style={styles.searchImages} source={require('../../assets/images/Filter.png')} /> */}
                        </View>

                        <TouchableOpacity style={styles.greenBtn} onPress={() => props.navigation.navigate('CreateEnquiry')}>
                            <Text style={styles.greenBtnText}>Create+</Text>
                        </TouchableOpacity>

                    </View>

                    <FlatList
                        data={enquiryArr}
                        keyExtractor={(item, index) => `${index}`}
                        ListEmptyComponent={
                            <Text>No Enquiries Found</Text>
                        }
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    <Pressable style={styles.enquiryListHeader} onPress={()=>props.navigation.navigate('EnquiryDetail',{enquiryId:item._id})} >
                                        <View style={[styles.flexRowAlignCenter, { justifyContent: "space-between" }]}>
                                            <View style={styles.flexRow}>
                                                <Text style={styles.ListHeaderName}>Enquiry {index + 1}</Text>
                                                {
                                                    item.enquiryStatus == "OPEN" &&
                                                    <Text style={[styles.ListHeaderStatus, { borderColor: "#33D18F", color: "#33D18F", borderWidth: 1, borderRadius: 3 }]}>Open</Text>
                                                }
                                                {
                                                    item.enquiryStatus == "CLOSED" &&
                                                    <Text style={[styles.ListHeaderStatus, { borderColor: "#EB5757", color: "#EB5757", borderWidth: 1, borderRadius: 3 }]}>Closed</Text>
                                                }

                                            </View>
                                            <Icon name="ellipsis-vertical-outline" size={20} color="#828282" />

                                        </View>
                                        <View style={[styles.flexRowAlignCenter, { marginTop: 7, justifyContent: "space-between" }]}>
                                            <Text style={styles.ListHeaderDescription}>
                                                {item.className},{item.subjectName},{item.topicName}
                                            </Text>
                                            <TouchableOpacity onPress={() => handleEnquirySelection(item._id)}>
                                                <Icon name="chevron-down-outline" size={20} color="#828282" />
                                            </TouchableOpacity>
                                        </View>
                                    </Pressable>


                                </>
                            )
                        }}
                    />






                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: colorObj?.primarColor
    },
    container: {
        // backgroundColor: 'red',
        backgroundColor: '#fff',
        alignItems: "center",
        flex: 1,
        paddingTop: 15,
    },
    searchContainer: {
        backgroundColor: "#edf7f7",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 1,
        paddingHorizontal: 15,
        width: wp(73),

        borderRadius: 5,
        marginRight: 10,
        justifyContent: "space-between"
    },
    searchInput: {
        width: wp(55)
    },
    flexRowAlignCenter: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },





    ////////list header starts here 
    enquiryListHeader: {
        padding: 10,
        marginTop: 10,
        marginHorizontal: 2,
        marginBottom: 2,
        backgroundColor: "white",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    ListHeaderName: {
        fontFamily: 'OpenSans-SemiBold',
        fontWeight: "600",
        marginRight: 8,
        fontSize: 16
    },
    ListHeaderStatus: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 10,
        paddingHorizontal: 5,
        paddingTop: 4,
        fontWeight: "300",
        display: "flex",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
    },
    ListHeaderDescription: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 10,
    },
    ////////list header ends here 


    ///////card starts here 
    card: {
        width: wp(95),
        // borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "#edf7f7"
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

    ///////card ends here


    greenBtn: {
        backgroundColor: "#085A4E",
        borderRadius: 8,
        paddingHorizontal: 15,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    greenBtnText: {
        fontFamily: 'OpenSans-SemiBold',
        color: "white",
        fontSize: 12,
    },
    // fontFamily: 'Montserrat-SemiBold',
})
