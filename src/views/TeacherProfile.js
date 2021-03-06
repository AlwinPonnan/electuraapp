import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ImageBackground, TouchableHighlight, FlatList, ScrollView, Modal, TextInput, Linking } from 'react-native';
import NavBar from '../components/Navbar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { colorObj } from '../globals/colors';
import { RadioButton } from 'react-native-paper';
import Video from 'react-native-video';

import Swipeable from 'react-native-swipeable';
import { useIsFocused } from '@react-navigation/core';
import { BookmarkTeacher, getById, getDecodedToken, updateProfileVisit } from '../Services/User';
import { dayArr, formatDate, generateImageUrl } from '../globals/utils';
import { getByCoursesUserId } from '../Services/Course';

import { Rating, AirbnbRating } from 'react-native-ratings';
import { addNewFeedBack, getAllFeedBacksByTeacherId } from '../Services/TeacherFeedBack';
import { successAlertContext } from '../../App';
import { loadingContext } from '../navigators/stacks/RootStack';
import EnquiryTypes from '../globals/EnquiryTypes';
import { NewEnquiry } from '../Services/Enquiry';


import RBSheet from "react-native-raw-bottom-sheet";
import { Picker } from '@react-native-picker/picker';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { createZoomMeeting } from '../Services/ZoomMeeting';
import * as Progress from 'react-native-progress';
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import { getByUser } from '../Services/LiveClass';

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
    const initialDate = `${formatDate(new Date())}`
    const [selectedDate, setSelectedDate] = useState(initialDate);

    const [profileProgress, setProfileProgress] = useState(0);

    const [liveClassArr, setLiveClassArr] = useState([]);



    const [photoModal, setPhotoModal] = useState(false);

    const leftContent = () => {
        return (
            <Pressable style={styles.btn} >
                <Text style={styles.btnTxt}>Enquire</Text>
            </Pressable>
        )
    };


    const openFaceBook = (name) => {
        console.log("checking facebook")
        if (name != "") {

            Linking.canOpenURL(`${name}`).then(supported => {
                if (supported) {
                    return Linking.openURL(`${name}`);
                } else {
                    return Linking.openURL(`${name}`);
                }
            })
        }
        else if (name == "" && teacherObj?.role == "TEACHER" && teacherObj?._id == decodedObj?.userId) {
            props.navigation.navigate('AccountEdit')
        }
    }
    const openYoutube = (name) => {
        if (name != "" && name) {
            console.log(name)
            Linking.canOpenURL(name).then(supported => {
                if (supported) {
                    return Linking.openURL(name);
                } else {
                    setErrorAlert(true)
                    setAlertText("Unable to open")
                }
            });
        }
        else if (!name && teacherObj?.role == "TEACHER" && teacherObj?._id == decodedObj?.userId) {
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
        getLiveClass()
        handleProfileVisit()
    }

    const getTeacher = async () => {
        setIsLoading(true)
        try {
            let decodedTokenObj = await getDecodedToken();
            setDecodedObj(decodedTokenObj)
            let userId = props.route.params.data;
            const { data: res } = await getById(userId)
            console.log(JSON.stringify(res.data.enquiryObj, null, 2), "teacher data")
            if (res.success) {
                let tempObj = res.data;
                tempObj.enquiryObj.timeslots = tempObj?.enquiryObj?.timeslots?.filter(el => el.slotArr.length > 0)
                // console.log(tempObj.enquiryObj.timeslots)
                setTeacherObj({ ...tempObj })
                handleDaySelectOnint(new Date(initialDate).getDay(), tempObj.enquiryObj.timeslots)
                if (tempObj?.enquiryObj?.timeslots?.length > 0) {
                    setProfileProgress(prevState => prevState + 0.3)
                }
                if (tempObj?.role == "TEACHER") {
                    setProfileProgress(prevState => prevState + 0.3)

                }
                if (tempObj?.enquiryObj?.facebookLink != "" && tempObj?.enquiryObj?.instagramLink != "" && tempObj?.enquiryObj?.youtubeLink != "") {
                    setProfileProgress(prevState => prevState + 0.4)

                }
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
                // console.log(temp)
                setCoursesArr(temp)
            }
        } catch (error) {
            console.error(error)
        }
    }


    const renderCourseItem = ({ item, index }) => {
        return (
            <Pressable style={styles.cardContainer} onPress={() => { setIsLoading(true); props.navigation.navigate("CourseDetail", { data: item._id }) }} >
                <Image style={styles.courseImg} source={{ uri: item?.imgUrl }} />
                <View style={styles.textCardContainer}>
                    <View>

                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={[{ fontFamily: 'OpenSans-SemiBold', fontSize: 12, color: '#333333' }]}>{item?.name}</Text>
                            <Icon name="heart-outline" size={14} color={colorObj.primarColor} />
                        </View>
                        <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 10, color: '#828282' }}>{item?.teacherName}</Text>
                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 10, color: colorObj.primarColor, marginTop: 10 }}>???{item?.price}</Text>
                            <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 10, color: colorObj.primarColor, marginTop: 10 }}><Icon name="star" size={10} color={colorObj.primarColor} />{item?.rating ? Math.round(item?.rating) : 3}</Text>
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

    const handleDaySelect = (tempdayIndex) => {
        // console.log(tempdayIndex)
        let tempArr = [...teacherObj.enquiryObj.timeslots];
        let dayIndex = tempArr.findIndex((el, i) => i == tempdayIndex);
        // console.log(dayIndex)
        if (dayIndex != -1) {
            setSlotsArr([...tempArr[dayIndex].slotArr])
            setSelectedSlotDay(tempArr[dayIndex].day)
        }
    }
    const handleDaySelectOnint = (tempdayIndex, arr) => {
        // console.log(tempdayIndex)
        let tempArr = [...arr];
        let dayIndex = tempArr.findIndex((el, i) => i == tempdayIndex);
        // console.log(dayIndex)
        if (dayIndex != -1) {
            setSlotsArr([...tempArr[dayIndex].slotArr])
            setSelectedSlotDay(tempArr[dayIndex].day)
        }
    }

    const handleProfileVisit = async () => {
        try {
            await updateProfileVisit(props.route.params.data);

        } catch (error) {
            console.error(error)
        }
    }

    const getAllFeedBacks = async () => {
        try {
            let userId = props.route.params.data;
            const { data: res } = await getAllFeedBacksByTeacherId(userId);
            // console.log(JSON.stringify(res.data, null, 2))
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
                        meetingDate: selectedDate,
                        timeSlotObj: slotsArr.find(el => el.time == selectedTimeSlot)
                    },
                    specificRequirement: '',
                    enquiryType: checked,
                    teacherId: teacherObj?._id,
                    additionalMessage
                }
                // console.log(obj)
                let { data: res } = await NewEnquiry(obj);
                if (res.success) {
                    setSuccessAlert(true)
                    setAlertText(res.message)
                    setAdditionalMessage("")
                    // alert(res.message)
                }
            }
            else if (checked == "connect") {
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
                        day: dayArr[new Date().getDay()].day,
                        meetingDate: new Date(),
                        // timeSlotObj: slotsArr.find(el => el.time == selectedTimeSlot)
                    },
                    specificRequirement: '',
                    enquiryType: checked,
                    teacherId: teacherObj?._id,
                    additionalMessage
                }
                // console.log(obj)
                let { data: res } = await NewEnquiry(obj);
                if (res.success) {
                    setSuccessAlert(true)
                    setAlertText(res.message)
                    setAdditionalMessage("")
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
                    setAdditionalMessage("")
                    // alert(res.message)
                }
            }

        } catch (error) {
            // console.log(error)
            setErrorAlert(true)
            setAlertText(error.message)

        }
        setIsLoading(false)
    }

    const getLiveClass = async () => {
        try {
            const { data: res } = await getByUser();
            if (res.success) {
                let tempArr = res.data;

                let temp = tempArr.map(el => {
                    let obj = {
                        ...el,
                        imgUrl: "https://images.unsplash.com/photo-1497002961800-ea7dbfe18696?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1052&q=80",

                    }
                    return obj
                }).filter(el => {
                    if (el?.enquiryObj?.slotObj?.timeSlotObj?.startTime) {
                        // console.log(new Date(el?.enquiryObj?.slotObj?.timeSlotObj?.startTime).toDateString())
                        if (new Date(el?.enquiryObj?.slotObj?.timeSlotObj?.startTime).getTime() <= new Date().getTime() && new Date(el?.enquiryObj?.slotObj?.timeSlotObj?.endTime).getTime() >= new Date().getTime()) {
                            return true
                        }
                        else {
                            return false
                        }
                    }
                    else {
                        return true
                    }
                })
                // console.log(JSON.stringify(temp,null,2),"adad")

                setLiveClassArr(temp)
            }
        } catch (error) {
            console.error(error)
        }
    }
    const onDayPress = day => {
        // console.log(day)
        // console.log(selectedDate)
        let tempDate = day.dateString;
        // console.log(tempDate)
        setSelectedDate(day.dateString)
        // setSelectedSlotDay(new Date(tempDate).getDay())
        handleDaySelect(new Date(tempDate).getDay())
        // setSelected(day.dateString);
    };


    const handleEnquireClick = () => {
        if (teacherObj?.name) {
            refRBSheet.current.open()
        }
        else {
            props.navigation.navigate('AccountEdit')
        }
    }


    const handleBookmarkTeacher = async () => {
        try {
            const { data: res } = await BookmarkTeacher(teacherObj?._id);
            if (res) {
                setSuccessAlert(true)
                setAlertText(`${res.message}`)
                handleOnint()
            }

        } catch (error) {
            console.error(error)
            setIsrefreshing(false)
        }
    }

    useEffect(() => {
        if (focused) {

            handleOnint()
        }
        else {
            setProfileProgress(0)
        }
        return () => setProfileProgress(0)
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
                <Pressable onPress={()=>setPhotoModal(true)}>

                    <Image source={{ uri: teacherObj?.profileImage ? generateImageUrl(teacherObj?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }} style={{ width: 100, height: 100, position: "relative", top: -40, borderRadius: 50 }} resizeMode="cover" />
                </Pressable>
                {
                    (teacherObj?.role == "TEACHER" && teacherObj?._id == decodedObj?.userId) ?
                        <View style={{ display: "flex", justifyContent: "flex-end", flexDirection: "row" }}>
                            <Pressable style={[styles.btn2, { marginRight: 10 }]} onPress={() => handleBookmarkTeacher()}>
                                {
                                    teacherObj?.enquiryObj?.bookmarked ?
                                        <Icon name="bookmark" size={25} color={colorObj.primarColor} />

                                        :

                                        <Icon name="bookmark-outline" size={25} color={colorObj.primarColor} />
                                }
                            </Pressable>
                            <Pressable style={styles.btn2} onPress={() => props.navigation.navigate('TeacherSlots')}>
                                <Icon name="calendar-outline" size={25} color={colorObj.primarColor} />
                            </Pressable>
                            <Pressable style={styles.btn} onPress={() => props.navigation.navigate('AccountEdit')}>
                                <Text style={styles.btnTxt}>Edit</Text>
                            </Pressable>
                        </View>
                        :
                        <View style={{ display: "flex", justifyContent: "flex-end", flexDirection: "row" }}>
                            <Pressable style={[styles.btn2, { marginRight: 10 }]} onPress={() => handleBookmarkTeacher()}>
                                {
                                    teacherObj?.enquiryObj?.bookmarked ?
                                        <Icon name="bookmark" size={25} color={colorObj.primarColor} />

                                        :

                                        <Icon name="bookmark-outline" size={25} color={colorObj.primarColor} />
                                }
                            </Pressable>
                            <Pressable style={styles.btn} onPress={() => handleEnquireClick()}>
                                <Text style={styles.btnTxt}>Enquire</Text>
                            </Pressable>
                        </View>
                }
            </View>
            <View style={[styles.flexRow, { marginLeft: 35, marginTop: -25, alignItems: 'center' }]}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.textCardMainHeading}>{teacherObj?.name}
                    </Text>
                    {
                        teacherObj.onlineToggle == true &&
                        <Text style={{ height: 5, width: 5, marginLeft: 8, backgroundColor: colorObj.primarColor, borderRadius: 50 }}></Text>
                    }
                </View>
                <View style={[styles.flexRow, { alignItems: 'center', paddingHorizontal: 20 }]}>
                    <Text style={{ fontFamily: 'RedHatText-Bold', fontSize: 12, color: '#828282' }}>{Math.round(teacherObj?.rating * 10) / 10}</Text>
                    <Icon name="star" style={{ marginHorizontal: 3 }} size={15} color="#FF900E" />
                </View>
            </View>
            <View style={[styles.flexRow, { width: wp(85), alignSelf: "center", justifyContent: 'space-between', marginVertical: 10 }]}>
                <View style={[styles.flexRow]}>
                    <Icon name="location-outline" size={16} color={"#828282"} />

                    <Text style={styles.smallTxt}>{teacherObj?.enquiryObj?.address ? teacherObj?.enquiryObj?.address : ""}</Text>
                </View>
                <View style={[styles.flexRow]}>
                    <Image source={require("../../assets/images/time.png")} />
                    <Text style={styles.smallTxt}>{teacherObj?.enquiryObj?.experience ? teacherObj?.enquiryObj?.experience : ""} year experience</Text>
                </View>
                {/* <View style={[styles.flexRow, { width: "33%", paddingLeft: 5 }]}>
                    <Image source={require("../../assets/images/medal.png")} />
                    <View style={styles.flexColumn}>

                        {teacherObj?.enquiryObj?.qualificationArr?.length > 0 ?
                            <>
                                {teacherObj?.enquiryObj?.qualificationArr.map(el => {
                                    return (
                                        <Text style={[styles.smallTxt]}>{el.name},</Text>
                                    )
                                })}
                            </>
                            :

                            <Text style={[styles.smallTxt]}>PGT</Text>
                        }
                    </View>

                </View> */}
            </View>



            <View style={[{ backgroundColor: '#F5F5F5', width: wp(90), alignSelf: 'center', borderRadius: 5, padding: 10, marginTop: 15 }]}>
                {(teacherObj?.role == "TEACHER" && teacherObj?._id == decodedObj?.userId) &&
                    <>
                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={styles.dashboardHeading}>My Dashboard <Text style={{ fontSize: 10, color: '#828282' }}> (private to you)</Text> </Text>
                            <Text style={styles.dashboardHeading}><Text style={{ fontSize: 10, color: '#828282' }}>{profileProgress > 100 ? 100 : profileProgress * 100}% Completed</Text> </Text>

                        </View>
                        <View style={[styles.flexColumn, { width: wp(100), alignItems: 'center', alignSelf: "center", marginTop: 20 }]}>
                            <Progress.Bar progress={profileProgress} width={wp(85)} color={colorObj.primarColor} />
                        </View>
                    </>
                }
                <View style={[styles.flexRow, { width: '100%', alignItems: 'center', alignSelf: 'center', justifyContent: 'space-between', backgroundColor: 'white', marginTop: (teacherObj?.role == "TEACHER" && teacherObj?._id == decodedObj?.userId) ? 30 : 5, paddingVertical: 10, borderRadius: 5 }]}>
                    <View style={[{ borderRightWidth: 1, paddingHorizontal: 20, borderRightColor: '#F2F2F2' }]}>
                        <Text style={styles.dashboardTextMain}>{teacherObj?.profileVisit >= 10000 ? `${teacherObj?.profileVisit}K` : teacherObj?.profileVisit}</Text>
                        <Text style={styles.dashboardTextSub}>Profile Visits</Text>
                    </View>
                    <View style={[{ borderRightWidth: 1, paddingHorizontal: 20, borderRightColor: '#F2F2F2' }]}>
                        <Text style={styles.dashboardTextMain}>{teacherObj?.totalBookmarks ? teacherObj?.totalBookmarks : 0}</Text>
                        <Text style={styles.dashboardTextSub}>Students</Text>
                    </View>
                    <View style={[{ paddingHorizontal: 10 }]}>
                        <Text style={styles.dashboardTextMain}>{liveClassArr.length}</Text>
                        <Text style={styles.dashboardTextSub}>Live Sessions</Text>
                    </View>
                </View>
            </View>
            {teacherObj?.enquiryObj?.description &&

                <View style={[styles.flexColumn, { width: wp(90), alignSelf: "center" }]}>
                    <Text style={[styles.headingAboveCard, { paddingLeft: 0 }]}>Description</Text>
                    <Text style={styles.description}>{teacherObj?.enquiryObj?.description}</Text>
                </View>
            }

            {teacherObj?.enquiryObj?.qualificationArr.length > 0 &&
                <View style={[styles.flexColumn, { width: wp(90), alignSelf: "center" }]}>
                    <Text style={[styles.headingAboveCard, { paddingLeft: 0 }]}>Qualification</Text>
                    <Text style={styles.description}>{teacherObj?.enquiryObj?.qualificationArr.reduce((acc, el) => acc + el.name + ',', '')}</Text>
                </View>
            }


            <View style={[styles.flexColumn, { width: wp(90), alignSelf: "center" }]}>
                <Text style={[styles.headingAboveCard, { paddingLeft: 0 }]}>Teacher???s Proficiency</Text>
            </View>
            <FlatList
                horizontal
                data={teacherObj?.enquiryObj?.subjectArr}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable style={[styles.teacherProficiencycardContainer, { minHeight: hp(8) }]}  >
                            <View style={styles.textCardContainer}>
                                <View>

                                    <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                                        <Text style={[styles.textCardMainHeading, { color: '#000000', fontSize: 14, fontFamily: "Montserrat-SemiBold" }]}>{item?.subjectName}</Text>
                                    </View>

                                    <Text style={[styles.textCardMainSubHeading1, { color: '#7E7E7E', marginTop: 7, fontFamily: 'Montserrat-Regular', fontSize: 10 }]}>{item?.classArr.reduce((acc, el) => acc + el.className + ',', '')}</Text>
                                </View>

                            </View>
                        </Pressable>
                    )
                }}
                ListEmptyComponent={
                    <Text style={{ fontFamily: 'RedHatText-Regular', padding: 10 }}>No Data Found</Text>
                }
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${index}`}
            />

            <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }]}>
                <Text style={styles.headingAboveCard}>Introductory Videos/Images</Text>
                <Pressable onPress={() => props.navigation.navigate("MainDrawer", { screen: "MainBottomTab", params: { screen: "Courses", params: { screen: "AllCourses" } } })}>

                    <Text style={[styles.viewAllText, { fontFamily: 'RedHatText-Regular' }]}></Text>
                </Pressable>
            </View>

            <View style={[styles.flexRow, { flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 10, width: wp(90), marginHorizontal: 10 }]}>
                {
                    teacherObj?.enquiryObj?.introductoryFile1?.mimeType?.includes("image") && teacherObj?.enquiryObj?.introductoryFile1?.mimeType ?
                        <Image source={{
                            uri: generateImageUrl(teacherObj?.enquiryObj?.introductoryFile1?.url)
                        }} style={{ width: wp(45), height: wp(45), marginTop: 22, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 5, }} />

                        :
                        <>
                            {teacherObj?.enquiryObj?.introductoryFile1?.url &&
                                <Video repeat resizeMode={"cover"} paused={false} source={{ uri: generateImageUrl(teacherObj?.enquiryObj?.introductoryFile1?.url) }}   // Can be a URL or a local file.         // Store reference
                                    onBuffer={() => console.log("ads")}                // Callback when remote video is buffering
                                    onError={() => console.log("ads")}               // Callback when video cannot be loaded
                                    style={{ width: wp(45), height: wp(45), marginTop: 22, }} />
                            }
                        </>
                }
                {
                    teacherObj?.enquiryObj?.introductoryFile2?.mimeType?.includes("image") && teacherObj?.enquiryObj?.introductoryFile2?.mimeType ?
                        <Image source={{
                            uri: generateImageUrl(teacherObj?.enquiryObj?.introductoryFile2?.url)
                        }} style={{ width: wp(45), height: wp(45), marginTop: 22, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 5, }} />

                        :
                        <>
                            {teacherObj?.enquiryObj?.introductoryFile2?.url &&
                                <Video repeat resizeMode={"cover"} paused={false} source={{ uri: generateImageUrl(teacherObj?.enquiryObj?.introductoryFile2?.url) }}   // Can be a URL or a local file.         // Store reference
                                    onBuffer={() => console.log("ads")}                // Callback when remote video is buffering
                                    onError={() => console.log("ads")}               // Callback when video cannot be loaded
                                    style={{ width: wp(45), height: wp(45), marginTop: 22, }} />
                            }
                        </>
                }
                {
                    teacherObj?.enquiryObj?.introductoryFile3?.mimeType?.includes("image") && teacherObj?.enquiryObj?.introductoryFile3?.mimeType ?
                        <Image source={{
                            uri: generateImageUrl(teacherObj?.enquiryObj?.introductoryFile3?.url)
                        }} style={{ width: wp(45), height: wp(45), marginTop: 22, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 5, }} />

                        :
                        <>
                            {teacherObj?.enquiryObj?.introductoryFile3?.url &&
                                <Video repeat resizeMode={"cover"} paused={false} source={{ uri: generateImageUrl(teacherObj?.enquiryObj?.introductoryFile3?.url) }}   // Can be a URL or a local file.         // Store reference
                                    onBuffer={() => console.log("ads")}                // Callback when remote video is buffering
                                    onError={() => console.log("ads")}               // Callback when video cannot be loaded
                                    style={{ width: wp(45), height: wp(45), marginTop: 22, }} />
                            }
                        </>
                }
                {
                    teacherObj?.enquiryObj?.introductoryFile4?.mimeType?.includes("image") && teacherObj?.enquiryObj?.introductoryFile4?.mimeType ?
                        <Image source={{
                            uri: generateImageUrl(teacherObj?.enquiryObj?.introductoryFile4?.url)
                        }} style={{ width: wp(45), height: wp(45), marginTop: 22, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 5, }} />

                        :
                        <>
                            {teacherObj?.enquiryObj?.introductoryFile4?.url &&
                                <Video repeat resizeMode={"cover"} paused={false} source={{ uri: generateImageUrl(teacherObj?.enquiryObj?.introductoryFile4?.url) }}   // Can be a URL or a local file.         // Store reference
                                    onBuffer={() => console.log("ads")}                // Callback when remote video is buffering
                                    onError={() => console.log("ads")}               // Callback when video cannot be loaded
                                    style={{ width: wp(45), height: wp(45), marginTop: 22, }} />
                            }
                        </>
                }

            </View>

            {/*  */}


            <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }]}>
                <Text style={styles.headingAboveCard}>Courses ({coursesArr.length})</Text>
                <Pressable onPress={() => props.navigation.navigate("MainDrawer", { screen: "MainBottomTab", params: { screen: "Courses", params: { screen: "AllCourses" } } })}>

                    <Text style={[styles.viewAllText, { fontFamily: 'RedHatText-Regular' }]}>View All</Text>
                </Pressable>
            </View>

            <FlatList
                horizontal
                data={coursesArr}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                renderItem={renderCourseItem}
                ListEmptyComponent={
                    <Text style={{ fontFamily: 'RedHatText-Regular', padding: 10 }}>Currently the teacher has not listed any courses</Text>
                }
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${index}`}
            />


            <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }]}>
                <Text style={styles.headingAboveCard}>{feedBackArr.length > 1 ? "Feedbacks" : "Feedback"} ({feedBackArr.length})</Text>
                {
                    (teacherObj?._id != decodedObj?.userId) &&
                    <Pressable onPress={() => setResponseModal(true)}>
                        <Text style={[styles.viewAllText, { color: colorObj.primarColor, textDecorationLine: 'underline' }]}>Add Feedback</Text>
                    </Pressable>
                }
            </View>

            <FlatList
                horizontal
                data={feedBackArr}
                ListEmptyComponent={
                    <Text style={{ fontFamily: 'Montserrat-Regular', padding: 10 }}>
                        {feedBackArr.length > 1 ? "No FeedBacks found" : "No FeedBack found"}
                    </Text>
                }
                contentContainerStyle={{ paddingHorizontal: 10 }}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item, index }) => {
                    return (
                        <Pressable style={[styles.cardContainer, { minHeight: hp(15) }]}  >
                            <View style={styles.textCardContainer}>
                                <View>

                                    <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                                        <Text style={[styles.textCardMainHeading, { color: '#828282', fontSize: 14, fontFamily: "RedHatText-Medium" }]}>{item?.sentByObj?.name}</Text>
                                    </View>

                                    <View style={[styles.flexRow, { alignItems: 'center' }]}>
                                        {item?.ratingArr?.map((el, i) => {
                                            return (
                                                <Icon key={i} name="star" size={10} color="#FF900E" />
                                            )
                                        })}
                                    </View>
                                    <Text style={[styles.textCardMainSubHeading1, { color: '#000000', fontFamily: 'RedHatText-Regular', fontSize: 10 }]}>{item?.message}</Text>
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
                closeOnDragDown={false}
                closeOnPressMask={false}
                dragFromTopOnly={false}

                animationType="slide"
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,0.5)",
                    },
                    container: {
                        height: hp(100)
                    },
                    draggableIcon: {
                        backgroundColor: "#fff"
                    }
                }}
            >
                <ScrollView contentContainerStyle={styles.bottomSheetInnerContainer}>

                    <Text style={[styles.bottomSheetHeading, { fontFamily: 'Montserrat-SemiBold', textAlign: 'center' }]}>Enquiry Options</Text>
                    <View style={[styles.flexRow, { alignItems: 'center', marginVertical: 10 }]}>

                        <Image source={{ uri: teacherObj?.profileImage ? generateImageUrl(teacherObj?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }} style={{ width: 50, height: 50, borderRadius: 50 }} resizeMode="cover" />
                        <View>

                            <Text style={[styles.textCardMainHeading, { paddingHorizontal: 20 }]}>{teacherObj?.name} (Teacher)</Text>
                        </View>
                    </View>
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

                    <TextInput style={[styles.textInput, { width: wp(90), textAlignVertical: 'top' }]} multiline numberOfLines={4} value={additionalMessage} onChangeText={(e) => setAdditionalMessage(e)} />

                    {
                        checked == EnquiryTypes.SLOT &&
                        <>
                            <Calendar
                                enableSwipeMonths
                                current={selectedDate}
                                style={[styles.calendar, { width: wp(90), marginVertical: 10 }]}
                                onDayPress={onDayPress}
                                minDate={`${formatDate(new Date())}`}
                                // state={selectedDate}
                                markedDates={{
                                    [selectedDate]: {
                                        selected: true,
                                        disableTouchEvent: true,
                                        selectedColor: colorObj.primarColor,
                                        selectedTextColor: 'white'
                                    }
                                }}
                            />


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

                </ScrollView>
                <View style={[styles.flexRow, { justifyContent: 'space-evenly', width: wp(100), position: 'absolute', bottom: 20, backgroundColor: 'white' }]}>
                    <Pressable style={styles.RBSheetbtn} onPress={() => refRBSheet.current.close()} >
                        <Text style={styles.RBSheetbtnTxt}>Close</Text>
                    </Pressable>
                    <Pressable style={styles.RBSheetbtn} onPress={() => handleEnquireNow()} >
                        <Text style={styles.RBSheetbtnTxt}>Enquire</Text>
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
                        <TextInput style={[styles.textInput]} multiline maxLength={150} numberOfLines={4} value={responseMessage} onChangeText={(e) => setResponseMessage(e)} />
                        <Pressable style={styles.submitBtn} onPress={() => handleSubmitFeedBack()}>
                            <Text style={styles.submitBtnText}>Submit</Text>
                        </Pressable>

                    </Pressable>
                </Pressable>
            </Modal>

            {/* //// Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={photoModal}
                onRequestClose={() => {
                    setPhotoModal(false);
                }}
            >
                <Pressable style={styles.centeredView} onPress={() => setPhotoModal(false)}>
                    <Pressable style={styles.modalView}>
                        <Image source={{ uri: teacherObj?.profileImage ? generateImageUrl(teacherObj?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }} style={{ width: wp(72), height:200 }} resizeMode="cover" />
                    </Pressable>
                </Pressable>
            </Modal>


        </ScrollView>
    )
}
const styles = StyleSheet.create({
    dashboardTextMain: {
        color: colorObj.primarColor,
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'RedHatText-SemiBold'
    },
    dashboardTextSub: {
        color: '#828282',
        fontSize: 12,
        textAlign: 'center',

        fontFamily: 'RedHatText-Regular'
    },
    dashboardHeading: {
        fontFamily: 'RedHatText-Regular',
        fontSize: 16,
        color: '#333'
    },
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
        color: "#828282",
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
        width: wp(100),
        paddingHorizontal: 20,
        paddingBottom: 100
    },
    bottomSheetOptionText: {
        color: '#333333',
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        marginVertical: 10
    },




    ////category card
    headingAboveCard: {
        fontSize: 16, fontFamily: 'RedHatText-Medium', color: '#4F4F4F', paddingLeft: 13, marginTop: 10
    },
    viewAllText: {
        fontSize: 14, fontFamily: 'RedHatText-Regular', color: '#828282', paddingRight: 13, marginTop: 10
    },




    teacherProficiencycardContainer: {
        width: wp(42),
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        // height: hp(25),
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: 5,
        marginHorizontal: 10,
        marginVertical: 10,
        paddingVertical: "2.5%",
    },
    cardContainer: {
        width: wp(40),
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        // height: hp(25),
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: 14,
        marginHorizontal: 10,
        marginVertical: 10,
        paddingVertical: "2.5%",
    },
    textCardContainer: {
        paddingHorizontal: 7,
        paddingVertical: 10

    },
    courseImg: {
        height: 100,
        width: '95%',
        alignSelf: 'center',
        borderRadius: 12,
        // borderTopLeftRadius: 12,
        // borderTopRightRadius: 12,
    },
    textCardMainHeading: {
        fontFamily: 'RedHatText-Bold', fontSize: 18, color: colorObj.primarColor
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
        maxHeight: hp(25),
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


    RBSheetbtn: {
        // backgroundColor: colorObj.primarColor,
        borderRadius: 5,
        // paddingHorizontal: 25,
        height: 40,
        borderColor: colorObj.primarColor,
        borderWidth: 1,
        marginVertical: 10,
        // marginLeft: 40,
        width: wp(40),
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.18,
        // shadowRadius: 1.00,

        // elevation: 1,
    },

    RBSheetbtnTxt: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 13,
        color: colorObj.primarColor,
        // marginTop: 15
    },

})