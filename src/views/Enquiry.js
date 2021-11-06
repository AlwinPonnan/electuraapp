import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj, light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import NavBar from '../components/Navbar';
import { checkNcreateChatRoom, getAllEnquiries, updateEnquiryStatusById } from '../Services/Enquiry';
import { useIsFocused } from '@react-navigation/core';

import { FAB, RadioButton } from 'react-native-paper';

import { generateImageUrl } from '../globals/utils'
import EnquiryStatuses from '../globals/EnquiryStatus';

import { loadingContext } from '../navigators/stacks/RootStack';

export default function Enquiry(props) {

    const [enquiryArr, setEnquiryArr] = useState([]);
    const Focused = useIsFocused()

    const [optionsModal, setOptionsModal] = useState(false);

    const [selectedEnquriyObj, setSelectedEnquriyObj] = useState({});

    const [selectedEnquiryStatus, setSelectedEnquiryStatus] = useState(EnquiryStatuses.OPEN);

    const [loading, setLoading] = useContext(loadingContext);

    const getYourEnquires = async () => {
        setLoading(true)
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
        setLoading(false)
    }


    const handleEnquiryStatusUpdate = async () => {
        try {

            const { data: res } = await updateEnquiryStatusById(selectedEnquriyObj._id, { enquiryStatus: selectedEnquiryStatus });
            if (res.success) {
                handleOnint()
                setOptionsModal(false)
                alert(res.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleEnquirySelection = (id) => {
        setEnquiryArr(prevState => {
            let index = prevState.findIndex(el => el._id == id);
            if (index != -1)
                prevState[index].checked = !prevState[index].checked
            return [...prevState]
        })
    }

    const handleOnint = () => {
        getYourEnquires()
    }


    const handleOptionsModal = (obj) => {
        setSelectedEnquriyObj(obj);
        setSelectedEnquiryStatus(obj.enquiryStatus)
        setOptionsModal(true)
    }


    const handleChatButtonClick = async (id) => {
        try {
            const { data: res } = await checkNcreateChatRoom(id);
            if (res.success) {
                alert(res.message)
            }
        } catch (error) {
            console.error(error)
        }
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
                                    <Pressable style={styles.enquiryListHeader} onPress={() => handleEnquirySelection(item._id)} >
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
                                            <Pressable onPress={() => { handleOptionsModal(item) }}>

                                                <Icon name="ellipsis-vertical-outline" size={20} color="#828282" />
                                            </Pressable>

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
                                    {item.checked &&

                                        <View style={styles.EnquiryContainer}>
                                            <FlatList
                                                data={item.enquiryResponses}
                                                keyExtractor={(item, index) => `${item._id}`}
                                                ListEmptyComponent={
                                                    <View style={styles.card}>
                                                        <Text style={styles.cardHeading}>No Response Found</Text>
                                                    </View>
                                                }
                                                renderItem={({ item: itemX, index: indexX }) => {
                                                    return (
                                                        <View style={styles.card}>
                                                            <View style={styles.flexRow}>
                                                                <Image source={{ uri: generateImageUrl(itemX.userObj?.profileImage) }} style={styles.cardImage} />
                                                                <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                                                                    <Text style={styles.cardHeading}>{itemX?.userObj?.name}</Text>
                                                                    <Text style={styles.cardSmallData}>{itemX?.message} . {new Date(itemX.createdAt).toDateString()},{new Date(itemX.createdAt).toLocaleTimeString()}</Text>
                                                                </View>

                                                            </View>
                                                            <Pressable onPress={() => handleChatButtonClick(itemX?.teacherId)}>

                                                                <Icon name="chatbubble-ellipses-outline" size={20} color={"black"} />
                                                            </Pressable>
                                                        </View>
                                                    )
                                                }}
                                            />
                                        </View>
                                    }

                                </>
                            )
                        }}
                    />

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={optionsModal}
                        onRequestClose={() => {
                            setOptionsModal(false);
                        }}
                    >
                        <Pressable style={styles.centeredView} onPress={() => setOptionsModal(false)}>
                            <Pressable style={styles.modalView}>
                                <Text style={styles.responseModalHeading}>Enquiry Status</Text>
                                <RadioButton.Group onValueChange={newValue => setSelectedEnquiryStatus(newValue)} value={selectedEnquiryStatus}>
                                    <View style={[{ marginVertical: 10 }, styles.flexRow, { justifyContent: 'space-between', alignItems: 'center' }]}>

                                        <Pressable onPress={() => setSelectedEnquiryStatus(EnquiryStatuses.OPEN)} style={[styles.flexRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
                                            <Text style={styles.radioText}>Open</Text>
                                            <RadioButton color={colorObj.primarColor} value={EnquiryStatuses.OPEN} />
                                        </Pressable>
                                        <Pressable onPress={() => setSelectedEnquiryStatus(EnquiryStatuses.CLOSED)} style={[styles.flexRow, { justifyContent: 'space-between', alignItems: 'center' }]}>

                                            <Text style={styles.radioText}>Close</Text>
                                            <RadioButton color={colorObj.primarColor} value={EnquiryStatuses.CLOSED} />
                                        </Pressable>

                                    </View>
                                </RadioButton.Group>
                                <Pressable style={styles.submitBtn} onPress={() => handleEnquiryStatusUpdate()}>
                                    <Text style={styles.submitBtnText}>Submit</Text>
                                </Pressable>

                            </Pressable>
                        </Pressable>
                    </Modal>
                    <FAB
                        style={styles.fab}
                        small
                        color={colorObj.whiteColor}

                        icon="plus"
                        label="General Enquiries"
                        onPress={() => props.navigation.navigate('GeneralEnquiries')}
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
        backgroundColor: "#F5F5F5",
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
        backgroundColor: "rgba(245, 245, 245, 0.6);"
    },
    cardImage: {
        height: 50,
        width: 50,
        borderRadius: 50,
        marginRight: 15
    },
    cardHeading: {
        fontFamily: 'OpenSans-SemiBold', fontSize: 15, color: '#27303E',
        marginBottom: 3,
    },
    cardSmallData: {
        fontFamily: 'OpenSans-Regular', fontSize: 10, color: '#828282'
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

    //modal styles

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.6)'

    },
    modalView: {
        margin: 20,
        width: wp(80),
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    responseModalHeading: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginVertical: 10
    },
    radioText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14
    },
    submitBtn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 25,
        marginVertical: 10
    },
    submitBtnText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: colorObj.whiteColor,
        textAlign: 'center',
        paddingVertical: 10,
    },
})