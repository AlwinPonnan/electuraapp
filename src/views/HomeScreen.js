import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView, Modal, TextInput } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj, light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import NavBar from '../components/Navbar';
import { getAllCategory } from '../Services/Category';
import { useIsFocused } from '@react-navigation/core';
import { BookmarkTeacher, getAllTeachers, getAllTeachersSubjectWise, getUser, referalSubmit } from '../Services/User';
import { imageObj } from '../globals/images';
import { getAllSubjects } from '../Services/Subjects';
import { generateImageUrl } from '../globals/utils';
import messaging from '@react-native-firebase/messaging';
import { saveTokenToDatabase } from '../Services/User';
import AllTeacher from './AllTeacher';
import { useNavigation } from '@react-navigation/core';

import { loadingContext } from '../navigators/stacks/RootStack';
import { successAlertContext } from '../../App';
export default function HomeScreen(props) {



    const [isrefreshing, setIsrefreshing] = useState(false);

    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [subjectArr, setSubjectArr] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [teachersArr, setTeachersArr] = useState([]);
    const [mainTeachersArr, setMainTeachersArr] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState({});
    const [referalCode, setReferalCode] = useState('');

    const [subjectWiseTeacherArr, setSubjectWiseTeacherArr] = useState([]);

    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr




    const [userObj, setUserObj] = useState({});

    const [categoryArr, setCategoryArr] = useState([]);

    const [isLoading, setIsLoading] = useContext(loadingContext);

    const [showReferalModal, setShowReferalModal] = useState(false);

    const handleViewAll = () => {
        navigation.navigate(AllTeacher)
    }




    const getSubjects = async () => {
        try {
            setIsrefreshing(true)
            const { data: res } = await getAllSubjects();
            if (res.success) {
                let tempArr = res.data;
                tempArr = tempArr.map(el => {
                    let obj = {
                        ...el,
                        selected: false
                    }
                    return obj
                })
                setSubjectArr([...tempArr])
                setIsrefreshing(false)
            }
        } catch (error) {
            console.error(error)
            setIsrefreshing(false)
        }
    }


    const getLoggedInUser = async () => {
        setIsLoading(true)
        setIsrefreshing(true)
        try {

            const { data: res } = await getUser();
            if (res.success) {
                let tempObj = res.data;
                if (!tempObj.referalResponseRecorded) {
                    setShowReferalModal(true)
                }
                setUserObj(res.data)
                setIsrefreshing(false)
            }
        } catch (error) {
            console.error(error)
            setIsrefreshing(false)

        }
        setIsLoading(false)
    }

    const getTeachers = async () => {

        try {
        setIsrefreshing(true)
            const { data: res } = await getAllTeachers();
            if (res.success) {
                console.log(JSON.stringify(res.data, null, 3), "teachers")
                
                setTeachersArr(res.data)
                setMainTeachersArr(res.data)
                setIsrefreshing(false)
            }

        } catch (error) {
            console.error(error)
            setIsrefreshing(false)
        }
    }

    const handleBookmarkTeacher = async (id) => {
        try {
            setIsrefreshing(true)
            const { data: res } = await BookmarkTeacher(id);
            if (res) {
                setSuccessAlert(true)
                setAlertText(`${res.message}`)
                handleOnint()
                setIsrefreshing(false)
            }

        } catch (error) {
            console.error(error)
            setIsrefreshing(false)
        }
    }

    const getSubjectWise = async () => {
        try {
            setIsrefreshing(true)
            const { data: res } = await getAllTeachersSubjectWise();
            if (res.success) {
                let tempArr = res.data;
                tempArr = tempArr.filter(el => el.userArr.length >= 1)

                setSubjectWiseTeacherArr([...tempArr])
                setIsrefreshing(false)
            }
        } catch (error) {
            console.error(error)
            setIsrefreshing(false)
        }
    }



    async function registerAppWithFCM() {
        await messaging().registerDeviceForRemoteMessages();
    }

    const handleSubmit = async (val) => {
        setShowReferalModal(false)
        setIsLoading(true)
        try {
            let obj = {
                referalCode,
                isSkipped: val == 0 ? false : true
            }
            const { data: res } = await referalSubmit(obj);
            if (res.success) {
                setShowReferalModal(false)
            }
        } catch (error) {
            console.error()
        }
        setIsLoading(false)
    }

    useEffect(() => {
        messaging()
            .getToken()
            .then(token => {
                return saveTokenToDatabase(token);
            });
        registerAppWithFCM();
    }, [])


    const handleOnint = () => {
        getLoggedInUser()
        getSubjects()
        getTeachers()
        getSubjectWise()
    }

    useEffect(() => {
        if (isFocused) {
            handleOnint()
        }
    }, [isFocused])



    const handleSubjectSelection = async (item) => {
        let tempArr = [...mainTeachersArr];
        console.log(JSON.stringify(tempArr, null, 2))
        tempArr = tempArr.filter(el => el?.enquiryObj?.classesArr?.some(ele => ele.subjectArr.some(elx => elx.subjectId == item._id)))
        setTeachersArr([...tempArr])
        setSelectedSubjectId(item._id)
        setSelectedSubject(item)
    }


    const renderItem = ({ item, index }) => {
        return (
            <Pressable style={styles.cardContainer} onPress={() => {
                props.navigation.navigate("TeacherProfile", { data: item._id })
                setIsLoading(true)
            }}>

                <View style={styles.textCardContainer}>
                    <View style={styles.teacherImgContainer}>
                        <Image style={styles.teacherImg} source={{ uri: item?.profileImage ? generateImageUrl(item?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }} />
                    </View>
                    <View>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.textCardMainHeading}>{item?.name ? item.name : item?.enquiryObj?.name}
                            </Text>
                            {
                                item.onlineToggle == true &&
                                <Text style={{ height: 8, width: 8, marginLeft: 8, backgroundColor: "#23e615", borderRadius: 50 }}></Text>
                            }
                        </View>
                        <Text style={styles.textCardMainSubHeading1}>{item?.enquiryObj?.classesArr?.reduce((acc, el) => acc + el.className + ',', '')}</Text>
                        <Text style={styles.textCardMainSubHeading2}>{item?.enquiryObj?.experience ? item?.enquiryObj?.experience : 1} Year Experience</Text>
                    </View>
                    <Pressable onPress={() => handleBookmarkTeacher(item?._id)} style={{ position: 'absolute', top: 5, right: 10 }} >
                        {item?.enquiryObj?.bookmarked ?
                            <Icon name="bookmark" size={16} color={colorObj?.primarColor} />

                            :
                            <Icon name="bookmark-outline" size={16} color={colorObj?.primarColor} />

                        }
                    </Pressable>
                </View>
            </Pressable>
        )
    }

    return (
        <View style={styles.container}>
            <NavBar rootProps={props} />
            <FlatList
                refreshing={isrefreshing}
                onRefresh={() => handleOnint()}

                scrollEnabled={true} data={[]} renderItem={() => null}
                ListHeaderComponent={
                    <>

                        <View style={styles.bannerContainer}>
                            <Image source={require('../../assets/images/Banner.png')} />
                        </View>

                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={styles.headingAboveCard}>Top Instructors</Text>
                            <Pressable  onPress={() => props.navigation.navigate('AllTeacher')}><Text style={[styles.viewAllText,{paddingHorizontal:40}]}>View All</Text></Pressable>
                        </View>
                        <FlatList
                            horizontal
                            data={subjectArr}
                            renderItem={({ item, index }) => {
                                return (
                                    <Pressable onPress={() => { handleSubjectSelection(item) }} style={[styles.categoryContainer, selectedSubjectId != item._id && { backgroundColor: '#f0faf9' }]}>
                                        {/* <Icon name="film-outline" size={14} /> */}
                                        <Text style={[styles.categoryName, selectedSubjectId != item._id && { color: '#000' }]}>{item.name}</Text>
                                    </Pressable>
                                )
                            }}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => `${index}`}
                        />
                        <FlatList
                            style={{ height: 150 }}
                            horizontal
                            data={teachersArr}
                            renderItem={renderItem}
                            ListEmptyComponent={
                                <Text style={{ fontFamily: 'Montserrat-Regular', padding: 10 }}>{selectedSubject.name ? `No teachers found for ${selectedSubject.name}` : "No teachers found"}</Text>
                            }
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => `${index}`}
                        />






                        <FlatList
                            data={subjectWiseTeacherArr}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ marginVertical: 10 }}>
                                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                                            <Text style={styles.headingAboveCard}>{item?.name} Instructors</Text>
                                            <Pressable onPress={() => props.navigation.navigate('AllTeacher')}>
                                                <Text style={[styles.viewAllText,{paddingHorizontal:40}]}>View All</Text>
                                            </Pressable>
                                        </View>
                                        <FlatList
                                            data={item?.userArr}
                                            keyExtractor={(item, index) => `${item._id}`}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            renderItem={({ item: itemX, index: indexX }) => {
                                                return (
                                                    <Pressable style={[styles.cardContainer, { marginVertical: 10, paddingVertical: 5 }]} onPress={() => props.navigation.navigate("TeacherProfile", { data: itemX._id })}>
                                                        <View style={styles.textCardContainer}>
                                                            <View style={styles.teacherImgContainer}>
                                                                <Image style={styles.teacherImg} source={{ uri: itemX?.profileImage ? generateImageUrl(itemX?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }} />
                                                            </View>
                                                            <View>
                                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                                    <Text style={styles.textCardMainHeading}>{itemX?.name ? itemX.name : itemX?.enquiryObj?.name}
                                                                    </Text>
                                                                    {
                                                                        itemX.onlineToggle == true &&
                                                                        <Text style={{ height: 8, width: 8, marginLeft: 8, backgroundColor: "#23e615", borderRadius: 50 }}></Text>
                                                                    }
                                                                </View>

                                                                <Text style={styles.textCardMainSubHeading1}>{itemX?.enquiryObj?.classesArr?.reduce((acc, el) => acc + el.className + ',', '')}</Text>
                                                                <Text style={styles.textCardMainSubHeading2}>{item?.enquiryObj?.experience ? item?.enquiryObj?.experience : 1}Year Experience</Text>
                                                            </View>
                                                            <Pressable onPress={() => handleBookmarkTeacher(itemX?._id)} style={{ position: 'absolute', top: 5, right: 10 }} >
                                                                {itemX?.enquiryObj?.bookmarked ?
                                                                    <Icon name="bookmark" size={16} color={colorObj?.primarColor} />
                                                                    :
                                                                    <Icon name="bookmark-outline" size={16} color={colorObj?.primarColor} />

                                                                }
                                                            </Pressable>
                                                        </View>
                                                    </Pressable>
                                                )
                                            }}
                                        />
                                    </View>
                                )
                            }}
                            ListEmptyComponent={
                                <Text style={{ fontFamily: 'Montserrat-Regular', padding: 10 }}>No Courses found</Text>
                            }

                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => `${index}`}
                        />







                    </>
                }
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={showReferalModal}
                onRequestClose={() => {
                    setShowReferalModal(false);
                }}
            >
                <Pressable style={styles.centeredView}>
                    <Pressable style={styles.modalView}>
                        <Text style={styles.responseModalHeading}>Welcome To Electura</Text>
                        <Text style={[styles.textInputLabel, { marginTop: 20 }]}>Enter Referal Code (if any)</Text>
                        <TextInput style={[styles.textInput]} maxLength={6} value={referalCode} onChangeText={(e) => setReferalCode(e)} />
                        <Pressable style={styles.submitBtn} onPress={() => handleSubmit(0)}>
                            <Text style={styles.submitBtnText}>Submit</Text>
                        </Pressable>
                        <Pressable style={[styles.submitBtn, { backgroundColor: 'white', borderWidth: 1, borderColor: colorObj.primarColor }]} onPress={() => handleSubmit(1)}>
                            <Text style={[styles.submitBtnText, { color: 'black' }]}>Skip</Text>
                        </Pressable>

                    </Pressable>
                </Pressable>
            </Modal>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FEFEFE',
        flex: 1,
    },
    cardContainer: {
        display: 'flex',
        width: wp(65),
        flexDirection: 'row',
        // justifyContent:"center",
        alignItems: "center",
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        position: 'relative',
        marginHorizontal: 20

    },
    textCardContainer: {
        paddingLeft: 90,
        paddingVertical: 10,
        minHeight: 90,
        marginTop: 5,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        shadowColor: "rgba(0,0,0,0.3)",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 2,
        width: '100%',
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center'
    },
    textCardMainHeading: {
        fontFamily: 'Montserrat-SemiBold', fontSize: 12, color: '#232323'
    },
    textCardMainSubHeading1: {
        fontFamily: 'Montserrat-Regular', fontSize: 10, color: '#7E7E7E', marginTop: 2
    },
    textCardMainSubHeading2: {
        fontFamily: 'Montserrat-Regular', fontSize: 10, color: '#000000', marginTop: 15
    },
    headingAboveCard: {
        fontSize: 16, fontFamily: 'RedHatText-SemiBold', color: '#303030', paddingLeft: 13, marginTop: 10
    },
    viewAllText: {
        fontSize: 14, fontFamily: 'RedHatText-Regular', color: '#828282', paddingRight: 13, marginTop: 10
    },
    categoryContainer: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 26,
        paddingVertical: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    categoryName: {
        color: colorObj.whiteColor,
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
    },
    categoryName: {
        color: colorObj.whiteColor,
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
        paddingHorizontal: 20
    },
    teacherImgContainer: {
        borderRadius: 50,
        height: 100,
        width: 100,
        left: -30,
        opacity: 1,
        backgroundColor: "white",
        borderColor: "rgba(0,0,0,0.1)",
        borderWidth: 1,
        position: "absolute",
    },
    teacherImg: {
        height: 100,
        width: 100,
        left: 0,
        position: "absolute",
        borderRadius: 100
    },

    img: {
        height: hp(27),
        flex: 1,
        borderRadius: 3
    },


    bottomCardContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    flexRow: {
        flexDirection: 'row',
        display: 'flex'
    },

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
        borderRadius: 5,
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

    submitBtn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 5,
        marginVertical: 10
    },
    submitBtnText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: colorObj.whiteColor,
        textAlign: 'center',
        paddingVertical: 10,
    },

    responseModalHeading: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginVertical: 10
    },

    //text input styles
    textInputLabel: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: '#000'
    },
    textInput: {
        backgroundColor: '#F5F6FA',
        borderRadius: 5,
        marginVertical: 10,
        width: '100%',
        fontFamily: 'OpenSans-Regular'

    },

})
