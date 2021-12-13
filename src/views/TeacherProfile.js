import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ImageBackground, TouchableHighlight, FlatList, ScrollView, Modal, TextInput, Linking } from 'react-native';
import NavBar from '../components/Navbar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { colorObj } from '../globals/colors';
import { RadioButton } from 'react-native-paper';

import Swipeable from 'react-native-swipeable';
import { useIsFocused } from '@react-navigation/core';
import { getById, getDecodedToken } from '../Services/User';
import { generateImageUrl } from '../globals/utils';
import { getByCoursesUserId } from '../Services/Course';

import { Rating, AirbnbRating } from 'react-native-ratings';
import { addNewFeedBack, getAllFeedBacksByTeacherId } from '../Services/TeacherFeedBack';
import { successAlertContext } from '../../App';
import { loadingContext } from '../navigators/stacks/RootStack';
import EnquiryTypes from '../globals/EnquiryTypes';
import { NewEnquiry } from '../Services/Enquiry';


import RBSheet from "react-native-raw-bottom-sheet";
import { Picker } from '@react-native-picker/picker';

export default function TeacherProfile(props) {


    const [isLoading, setIsLoading] = useContext(loadingContext);
    const refRBSheet = useRef();

    const [checked, setChecked] = useState(EnquiryTypes.ONETOONE);

    const focused = useIsFocused()

    const [coursesArr, setCoursesArr] = useState([]);

    const [teacherObj, setTeacherObj] = useState({});

    const [rating, setRating] = useState(3);

    const [responseMessage, setResponseMessage] = useState('');

    const [responseModal, setResponseModal] = useState(false);


    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr


    const [feedBackArr, setFeedBackArr] = useState([]);

    const [decodedObj, setDecodedObj] = useState({});

    const [additionalMessage, setAdditionalMessage] = useState('');

    const [selectedSlotDay, setSelectedSlotDay] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    const [selectedDayId, setSelectedDayId] = useState('');
    const [selectedTimeSlotObj, setSelectedTimeSlotObj] = useState({});
    const [slotsArr, setSlotsArr] = useState([]);
    const leftContent = () => {
        return (
            <Pressable style={styles.btn} >
                <Text style={styles.btnTxt}>Enquire</Text>
            </Pressable>
        )
    };


    const openFaceBook = (name) => {
        if (name != "") {

            Linking.canOpenURL(`fb://profile/${name}`).then(supported => {
                if (supported) {
                    return Linking.openURL(`fb://profile/${name}`);
                } else {
                    return Linking.openURL(`fb://profile/${name}`);
                }
            })
        }
        else if (name == "" && teacherObj?.role == "TEACHER" && teacherObj?._id == decodedObj?.userId) {
            props.navigation.navigate('AccountEdit')
        }
    }
    const openYoutube = (name) => {
        if (name != "") {

            Linking.canOpenURL('vnd.youtube://channel/' + name).then(supported => {
                if (supported) {
                    return Linking.openURL('vnd.youtube://channel/' + name);
                } else {
                    return Linking.openURL('https://www.youtube.com/channel/' + name);
                }
            });
        }
        else if (name == "" && teacherObj?.role == "TEACHER" && teacherObj?._id == decodedObj?.userId) {
            props.navigation.navigate('AccountEdit')
        }
    }

    const openInsta = (name) => {
        if (name != "") {

            Linking.canOpenURL(`https://instagram.com/_u/${name}`).then(supported => {
                if (supported) {
                    return Linking.openURL(`https://instagram.com/_u/${name}`);
                } else {
                    return Linking.openURL(`https://instagram.com/_u/${name}`);
                }
            })
        }
        else if (name == "" && teacherObj?.role == "TEACHER" && teacherObj?._id == decodedObj?.userId) {
            props.navigation.navigate('AccountEdit')
        }
    }

    const handleOnint = () => {
        getTeacher()
        getCourses()
        getAllFeedBacks()
    }

    const getTeacher = async () => {
        setIsLoading(true)
        try {
            let decodedTokenObj = await getDecodedToken();
            setDecodedObj(decodedTokenObj)
            let userId = props.route.params.data;
            const { data: res } = await getById(userId)
            // console.log(JSON.stringify(res.data.enquiryObj.facebookLink, null, 2), "teacher data")
            if (res.success) {
                let tempObj = res.data;
                tempObj.enquiryObj.timeslots = tempObj?.enquiryObj?.timeslots?.filter(el => el.slotArr.length > 0)
                console.log(tempObj.enquiryObj.timeslots)
                setTeacherObj({ ...tempObj })
            }
        } catch (error) {
            console.error(error)
        }
        setIsLoading(false)
    }


    const getCourses = async () => {
        try {
            let userId = props.route.params.data;
            const { data: res } = await getByCoursesUserId(userId)
            // console.log(JSON.stringify(res.data, null, 2))
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
                setCoursesArr(temp)
            }
        } catch (error) {
            console.error(error)
        }
    }


    const renderCourseItem = ({ item, index }) => {
        return (
            <Pressable style={styles.cardContainer} onPress={() => props.navigation.navigate("CourseDetail", { data: item._id })} >
                <Image style={styles.courseImg} source={{ uri: item?.imgUrl }} />
                <View style={styles.textCardContainer}>
                    <View>

                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={styles.textCardMainHeading}>{item?.name}</Text>
                            <Icon name="heart-outline" size={14} color={colorObj.primarColor} />
                        </View>
                        <Text style={styles.textCardMainSubHeading1}>{item?.teacherName}</Text>
                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={styles.textCardMainSubHeading2}>₹{item?.price}</Text>
                            <Text style={styles.textCardMainSubHeading2}><Icon name="star" size={14} color={colorObj.primarColor} />{item?.rating ? item?.rating : 3}</Text>
                        </View>
                    </View>

                </View>
            </Pressable>
        )
    }


    const handleSubmitFeedBack = async () => {
        setResponseModal(false)
        setIsLoading(true)
        try {
            let obj = {
                rating,
                message: responseMessage,
                teacherId: teacherObj._id
            }
            const { data: res } = await addNewFeedBack(obj)
            if (res.success) {
                getAllFeedBacks()
                setAlertText(res.message)
                setSuccessAlert(true)
            }
        } catch (error) {
            if (error.response.data.message) {
                setErrorAlert(true)
                setAlertText(error.response.data.message)
            }
            else {
                setErrorAlert(true)
                setAlertText(error.message)
            }
        }
        setIsLoading(false)
    }

    const handleDaySelect = (day) => {
        let tempArr = [...teacherObj.enquiryObj.timeslots];
        let dayIndex = tempArr.findIndex(el => el.day == day);
        if (dayIndex != -1) {
            setSlotsArr([...tempArr[dayIndex].slotArr])
        }
    }

    const getAllFeedBacks = async () => {
        try {
            let userId = props.route.params.data;
            const { data: res } = await getAllFeedBacksByTeacherId(userId);
            console.log(JSON.stringify(res.data, null, 2))
            if (res.success) {
                let tempArr = res.data;
                tempArr = tempArr.map(el => {
                    let obj = {
                        ...el,
                        ratingArr: Array(el.rating).fill(1)
                    }

                    return obj
                })
                setFeedBackArr([...tempArr])
            }
        } catch (error) {
            console.error(error)
        }
    }


    const handleEnquireNow = async () => {
        setIsLoading(true)
        refRBSheet.current.close()
        try {
            if (checked == EnquiryTypes.SLOT) {
                // console.log()
                let obj = {
                    classId: '',
                    subjectId: '',
                    topicId: '',
                    region: '',
                    ClassType: '',
                    gender: '',
                    price: '',
                    slotObj: {
                        day: selectedSlotDay,
                        timeSlotObj: slotsArr.find(el=>el.time==selectedTimeSlot)
                    },
                    specificRequirement: '',
                    enquiryType: checked,
                    teacherId: teacherObj?._id,
                    additionalMessage
                }
                console.log(obj)
                let { data: res } = await NewEnquiry(obj);
                if (res.success) {
                    setSuccessAlert(true)
                    setAlertText(res.message)
                    // alert(res.message)
                }
            }
            else {
                let obj = {
                    classId: '',
                    subjectId: '',
                    topicId: '',
                    region: '',
                    ClassType: '',
                    gender: '',
                    price: '',
                    specificRequirement: '',
                    enquiryType: checked,
                    teacherId: teacherObj?._id,
                    additionalMessage
                }
                let { data: res } = await NewEnquiry(obj);
                if (res.success) {
                    setSuccessAlert(true)
                    setAlertText(res.message)
                    // alert(res.message)
                }
            }

        } catch (error) {
            console.log(error)
            setErrorAlert(true)
            setAlertText(error.message)

        }
        setIsLoading(false)
    }


    useEffect(() => {
        handleOnint()
    }, [focused])

    return (
        <ScrollView scrollEnabled={true} contentContainerStyle={{ backgroundColor: colorObj.whiteColor }}>
            <NavBar rootProps={props} />
            <ImageBackground resizeMode="cover" source={require('../../assets/images/teacherBackBanner.png')} style={{ width: wp(100), height: hp(15) }}>

                <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', width: wp(25), position: 'absolute', bottom: 10, right: 20 }]}>
                    <Pressable onPress={() => openInsta(teacherObj?.enquiryObj?.instagramLink)}>
                        <Icon name="logo-instagram" size={25} color={colorObj.whiteColor} />
                    </Pressable>
                    <Pressable onPress={() => openFaceBook(teacherObj?.enquiryObj?.facebookLink)}>
                        <Icon name="logo-facebook" size={25} color={colorObj.whiteColor} />
                    </Pressable>
                    <Pressable onPress={() => openYoutube(teacherObj?.enquiryObj?.youtubeLink)}>
                        <Icon name="logo-youtube" size={25} color={colorObj.whiteColor} />
                    </Pressable>
                </View>

            </ImageBackground>
            <View style={[styles.flexRow, { width: wp(90), alignSelf: "center", justifyContent: 'space-between' }]}>
                <Image source={{ uri: teacherObj?.profileImage ? generateImageUrl(teacherObj?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }} style={{ width: 100, height: 100, position: "relative", top: -40, borderRadius: 50 }} resizeMode="cover" />
                {
                    (teacherObj?.role == "TEACHER" && teacherObj?._id == decodedObj?.userId) ?
                        <View style={{ display: "flex", justifyContent: "flex-end", flexDirection: "row" }}>
                            <Pressable style={styles.btn2} onPress={() => props.navigation.navigate('TeacherSlots')}>
                                <Icon name="calendar-outline" size={25} color={colorObj.primarColor} />
                            </Pressable>
                            <Pressable style={styles.btn} onPress={() => props.navigation.navigate('AccountEdit')}>
                                <Text style={styles.btnTxt}>Edit</Text>
                            </Pressable>
                        </View>
                        :

                        <Pressable style={styles.btn} onPress={() => refRBSheet.current.open()}>
                            <Text style={styles.btnTxt}>Enquire</Text>
                        </Pressable>
                }
            </View>
            <View style={[styles.flexRow, { marginLeft: 15, marginTop: -10, alignItems: 'center' }]}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.textCardMainHeading}>{teacherObj?.name}
                    </Text>
                    {
                        teacherObj.onlineToggle == true &&
                        <Text style={{ height: 8, width: 8, marginLeft: 8, backgroundColor: "#23e615", borderRadius: 50 }}></Text>
                    }
                </View>
                <View style={[styles.flexRow, { alignItems: 'center', paddingHorizontal: 20 }]}>
                    <Text style={{ fontFamily: 'RedHatText-Medium', fontSize: 12, color: '#828282' }}>{teacherObj?.rating}</Text>
                    <Icon name="star" style={{ marginHorizontal: 3 }} size={15} color="orange" />
                </View>
            </View>
            <View style={[styles.flexRow, { width: wp(90), alignSelf: "center", marginVertical: 10 }]}>
                <View style={[styles.flexRow, { width: "33%" }]}>
                    <Image source={require("../../assets/images/office.png")} />
                    <Text style={styles.smallTxt}>{teacherObj?.address ? teacherObj?.address : "Delhi"}</Text>
                </View>
                <View style={[styles.flexRow, { width: "33%" }]}>
                    <Image source={require("../../assets/images/medal.png")} />
                    <Text style={styles.smallTxt}>{teacherObj?.enquiryObj?.educationObj?.degree ? item?.enquiryObj?.educationObj?.degree : "PGT"}</Text>

                </View>
                <View style={[styles.flexRow, { width: "33%" }]}>
                    <Image source={require("../../assets/images/time.png")} />
                    <Text style={styles.smallTxt}>{teacherObj?.enquiryObj?.experience ? teacherObj?.enquiryObj?.experience : "1"} year experience</Text>
                </View>
            </View>


            <View style={[styles.flexColumn, { width: wp(90), alignSelf: "center", marginTop: 20, }]}>
                <Text style={styles.description}>{teacherObj?.enquiryObj?.description ? teacherObj?.enquiryObj?.description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"}</Text>
            </View>



            <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                <Text style={styles.headingAboveCard}>Courses ({coursesArr.length})</Text>
                <Text style={styles.viewAllText}>View All</Text>
            </View>

            <FlatList
                horizontal
                data={coursesArr}
                renderItem={renderCourseItem}
                ListEmptyComponent={
                    <Text style={{ fontFamily: 'Montserrat-Regular', padding: 10 }}>No Courses found</Text>
                }
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${index}`}
            />


            <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                <Text style={styles.headingAboveCard}>Feedback ({feedBackArr.length})</Text>
                <Pressable onPress={() => setResponseModal(true)}>
                    <Text style={[styles.viewAllText, { color: colorObj.primarColor, textDecorationLine: 'underline' }]}>Add Feedback</Text>
                </Pressable>
            </View>

            <FlatList
                horizontal
                data={feedBackArr}
                ListEmptyComponent={
                    <Text style={{ fontFamily: 'Montserrat-Regular', padding: 10 }}>No FeedBacks found</Text>
                }
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable style={[styles.cardContainer, { height: hp(15) }]}  >
                            <View style={styles.textCardContainer}>
                                <View>

                                    <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                                        <Text style={styles.textCardMainHeading}>{item?.sentByObj?.name}</Text>
                                    </View>

                                    <View style={[styles.flexRow, { alignItems: 'center' }]}>
                                        {item?.ratingArr?.map((el, i) => {
                                            return (
                                                <Icon key={i} name="star" size={12} color="#FF900E" />
                                            )
                                        })}
                                    </View>


                                    <Text style={styles.textCardMainSubHeading1}>{item?.message}</Text>

                                </View>

                            </View>
                        </Pressable>
                    )
                }}
            />

            {/* <Swipeable leftActionActivationDistance={10} onLeftActionRelease={() => alert("Enquired")} leftContent={leftContent}>
                <Text>Enquire Now</Text>
            </Swipeable> */}


            {/* bottom  sheet */}
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                animationType="slide"
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,0.5)",
                    },
                    container: {
                        height: hp(70)
                    },
                    draggableIcon: {
                        backgroundColor: "#000"
                    }
                }}
            >
                <View style={styles.bottomSheetInnerContainer}>

                    <Text style={styles.bottomSheetHeading}>Enquiry Options</Text>
                    <Pressable onPress={() => setChecked(EnquiryTypes.ONETOONE)} style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', width: wp(90) }]}>
                        <Text style={styles.bottomSheetOptionText}>Specific Enquriy</Text>
                        <RadioButton
                            value={EnquiryTypes.ONETOONE}
                            color={colorObj.primarColor}
                            status={checked == EnquiryTypes.ONETOONE ? 'checked' : 'unchecked'}
                            onPress={() => setChecked(EnquiryTypes.ONETOONE)}
                        />

                    </Pressable>

                    <Pressable disabled={teacherObj?.enquiryObj?.timeslots.length == 0} onPress={() => setChecked(EnquiryTypes.SLOT)} style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', width: wp(90) }]}>
                        <Text style={styles.bottomSheetOptionText}>Slot Booking</Text>
                        <RadioButton
                            value={EnquiryTypes.SLOT}
                            disabled={teacherObj?.enquiryObj?.timeslots.length == 0}
                            color={colorObj.primarColor}
                            status={checked === EnquiryTypes.SLOT ? 'checked' : 'unchecked'}
                            onPress={() => setChecked(EnquiryTypes.SLOT)}
                        />
                    </Pressable>
                    {
                        checked == EnquiryTypes.SLOT &&
                        <>
                            <Picker
                                selectedValue={selectedSlotDay}
                                style={[styles.textInput, { width: wp(90), fontFamily: 'Montserrat-SemiBold' }]}

                                onValueChange={(itemValue, itemIndex) => {
                                    if (itemValue == "N/A") {
                                        setSlotsArr([])
                                        setSelectedSlotDay('N/A')
                                        setSelectedTimeSlot('')
                                        // setSelectedDayId('')

                                    }
                                    else {

                                        setSelectedSlotDay(itemValue)
                                        handleDaySelect(itemValue)
                                        // setSelectedDayId(teacherObj?.enquiryObj?.timeslots[itemIndex]._id)
                                    }
                                }

                                }>
                                <Picker.Item style={{ fontFamily: 'Montserrat-Regular' }} label="Please Select Day" value="N/A" />

                                {teacherObj?.enquiryObj?.timeslots.map(el => {
                                    return (
                                        <Picker.Item style={{ fontFamily: 'Montserrat-Regular' }} key={el._id} label={el.day} value={el.day} />
                                    )
                                })}
                            </Picker>
                            {slotsArr.length > 0 &&
                                <Picker
                                    selectedValue={selectedTimeSlot}
                                    style={[styles.textInput, { width: wp(90), fontFamily: 'Montserrat-SemiBold' }]}

                                    onValueChange={(itemValue, itemIndex) => {
                                        if (itemValue == "N/A") {
                                            setSelectedTimeSlot('N/A')
                                            // setSelectedTimeSlotObj('')
                                        }
                                        else {
                                            setSelectedTimeSlot(itemValue)
                                            // console.log(slotsArr[itemIndex])
                                            // setSelectedTimeSlotObj({...slotsArr[itemIndex]})
                                        }
                                        // handleDaySelect(itemValue)
                                    }
                                    }>
                                    <Picker.Item style={{ fontFamily: 'Montserrat-Regular' }} label="Please Select Time slot" value="N/A" />

                                    {slotsArr.map(el => {
                                        return (
                                            <Picker.Item style={{ fontFamily: 'Montserrat-Regular' }} key={el._id} label={el.time} value={el.time} />
                                        )
                                    })}
                                </Picker>
                            }
                        </>

                    }
                    <Pressable onPress={() => setChecked('connect')} style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', width: wp(90) }]}>
                        <Text style={styles.bottomSheetOptionText}>Connect Now</Text>
                        <RadioButton
                            value="connect"
                            color={colorObj.primarColor}
                            status={checked === 'connect' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('connect')}
                        />
                    </Pressable>
                    <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Message</Text>

                    <TextInput style={[styles.textInput, { width: wp(90) }]} multiline numberOfLines={2} value={additionalMessage} onChangeText={(e) => setAdditionalMessage(e)} />

                    <Pressable style={styles.btn} onPress={() => handleEnquireNow()}>
                        <Text style={styles.btnTxt}>Enquire</Text>
                    </Pressable>
                </View>
            </RBSheet>



            {/* //// Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={responseModal}
                onRequestClose={() => {
                    setResponseModal(false);
                }}
            >
                <Pressable style={styles.centeredView} onPress={() => setResponseModal(false)}>
                    <Pressable style={styles.modalView}>
                        <Text style={styles.responseModalHeading}>Feedback</Text>

                        <View style={[styles.flexRow, { marginVertical: 10, alignItems: 'center' }]}>
                            <Image source={{ uri: teacherObj?.profileImage ? generateImageUrl(teacherObj?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }} style={{ width: 50, height: 50, borderRadius: 50 }} resizeMode="cover" />
                            <Text style={[styles.TeacherName, { paddingHorizontal: 20, fontFamily: 'RedHatText-SemiBold' }]}>{teacherObj?.name}</Text>
                        </View>

                        <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Rating</Text>

                        <Rating
                            style={{ alignSelf: 'flex-start', marginVertical: 5 }}
                            type='custom'
                            startingValue={rating}
                            onFinishRating={(val) => setRating(val)}
                            ratingCount={5}
                            imageSize={25}
                            showRating
                            ratingTextColor={colorObj.primarColor}
                            showRating={false}

                        />
                        <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Message</Text>
                        <TextInput style={[styles.textInput]} multiline numberOfLines={4} value={responseMessage} onChangeText={(e) => setResponseMessage(e)} />
                        <Pressable style={styles.submitBtn} onPress={() => handleSubmitFeedBack()}>
                            <Text style={styles.submitBtnText}>Submit</Text>
                        </Pressable>

                    </Pressable>
                </Pressable>
            </Modal>

        </ScrollView>
    )
}
const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
    TeacherName: {
        fontFamily: 'RedHatText-Bold',
        fontSize: 18,
        color: colorObj.primarColor,
        // marginTop: 15
    },
    smallTxt: {
        fontFamily: 'RedHatText-Regular',
        fontSize: 12,
        color: "black",
        marginLeft: 5
    },
    description: {
        fontFamily: 'RedHatText-Regular',
        fontSize: 13,
        color: "black",
        lineHeight: 20,
        marginTop: 8,
        marginBottom: 8,
    },
    btnTxt: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 13,
        color: "white",
        // marginTop: 15
    },

    heading: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        color: "black",
    },

    btn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 50,
        // width: wp(20),
        paddingHorizontal: 25,
        height: 40,
        // paddingVertical: 10,
        marginVertical: 10,
        marginLeft: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    btn2: {
        backgroundColor: "transparent",
        height: 40,
        paddingTop: 5,
        marginVertical: 10,
    },




    ////bottom sheet 
    bottomSheetHeading: {
        color: '#333333',
        fontFamily: 'Montserrat-Medium',
        fontSize: 18,
        marginVertical: 10

    },
    bottomSheetInnerContainer: {
        width: wp(90),
        paddingHorizontal: 20
    },
    bottomSheetOptionText: {
        color: '#333333',
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        marginVertical: 10
    },




    ////category card
    headingAboveCard: {
        fontSize: 16, fontFamily: 'OpenSans-SemiBold', color: '#303030', paddingLeft: 13, marginTop: 10
    },
    viewAllText: {
        fontSize: 14, fontFamily: 'OpenSans-Regular', color: '#828282', paddingRight: 13, marginTop: 10
    },




    cardContainer: {
        width: wp(40),
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        height: hp(25),
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        borderRadius: 14,
        marginHorizontal: 10,
        marginVertical: 10,
        paddingVertical: 10,
    },
    textCardContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10

    },
    courseImg: {
        height: 100,
        width: '90%',
        alignSelf: 'center',
        borderRadius: 14
    },
    textCardMainHeading: {
        fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: '#232323'
    },
    textCardMainSubHeading1: {
        fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#7E7E7E', marginTop: 2
    },
    textCardMainSubHeading2: {
        fontFamily: 'Montserrat-Regular', fontSize: 12, color: colorObj.primarColor, marginTop: 15
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
        width: wp(90),
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
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 20,
        color: '#000',
        textAlign: 'left',
        marginVertical: 10,

        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0'
    },

    //text input styles
    textInputLabel: {
        fontFamily: 'RedHatText-SemiBold',
        fontSize: 16,
        color: '#000'
    },
    textInput: {
        backgroundColor: '#F5F6FA',
        borderRadius: 5,
        marginVertical: 10,
        width: '100%',
        fontFamily: 'Montserrat-Regular'

    },

    submitBtn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 25,
        marginVertical: 10,
        alignSelf: 'flex-end'
    },
    submitBtnText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: colorObj.whiteColor,
        textAlign: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20
    },

})