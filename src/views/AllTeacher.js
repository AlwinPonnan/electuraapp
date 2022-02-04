import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, Image, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/core';
import { BookmarkTeacher, getAllTeachers } from '../Services/User';
import { dayArr, formatDate, generateImageUrl, sortByText } from '../globals/utils';
import RBSheet from "react-native-raw-bottom-sheet";
import { NewEnquiry } from '../Services/Enquiry';

import { RadioButton } from 'react-native-paper';
import EnquiryTypes from '../globals/EnquiryTypes';
import { colorObj } from '../globals/colors';
import { loadingContext } from '../navigators/stacks/RootStack';
import { getAllSubjects } from '../Services/Subjects';
import { Checkbox } from 'react-native-paper';
import { getAllBySubject, getAllClasses } from '../Services/Classses';
import { getAllTopics } from '../Services/Topic';
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

import { Picker } from '@react-native-picker/picker';
import { successAlertContext } from '../../App';

import MatIcon from 'react-native-vector-icons/MaterialIcons'
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import GeneralInnerHeader from '../components/GeneralInnerHeader';

export default function AllTeacher(props) {

    const focused = useIsFocused()
    const refRBSheet = useRef();
    // console.log(props.route.params)


    const previousSelectedSubjectId = props?.route?.params?.filterId;
    const isSubjectSelected = props?.route?.params?.isSubjectId

    const isTopSelected = props?.route?.params?.isTopSelected

    const filterBottomSheetRef = useRef()
    const [checked, setChecked] = useState(EnquiryTypes.ONETOONE);

    const [selectedTeacherObj, setSelectedTeacherObj] = useState({});
    const [isLoading, setIsLoading] = useContext(loadingContext);


    const [TeachersArr, setTeachersArr] = useState([])
    const [MainTeachersArr, setMainTeachersArr] = useState([]);
    const [additionalMessage, setAdditionalMessage] = useState('');

    const [subjectArr, setSubjectArr] = useState([]);

    const [classesArr, setClassesArr] = useState([]);
    const [mainClassesArr, setMainClassesArr] = useState([]);
    const [topicArr, setTopicArr] = useState([]);
    const [mainTopicArr, setMainTopicArr] = useState([]);

    const [multiSliderValue, setMultiSliderValue] = useState([10, 250]);

    const [sortBy, setSortBy] = useState(sortByText.popularity);

    const [isScrollEnabled, setIsScrollEnabled] = useState(true);

    const [selectedSlotDay, setSelectedSlotDay] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

    const [activeFilterContainer, setActiveFilterContainer] = useState('subject');      ///subject,class,topic,price ,sortby
    ////price range picker

    const [maxTeacherFees, setMaxTeacherFees] = useState(0);
    const [minTeacherFees, setMinTeacherFees] = useState(0);

    const initialDate = `${formatDate(new Date())}`
    const [selectedDate, setSelectedDate] = useState(initialDate);
    ////


    const [selectedNewFilter, setSelectedNewFilter] = useState("All");
    const [slotsArr, setSlotsArr] = useState([]);

    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr


    const [outerSelectedClassArr, setOuterSelectedClassArr] = useState([]);
    const [outerTopicArr, setOuterTopicArr] = useState([]);

    const [innerFilteredTeacherArr, setInnerFilteredTeacherArr] = useState([]);



    const [nestedClassArr, setNestedClassArr] = useState([]);
    const [mainNestedClassArr, setMainNestedClassArr] = useState([]);

    const [includeNoFeesTeachers, setIncludeNoFeesTeachers] = useState(false);

    const getTeachers = async () => {
        setIsLoading(true)
        try {

            const { data: res } = await getAllTeachers();
            if (res.success) {
                let maxCount = 0;
                let minCount = res?.data[0]?.enquiryObj?.feesObj?.minFees ? res?.data[0]?.enquiryObj?.feesObj?.minFees : 0;
                let tempArr = [...res.data.map(el => {

                    if (el?.enquiryObj?.feesObj?.maxFees > maxCount) {
                        maxCount = el?.enquiryObj?.feesObj?.maxFees
                    }
                    if (el?.enquiryObj?.feesObj?.minFees < minCount)
                        minCount = el?.enquiryObj?.feesObj?.minFees
                    return el
                })]
                setMaxTeacherFees(maxCount)
                setMinTeacherFees(minCount)
                // console.log(minCount, maxCount)
                setTeachersArr(res.data)
                setMainTeachersArr(res.data)
                console.log(JSON.stringify(res?.data[0], null, 2))
                getSubjects(res.data)
                setInnerFilteredTeacherArr(res.data)
                if (isTopSelected) {
                    handleBtnFilter("Top Tutors", res.data)
                }
            }

        } catch (error) {
            console.error(error)
        }
        setIsLoading(false)
    }


    const getSubjects = async (arr) => {
        try {
            const { data: res } = await getAllSubjects();
            if (res.success) {
                setSubjectArr([...res.data.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1
                    }
                    else if (a.name > b.name) {
                        return 1
                    }
                    else {
                        return 0
                    }
                }).map(el => {
                    let obj = {
                        ...el,
                        checked: false
                    }
                    return obj
                })])
                if (isSubjectSelected) {
                    console.log("inside,@@@@@@@@@@@@@", isSubjectSelected)
                    setOuterSelectedClassArr([`${previousSelectedSubjectId}`])
                    setTeachersArr([...arr.filter(el => el?.enquiryObj?.subjectArr.some(elz => elz.classArr.some(elx => elx?.classId == previousSelectedSubjectId)))])

                }


            }
        } catch (error) {
            console.error(error)
        }
    }
    const getClasses = async () => {
        try {
            const { data: res } = await getAllClasses();
            if (res.success) {
                console.log(JSON.stringify(res.data, null, 2))
                let tempArr = res.data;

                tempArr = tempArr.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1
                    }
                    else if (a.name > b.name) {
                        return 1
                    }
                    else {
                        return 0
                    }
                }).map(el => ({ ...el, checked: false }))
                setClassesArr([...tempArr])
                setMainClassesArr([...tempArr])

            }
        } catch (error) {
            console.error(error)
        }
    }

    const getNestedClasses = async () => {
        try {
            const { data: res } = await getAllBySubject();
            if (res.success) {
                let tempArr = res.data;
                tempArr = tempArr.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1
                    }
                    else if (a.name > b.name) {
                        return 1
                    }
                    else {
                        return 0
                    }
                }).map(el => {
                    let obj = {
                        ...el,
                        checked: false,
                        classArr: el.classArr.map(elx => ({ ...elx, checked: false }))
                    }
                    return obj
                })
                // setNestedClassArr([...res.data.map(el => {
                //     let obj = {
                //         ...el,
                //         checked: false,
                //         classArr: el.classArr.map(elx => ({ ...elx, checked: false }))
                //     }
                //     return obj
                // })])
                // setMainNestedClassArr([...res.data.map(el => {
                //     let obj = {
                //         ...el,
                //         checked: false,
                //         classArr: el.classArr.map(elx => ({ ...elx, checked: false }))
                //     }
                //     return obj
                // })])
                setNestedClassArr([...tempArr])
                setMainNestedClassArr([...tempArr])
            }
        } catch (error) {
            console.error(error)
        }
    }



    const getTopics = async () => {
        try {
            const { data: res } = await getAllTopics();
            if (res.success) {
                let tempArr = res.data;
                tempArr = tempArr.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1
                    }
                    else if (a.name > b.name) {
                        return 1
                    }
                    else {
                        return 0
                    }
                }).map(el => ({ ...el, checked: false }))
                setTopicArr([...tempArr])
                setMainTopicArr([...tempArr])
            }
        } catch (error) {
            console.error(error)
        }
    }
    const handleOnint = () => {
        getTeachers()
        getClasses()
        getNestedClasses()
        getTopics()
    }




    const handleTopicFilter = () => {
        let tempArr = [...mainTopicArr];
        let tempClassesArr = [...nestedClassArr.filter(elx => elx.classArr.some(elz => elz.checked))]
        let tempSubjectArr = [...subjectArr.filter(elx => elx.checked)]

        tempArr = tempArr.filter(ely => tempSubjectArr.some(ele => ele._id == ely.subjectId));
        tempArr = tempArr.filter(ely => tempClassesArr.some(elz => elz.classArr.some(el => el._id == ely.classId)) || tempSubjectArr.some(ele => ele._id == ely.subjectId));

        // console.log(tempArr)
        setTopicArr([...tempArr])
    }


    useEffect(() => {
        handleOnint()
    }, [focused])

    const multiSliderValuesChange = values => { setMultiSliderValue(values) };






    const handleEnquireNow = async () => {
        // setIsLoading(true)
        // refRBSheet.current.close()
        // try {


        //     let obj = {
        //         classId: '',
        //         subjectId: '',
        //         topicId: '',
        //         region: '',
        //         ClassType: '',
        //         gender: '',
        //         price: '',
        //         specificRequirement: '',
        //         enquiryType: checked,
        //         teacherId: selectedTeacherObj?._id,
        //         additionalMessage
        //     }
        //     let { data: res } = await NewEnquiry(obj);
        //     if (res.success) {
        //         setSuccessAlert(true)
        //         setAlertText(res.message)
        //         // alert(res.message)
        //     }

        // } catch (error) {
        //     console.log(error)
        //     setErrorAlert(true)
        //     setAlertText(error.message)

        // }
        // setIsLoading(false)
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
                    teacherId: selectedTeacherObj?._id,
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
                    teacherId: selectedTeacherObj?._id,
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
                    teacherId: selectedTeacherObj?._id,
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

    const handleSubjectSelection = (index, id) => {
        let tempArr = [...subjectArr];
        tempArr = tempArr.map((el, i) => {
            if (i == index) {

                el.checked = !el.checked
            }
            else {
                el.checked = false
            }
            return el
        })
        setSubjectArr([...tempArr])
        console.log(JSON.stringify([...tempArr], null, 2))
        let tempClassesArr = [...mainNestedClassArr];
        // console.log(tempClassesArr)
        tempClassesArr = tempClassesArr.filter(el => el._id == id);
        setNestedClassArr([...tempClassesArr])
        handleTopicFilter()
    }
    const handleClassSelection = (subjectIndex, id) => {
        console.log(subjectIndex, id)
        setNestedClassArr(prevState => {
            let tempIndex = prevState[subjectIndex].classArr.findIndex(el => el._id == id);
            if (tempIndex != -1)
                prevState[subjectIndex].classArr[tempIndex].checked = !prevState[subjectIndex].classArr[tempIndex].checked
            return [...prevState]
        })
        handleTopicFilter()
    }

    const handleTopicSelection = (id) => {
        setTopicArr(prevState => {
            let tempIndex = prevState.findIndex(el => el._id == id);
            if (tempIndex != -1)
                prevState[tempIndex].checked = !prevState[tempIndex].checked
            return [...prevState]
        })
    }

    const handleBookmarkTeacher = async (id) => {
        try {
            const { data: res } = await BookmarkTeacher(id);
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

    // const renderItem = ({ item, index }) => {
    //     return (
    //         <Pressable style={styles.cardContainer} onPress={() => props.navigation.navigate("TeacherProfile", { data: item._id })}>

    //             <View style={styles.textCardContainer}>
    //                 <View style={styles.teacherImgContainer}>
    //                     <Image style={styles.teacherImg} source={{ uri: item?.profileImage ? generateImageUrl(item?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }} />
    //                 </View>
    //                 <View>
    //                     <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
    //                         <Text style={styles.textCardMainHeading}>{item?.name}
    //                         </Text>
    //                         {
    //                             item.onlineToggle == true &&
    //                             <Text style={{ height: 5, width: 5, marginLeft: 8, backgroundColor: colorObj.primarColor, borderRadius: 50 }}></Text>

    //                         }
    //                     </View>
    //                     <Text style={styles.textCardMainSubHeading1}>{item?.enquiryObj?.classesArr?.reduce((acc, el) => acc + el.className + ',', '')}</Text>
    //                     <Text style={styles.textCardMainSubHeading2}>{item?.enquiryObj?.experience} Year Experience</Text>
    //                 </View>
    //                 <Pressable onPress={() => handleBookmarkTeacher(item?._id)} style={{ position: 'absolute', top: 5, right: 10 }} >
    //                     {item?.enquiryObj?.bookmarked ?
    //                         <Ionicons name="bookmark" size={14} color={colorObj?.primarColor} />
    //                         :
    //                         <Ionicons name="bookmark-outline" size={14} color={colorObj?.primarColor} />

    //                     }
    //                 </Pressable>
    //             </View>
    //         </Pressable>
    //     )
    // }

    const renderTeacherItem = ({ item, index }) => {
        return (
            <View style={[styles.listView]}>
                <Pressable onPress={() => props.navigation.navigate("TeacherProfile", { data: item._id })}>
                    <Image
                        style={styles.listImage}
                        source={{ uri: item?.profileImage ? generateImageUrl(item?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }}
                    />
                </Pressable>
                <View style={{ flex: 1, marginLeft: 10, paddingHorizontal: 5, paddingVertical: 5 }}>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.textCardMainHeading}>{item?.name}
                        </Text>
                        <Text style={[styles.textCardMainHeading, { paddingHorizontal: 3 }]}>
                            {Math.round(item?.enquiryObj?.rating * 10) / 10}
                            <Ionicons name="star" style={{ marginHorizontal: 3 }} size={8} color="#FF900E" />

                        </Text>
                        {
                            item.onlineToggle == true &&
                            <Text style={{ height: 5, width: 5, marginLeft: 8, backgroundColor: colorObj.primarColor, borderRadius: 50 }}></Text>
                        }
                    </View>
                    <Text style={[styles.location]}><Ionicons name="location-outline" size={9} color="#A3A3A3" style={{ marginRight: 10 }} />{item?.enquiryObj?.address ? item?.enquiryObj?.address : "Delhi"}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', paddingTop: 13 }}>
                        {item?.enquiryObj?.qualificationArr?.length != 0 &&
                            <View style={styles.flexRow}>
                                <Image style={{ height: 9, width: 9, marginHorizontal: 5 }} source={require("../../assets/images/medal.png")} />
                                <Text style={[styles.subject]}>{item?.enquiryObj?.qualificationArr?.length != 0 ? `${item?.enquiryObj?.qualificationArr[0]?.name}...` : ""}</Text>
                            </View>
                        }
                        {/* <View>
                            <Text style={[styles.subject]}>{item.course}</Text>
                        </View> */}
                        <View style={styles.flexRow}>
                            <AntDesign size={9} name="hourglass" color="#828282" style={{ marginHorizontal: 5 }} />
                            <Text style={[styles.subject]}>{item?.enquiryObj?.experience ? item?.enquiryObj?.experience : 1}+ Year Experience</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginRight: 10 }}>
                        <Pressable onPress={() => props.navigation.navigate("TeacherProfile", { data: item._id })}>

                            <Text style={[styles.button, { color: '#828282', marginRight: 15, fontFamily: 'Montserrat-Medium' }]}>View Profile</Text>
                        </Pressable>
                        <Pressable onPress={() => { setSelectedTeacherObj(item); setChecked(EnquiryTypes.ONETOONE); refRBSheet.current.open() }}>

                            <Text style={[styles.button, { backgroundColor: '#085A4E', color: '#fff', paddingHorizontal: 15, paddingVertical: 3, borderRadius: 5 }]}>Enquire</Text>
                        </Pressable>

                    </View>
                    <Pressable onPress={() => handleBookmarkTeacher(item?._id)} style={{ position: 'absolute', top: 5, right: 10 }} >
                        {item?.enquiryObj?.bookmarked ?
                            <Ionicons name="bookmark" size={14} color={colorObj?.primarColor} />

                            :

                            <Ionicons name="bookmark-outline" size={14} color={colorObj?.primarColor} />

                        }
                    </Pressable>
                </View>


            </View >



        )
    }


    const handleShowFilterResults = () => {
        // filterBottomSheetRef.current.close()

        let filteredClassesArr = [...classesArr.filter(el => el.checked)]
        // console.log(JSON.stringify(nestedClassArr,null,2),"@@@@@@@@@@@@@@@@@@")
        let filteredSubjectArr = [...subjectArr.filter(el => el.checked)]
        // console.log(JSON.stringify(subjectArr,null,2),"@@@################")
        let tempArr = [...MainTeachersArr];
        // console.log(JSON.stringify(MainTeachersArr, null, 2))
        if (filteredClassesArr.length > 0) {
            console.log("class filter@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

            tempArr = tempArr.filter(el => el?.enquiryObj?.subjectArr?.some(elx => elx.classArr.some(elz => filteredClassesArr.some(elm => elm._id == elz.classId))))

        }
        if (filteredSubjectArr.length > 0) {
            // console.log("subject filter")
            tempArr = tempArr.filter(el => el?.enquiryObj?.subjectArr?.some(elx => filteredSubjectArr.some(ely => ely._id == elx.subjectId)))
        }

        // tempArr = tempArr.filter(el => el.enquiryObj?.feesObj?.minFees >= parseInt(multiSliderValue[0]) && el.enquiryObj?.feesObj?.maxFees <= parseInt(multiSliderValue[1]))

        if (includeNoFeesTeachers) {
            let prevInstance = tempArr.filter(el => !el.enquiryObj?.feesObj?.minFees && !el.enquiryObj?.feesObj?.maxFees);
            tempArr = [...tempArr.filter(el => el.enquiryObj?.feesObj?.minFees >= parseInt(multiSliderValue[0]) || el.enquiryObj?.feesObj?.maxFees <= parseInt(multiSliderValue[1])), ...prevInstance]
        }
        else {
            let arr = tempArr.filter(el => el.enquiryObj?.feesObj?.minFees && el.enquiryObj?.feesObj?.maxFees)
            console.log(JSON.stringify(arr[0]?.enquiryObj?.feesObj, null, 2))
            console.log(multiSliderValue[0], multiSliderValue[1])
            console.log(typeof multiSliderValue[0], typeof multiSliderValue[1])

            tempArr = arr.filter(el => el.enquiryObj?.feesObj?.minFees >= multiSliderValue[0] || el.enquiryObj?.feesObj?.maxFees <= multiSliderValue[1])
        }
        if (sortBy == sortByText.priceLowToHigh) {
            tempArr = tempArr.sort((a, b) => a.enquiryObj?.feesObj?.maxFees - b.enquiryObj?.feesObj?.maxFees)
        }
        else if (sortBy == sortByText.priceHighToLow) {
            tempArr = tempArr.sort((a, b) => b.enquiryObj?.feesObj?.maxFees - a.enquiryObj?.feesObj?.maxFees)
        }


        // console.log(tempArr)
        setTeachersArr([...tempArr])
        setInnerFilteredTeacherArr([...tempArr])
        filterBottomSheetRef.current.close()
    }

    const handleSearch = (e) => {
        let tempArr = [...MainTeachersArr]
        let query = e.toLowerCase()
        tempArr = tempArr.filter(el => el?.name?.toLowerCase().includes(query) || el?.enquiryObj?.subjectArr?.some(ele => ele?.classArr.some(elx => elx?.className.toLowerCase().includes(query))))
        setTeachersArr([...tempArr])
    }
    const onDayPress = day => {
        // console.log(day, "@@@@@@@@")
        // console.log(selectedDate)
        let tempDate = day.dateString;
        // console.log(tempDate)
        setSelectedDate(day.dateString)
        // setSelectedSlotDay(new Date(tempDate).getDay())
        handleDaySelect(new Date(tempDate).getDay())
        // setSelected(day.dateString);
    };
    const initDayPress = () => {
        // console.log(selectedDate)
        let tempDate = formatDate(new Date());
        // console.log(tempDate)
        setSelectedDate(tempDate)
        // setSelectedSlotDay(new Date(tempDate).getDay())
        handleDaySelect(new Date(tempDate).getDay())
        // setSelected(day.dateString);
    }

    const handleDaySelect = (tempdayIndex) => {
        // console.log(tempdayIndex)
        let tempArr = [...selectedTeacherObj.enquiryObj.timeslots];
        let dayIndex = tempArr.findIndex((el, i) => i == tempdayIndex);
        // console.log(dayIndex)
        if (dayIndex != -1) {
            setSlotsArr([...tempArr[dayIndex].slotArr])
            setSelectedSlotDay(tempArr[dayIndex].day)
        }
    }
    // const handleDaySelectOnint = (tempdayIndex, arr) => {
    //     console.log(tempdayIndex)
    //     let tempArr = [...arr];
    //     let dayIndex = tempArr.findIndex((el, i) => i == tempdayIndex);
    //     console.log(dayIndex)
    //     if (dayIndex != -1) {
    //         setSlotsArr([...tempArr[dayIndex].slotArr])
    //         setSelectedSlotDay(tempArr[dayIndex].day)
    //     }
    // }

    const handleClassSelectionOuterFilter = (obj) => {
        setOuterSelectedClassArr(obj)

    }

    const handleOuterClassFilter = () => {
        console.log(outerSelectedClassArr)
        let tempTeacherArr = [...MainTeachersArr]
        if (outerSelectedClassArr.length > 0) {

            tempTeacherArr = tempTeacherArr.filter(el => outerSelectedClassArr.some(elx => el.enquiryObj.subjectArr.some(elz => elz.classArr.some(ely => ely.classId == elx))))
            setTeachersArr([...tempTeacherArr])
            setInnerFilteredTeacherArr([...tempTeacherArr])
            let tempTopicArr = [...mainTopicArr];
            tempTopicArr = tempTopicArr.filter(el => outerSelectedClassArr.some(elx => elx == el.classId))
            setTopicArr([...tempTopicArr])
        }
        else {
            setTeachersArr([...tempTeacherArr])
            setInnerFilteredTeacherArr([...tempTeacherArr])
            setTopicArr([...mainTopicArr])
        }
    }

    const handleTopicOuterFilter = (obj) => {
        setOuterTopicArr(obj)
    }


    const handleBtnFilter = (value, arr) => {

        let tempTeacherArr = arr.length > 0 ? arr : [...innerFilteredTeacherArr]
        if (value == "All") {
            setTeachersArr([...tempTeacherArr])

        }
        else if (value == "Online") {
            tempTeacherArr = tempTeacherArr.filter(el => el.onlineToggle)
            setTeachersArr([...tempTeacherArr])
        }
        else {
            tempTeacherArr = tempTeacherArr.filter((el, i) => i < 10).sort((a, b) => b?.profileVisit - a?.profileVisit)
            setTeachersArr([...tempTeacherArr])

        }
        setSelectedNewFilter(value)
    }

    return (
        <>
            <GeneralInnerHeader rootProps={props} />
            <View style={[styles.container]}>
                {/* <View style={{ flexDirection: 'row' }}>
                <Pressable style={[{ flex: 1 }]} onPress={() => props.navigation.goBack()}>
                    <AntDesign name='left' size={20} style={[styles.topIcons]} />
                </Pressable>
                <Pressable onPress={() => props.navigation.navigate('MainTopTab')}>

                    <AntDesign name='message1' size={20} style={[styles.topIcons, { marginRight: 25 }]} />
                </Pressable>
                <Pressable onPress={() => props.navigation.navigate("Notification")}>

                    <Feather name='bell' size={20} style={[styles.topIcons]} />
                </Pressable>
            </View> */}

                <View style={[styles.searchInputView]}>
                    <AntDesign name='search1' color={"#828282"} size={14} style={[{ marginRight: 15 }]} />
                    <TextInput
                        style={styles.input}
                        onChangeText={(e) => handleSearch(e)}
                        placeholder="Search Categories"
                    />
                    <Pressable onPress={() => filterBottomSheetRef.current.open()}>
                        <Image source={require('../../assets/images/Filter.png')} />
                        {/* <Feather name='align-right' size={20} style={[styles.topIcons, { marginRight: 10 }]} /> */}
                    </Pressable>
                </View>
                <FlatList
                    ListHeaderComponent={
                        <>
                            {/* <Text style={[styles.title]}>Top Instructors</Text>
                        <View>
                            <FlatList
                                style={{ height: 120 }}
                                horizontal
                                data={TeachersArr}
                                renderItem={renderItem}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, index) => `${index}`}
                                ListEmptyComponent={
                                    <Text style={{ textAlign: 'center', fontFamily: 'Montserrat-SemiBold', fontSize: 16, width: wp(90), marginTop: 40 }}>No Teachers Found</Text>
                                }
                            />
                        </View> */}
                            <View style={[styles.flexRow, { marginTop: 15, alignItems: 'center', justifyContent: 'space-between' }]}>

                                <SectionedMultiSelect
                                    items={classesArr}
                                    IconRenderer={MatIcon}
                                    uniqueKey="_id"
                                    itemFontFamily={{ fontFamily: 'Montserrat-SemiBold' }}
                                    subItemFontFamily={{ fontFamily: "Montserrat-Regular" }}
                                    searchPlaceholderText={"Search Subcategories..."}
                                    searchTextFontFamily={{ fontFamily: "Montserrat-Medium" }}
                                    confirmFontFamily={{ fontFamily: "Montserrat-SemiBold" }}
                                    showChips={false}
                                    alwaysShowSelectText={true}
                                    onConfirm={() => handleOuterClassFilter()}
                                    selectText="Subcategory"

                                    onSelectedItemsChange={handleClassSelectionOuterFilter}
                                    selectedItems={outerSelectedClassArr}
                                    styles={{ selectToggleText: { fontFamily: 'Montserrat-Regular', fontSize: 14 }, selectToggle: { borderColor: "#828282", borderRadius: 50, borderWidth: 0.7, paddingVertical: 5, paddingHorizontal: 10, width: wp(40) }, button: [styles.btn, { flex: 1, marginHorizontal: wp(28), backgroundColor: colorObj.primarColor }], confirmText: [styles.btnTxt, { color: 'white' }], itemText: { fontFamily: 'Montserrat-Regular' }, chipContainer: { backgroundColor: '#E0E0E0', borderRadius: 5, borderWidth: 0 }, chipText: { fontFamily: 'Montserrat-Regular' } }}


                                />
                                <SectionedMultiSelect
                                    items={topicArr}
                                    IconRenderer={MatIcon}
                                    uniqueKey="_id"
                                    itemFontFamily={{ fontFamily: 'Montserrat-SemiBold' }}
                                    subItemFontFamily={{ fontFamily: "Montserrat-Regular" }}
                                    searchPlaceholderText={"Search Topics..."}
                                    searchTextFontFamily={{ fontFamily: "Montserrat-Medium" }}
                                    confirmFontFamily={{ fontFamily: "Montserrat-SemiBold" }}
                                    showChips={false}
                                    alwaysShowSelectText={true}
                                    selectText="Topics"
                                    onSelectedItemsChange={handleTopicOuterFilter}
                                    selectedItems={outerTopicArr}
                                    styles={{ selectToggleText: { fontFamily: 'Montserrat-Regular', fontSize: 14 }, selectToggle: { borderColor: "#828282", borderRadius: 50, borderWidth: 0.7, paddingVertical: 5, paddingHorizontal: 10, width: wp(40) }, button: [styles.btn, { flex: 1, marginHorizontal: wp(28), backgroundColor: colorObj.primarColor }], confirmText: [styles.btnTxt, { color: 'white' }], itemText: { fontFamily: 'Montserrat-Regular' }, chipContainer: { backgroundColor: '#E0E0E0', borderRadius: 5, borderWidth: 0 }, chipText: { fontFamily: 'Montserrat-Regular' } }}

                                />
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                                <Pressable onPress={() => handleBtnFilter("All", [])} style={[styles.newContainer, selectedNewFilter != "All" && { backgroundColor: '#f0faf9' }]}>
                                    <Text style={[styles.newcategoryName, selectedNewFilter != "All" && { color: '#828282' }]}>All</Text>
                                </Pressable>
                                <Pressable onPress={() => handleBtnFilter("Online", [])} style={[styles.newContainer, selectedNewFilter != "Online" && { backgroundColor: '#f0faf9' }]}>
                                    <Text style={[styles.newcategoryName, selectedNewFilter != "Online" && { color: '#828282' }]}>Online</Text>
                                </Pressable>
                                <Pressable onPress={() => handleBtnFilter("Top Tutors", [])} style={[styles.newContainer, selectedNewFilter != "Top Tutors" && { backgroundColor: '#f0faf9' }]}>
                                    <Text style={[styles.newcategoryName, selectedNewFilter != "Top Tutors" && { color: '#828282' }]}>Top Tutors</Text>
                                </Pressable>
                            </View>
                        </>
                    }
                    contentContainerStyle={{ paddingBottom: 50 }}
                    data={TeachersArr}
                    renderItem={renderTeacherItem}
                    keyExtractor={(item, index) => `${index}`}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', fontFamily: 'Montserrat-SemiBold', fontSize: 16, width: wp(90), marginTop: 40 }}>No Teachers Found</Text>
                    }
                />

                <FlatList

                />
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
                    <ScrollView scrollEnabled={true} contentContainerStyle={[styles.bottomSheetInnerContainer, { paddingHorizontal: 10, paddingBottom: 100 }]}>

                        <Text style={[styles.bottomSheetHeading, { fontFamily: 'Montserrat-SemiBold', textAlign: 'center' }]}>Enquiry Options</Text>
                        <View style={[styles.flexRow, { alignItems: 'center', marginVertical: 10 }]}>

                            <Image source={{ uri: selectedTeacherObj?.profileImage ? generateImageUrl(selectedTeacherObj?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }} style={{ width: 50, height: 50, borderRadius: 50 }} resizeMode="cover" />
                            <View>

                                <Text style={[styles.textCardMainHeading, { paddingHorizontal: 20 }]}>{selectedTeacherObj?.name} (Teacher)</Text>
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

                        <Pressable disabled={selectedTeacherObj?.enquiryObj?.timeslots?.length == 0 || !selectedTeacherObj?.enquiryObj?.timeslots} onPress={() => { setChecked(EnquiryTypes.SLOT); initDayPress() }} style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', width: wp(90) }]}>
                            <Text style={styles.bottomSheetOptionText}>Slot Booking</Text>
                            <RadioButton
                                value={EnquiryTypes.SLOT}
                                disabled={selectedTeacherObj?.enquiryObj?.timeslots?.length == 0 || !selectedTeacherObj?.enquiryObj?.timeslots}
                                color={colorObj.primarColor}
                                status={checked === EnquiryTypes.SLOT ? 'checked' : 'unchecked'}
                                onPress={() => { setChecked(EnquiryTypes.SLOT); initDayPress() }}
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

                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                            <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Message</Text>

                            <TextInput style={[styles.textInput, { width: wp(90), textAlignVertical: 'top' }]} multiline numberOfLines={4} value={additionalMessage} onChangeText={(e) => setAdditionalMessage(e)} />

                        </KeyboardAvoidingView>

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

                        <View style={[styles.flexRow, { justifyContent: 'space-evenly', width: wp(100), backgroundColor: 'white' }]}>
                            <Pressable style={styles.RBSheetbtn} onPress={() => refRBSheet.current.close()} >
                                <Text style={styles.RBSheetbtnTxt}>Close</Text>
                            </Pressable>
                            <Pressable style={styles.RBSheetbtn} onPress={() => handleEnquireNow()} >
                                <Text style={styles.RBSheetbtnTxt}>Enquire</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </RBSheet>
                <RBSheet
                    ref={filterBottomSheetRef}
                    closeOnDragDown={true}
                    closeOnPressMask={false}
                    dragFromTopOnly={true}

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
                    <>


                    <ScrollView scrollEnabled={true} contentContainerStyle={[styles.bottomSheetInnerContainer, { paddingHorizontal: 10, paddingBottom: 100 }]}>
                            <View style={[styles.flexRowAlignCenter, { justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colorObj.greyColor, paddingBottom: 10 }]}>
                                <Text style={[styles.filterSubHeading, { paddingHorizontal: 10 }]}>Filter</Text>
                                <Text style={[styles.filterSubHeading, { color: colorObj.primarColor, fontSize: 14, paddingHorizontal: 10 }]}>Clear All</Text>
                            </View>
                            <View style={[[styles.flexRowAlignCenter]]}>

                                <View style={[styles.flexColumn, { height: hp(80), width: wp(30), backgroundColor: '#f5f5f5' }]}>
                                    <Pressable onPress={() => setActiveFilterContainer('subject')} style={[styles.customFilterHeadingBox, activeFilterContainer == "subject" && { backgroundColor: 'white' }]}>

                                        <Text style={[styles.bottomSheetHeading, { fontSize: 14, paddingHorizontal: 10 }]}>Category</Text>
                                    </Pressable>
                                    <Pressable onPress={() => setActiveFilterContainer('class')} style={[styles.customFilterHeadingBox, activeFilterContainer == "class" && { backgroundColor: 'white' }]}>

                                        <Text style={[styles.bottomSheetHeading, { fontSize: 14, paddingHorizontal: 10 }]}>Sub-Category</Text>
                                    </Pressable>
                                    <Pressable onPress={() => setActiveFilterContainer('topic')} style={[styles.customFilterHeadingBox, activeFilterContainer == "topic" && { backgroundColor: 'white' }]}>

                                        <Text style={[styles.bottomSheetHeading, { fontSize: 14, paddingHorizontal: 10 }]}>Topic</Text>
                                    </Pressable>
                                    <Pressable onPress={() => setActiveFilterContainer('price')} style={[styles.customFilterHeadingBox, activeFilterContainer == "price" && { backgroundColor: 'white' }]}>

                                        <Text style={[styles.bottomSheetHeading, { fontSize: 14, paddingHorizontal: 10 }]}>Price Range</Text>
                                    </Pressable>
                                    <Pressable onPress={() => setActiveFilterContainer('sortBy')} style={[styles.customFilterHeadingBox, activeFilterContainer == "sortBy" && { backgroundColor: 'white' }]}>

                                        <Text style={[styles.bottomSheetHeading, { fontSize: 14, paddingHorizontal: 10 }]}>Sort By</Text>
                                    </Pressable>
                                </View>
                                <View style={[styles.flexColumn, { height: hp(80) }]}>
                                    {activeFilterContainer == "subject" &&

                                        <FlatList
                                            data={subjectArr}
                                            keyExtractor={(item, index) => `${index}`}
                                            scrollEnabled={true}
                                            contentContainerStyle={{ paddingBottom: 100, marginTop: 20 }}
                                            ListEmptyComponent={
                                                <Text>No data found</Text>
                                            }
                                            renderItem={({ item, index }) => {
                                                return (
                                                    <View>
                                                        <View style={[styles.flexRowAlignCenter, { paddingHorizontal: 10, justifyContent: 'space-between', }]}>
                                                            {/* <Checkbox
                                                        /> */}
                                                            <RadioButton
                                                                // value="first"
                                                                color={colorObj.primarColor}
                                                                status={item.checked ? "checked" : "unchecked"}
                                                                onPress={() => handleSubjectSelection(index, item._id)}
                                                            />
                                                            <Pressable onPress={() => handleSubjectSelection(index, item._id)} style={{ paddingVertical: 5, width: '100%' }} >
                                                                <Text style={[styles.checkBoxText, { textAlign: 'left' }]}>{item.name}</Text>
                                                            </Pressable>

                                                        </View>

                                                    </View>
                                                )
                                            }}

                                        />
                                    }
                                    {activeFilterContainer == "class" &&

                                        <FlatList
                                            data={nestedClassArr}
                                            keyExtractor={(item, index) => `${item._id}`}
                                            scrollEnabled={true}
                                            contentContainerStyle={{ paddingBottom: 100, marginTop: 20 }}

                                            renderItem={({ item, index }) => {
                                                return (
                                                    <View style={{ paddingHorizontal: 20 }}>
                                                        <Text style={[styles.checkBoxText, { textAlign: 'left', fontFamily: 'Montserrat-Medium' }]}>{item?.name}</Text>
                                                        <FlatList
                                                            scrollEnabled={false}
                                                            data={item.classArr}
                                                            keyExtractor={(item, index) => `${item._id}`}
                                                            renderItem={({ item: itemX, index: indexX }) => {
                                                                return (
                                                                    <View style={[styles.flexRowAlignCenter, { paddingHorizontal: 3, justifyContent: 'space-between', }]}>

                                                                        <Checkbox
                                                                            color={colorObj.primarColor}
                                                                            status={itemX.checked ? "checked" : "unchecked"}
                                                                            onPress={() => handleClassSelection(index, itemX._id)}
                                                                        />
                                                                        <Pressable onPress={() => handleClassSelection(index, itemX._id)} style={{ paddingVertical: 5, width: '100%' }} >
                                                                            <Text style={[styles.checkBoxText, { textAlign: 'left', fontSize: 12 }]}>{itemX.name}</Text>

                                                                        </Pressable>
                                                                    </View>

                                                                )
                                                            }}
                                                        />


                                                    </View>
                                                )
                                            }}

                                        />
                                    }
                                    {activeFilterContainer == "topic" &&

                                        <FlatList
                                            data={topicArr}
                                            keyExtractor={(item, index) => `${item._id}`}
                                            scrollEnabled={true}
                                            contentContainerStyle={{ paddingBottom: 100, marginTop: 20 }}

                                            renderItem={({ item, index }) => {
                                                return (
                                                    <View>
                                                        <View style={[styles.flexRowAlignCenter, { paddingHorizontal: 10, justifyContent: 'space-between', }]}>
                                                            <Checkbox
                                                                color={colorObj.primarColor}
                                                                status={item.checked ? "checked" : "unchecked"}
                                                                onPress={() => handleTopicSelection(item._id)}
                                                            />
                                                            <Pressable onPress={() => handleTopicSelection(item._id)} style={{ paddingVertical: 5, width: '100%' }} >
                                                                <Text style={[styles.checkBoxText, { textAlign: 'left' }]}>{item.name}</Text>

                                                            </Pressable>

                                                        </View>

                                                    </View>
                                                )
                                            }}


                                        />
                                    }
                                    {activeFilterContainer == "price" &&
                                        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
                                            <Text style={[styles.bottomSheetHeading, { fontSize: 16 }]}>Selected Price Range</Text>
                                            <Text style={[styles.bottomSheetHeading, { fontSize: 14 }]}>₹ {multiSliderValue[0]} - ₹ {multiSliderValue[1]} </Text>
                                            <MultiSlider
                                                values={[multiSliderValue[0], multiSliderValue[1]]}
                                                sliderLength={250}
                                                onValuesChange={multiSliderValuesChange}
                                                min={minTeacherFees}
                                                max={maxTeacherFees}
                                                step={50}
                                                // allowOverlap
                                                // snapped
                                                // enableLabel
                                                //  customLabel={CustomLabel}
                                                onValuesChangeStart={() => setIsScrollEnabled(false)}
                                                onValuesChangeFinish={() => setIsScrollEnabled(true)}
                                            />
                                            <View style={[styles.flexRowAlignCenter, { paddingHorizontal: 5, justifyContent: 'space-between', }]}>
                                                <Checkbox
                                                    color={colorObj.primarColor}
                                                    status={includeNoFeesTeachers ? "checked" : "unchecked"}
                                                    onPress={() => setIncludeNoFeesTeachers(!includeNoFeesTeachers)}
                                                />
                                                <Pressable onPress={() => setIncludeNoFeesTeachers(true)} style={{ paddingVertical: 5, width: '100%' }} >
                                                    <Text style={[styles.checkBoxText, { textAlign: 'left' }]}>Include Teacher With No Fees</Text>
                                                </Pressable>

                                            </View>

                                        </View>
                                    }
                                    {activeFilterContainer == "sortBy" &&
                                        <View style={{ paddingHorizontal: 20, marginTop: 20, width: wp(50) }}>

                                            <RadioButton.Group onValueChange={newValue => setSortBy(newValue)} value={sortBy}>
                                                <View style={[{ marginVertical: 10 }, styles.flexColumn, { justifyContent: 'space-between' }]}>

                                                    <Pressable onPress={() => setSortBy(sortByText.popularity)} style={[styles.flexRow, { alignItems: 'center' }]}>
                                                        <RadioButton color={colorObj.primarColor} value={sortByText.popularity} />
                                                        <Text style={styles.radioText}>Popularity</Text>
                                                    </Pressable>
                                                    <Pressable onPress={() => setSortBy(sortByText.priceLowToHigh)} style={[styles.flexRow, { alignItems: 'center' }]}>

                                                        <RadioButton color={colorObj.primarColor} value={sortByText.priceLowToHigh} />
                                                        <Text style={styles.radioText}>Price low to high</Text>
                                                    </Pressable>
                                                    <Pressable onPress={() => setSortBy(sortByText.priceHighToLow)} style={[styles.flexRow, { alignItems: 'center' }]}>
                                                        <RadioButton color={colorObj.primarColor} value={sortByText.priceHighToLow} />
                                                        <Text style={styles.radioText}>Price High to low</Text>
                                                    </Pressable>
                                                    <Pressable onPress={() => setSortBy(sortByText.customerRating)} style={[styles.flexRow, { alignItems: 'center' }]}>
                                                        <RadioButton color={colorObj.primarColor} value={sortByText.customerRating} />
                                                        <Text style={styles.radioText}>Customer Rating</Text>
                                                    </Pressable>
                                                </View>
                                            </RadioButton.Group>
                                        </View>
                                    }

                                </View>
                            </View>
                            <View style={[styles.flexRowAlignCenter, { justifyContent: 'space-evenly', width: wp(100), marginTop: 10, backgroundColor: 'white' }]}>
                                <Pressable style={styles.btn} onPress={() => filterBottomSheetRef.current.close()} >
                                    <Text style={styles.btnTxt}>Close</Text>
                                </Pressable>
                                <Pressable style={styles.btn} onPress={() => handleShowFilterResults()}>
                                    <Text style={styles.btnTxt}>Apply</Text>
                                </Pressable>
                            </View>

                        </ScrollView>

                    </>

                </RBSheet>
            </View>
        </>

    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: 20
    },
    topIcons: {
        color: 'black'
    },
    searchInputView: {
        backgroundColor: '#F2F2F2',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 35,
        height: 45,
    },
    input: {
        width: '80%'
    },
    title: {
        fontFamily: 'RedHatText-Regular',
        fontSize: 16,
        color: 'black',
        marginTop: 40
    },
    cardContainer: {
        display: 'flex',
        width: wp(55),
        flexDirection: 'row',
        // justifyContent:"center",
        alignItems: "center",
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 5,
        position: 'relative',
        marginHorizontal: 15

    },
    teacherImgContainer: {
        borderRadius: 50,
        height: 90,
        width: 90,
        left: -30,
        opacity: 1,
        backgroundColor: "white",
        borderColor: "rgba(0,0,0,0.1)",
        borderWidth: 1,
        position: "absolute",
    },
    teacherImg: {
        height: 90,
        width: 90,
        left: 0,
        // textAlign:'center',
        position: "absolute",
        borderRadius: 100
    },
    textCardContainer: {
        paddingLeft: 70,
        paddingVertical: 10,
        minHeight: 90,
        marginTop: 5,
        // backgroundColor:'red',
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
        fontFamily: 'OpenSans-SemiBold', fontSize: 10, color: '#232323'
    },
    textCardMainSubHeading1: {
        fontFamily: 'OpenSans-Regular', fontSize: 9, color: '#7E7E7E', marginTop: 2
    },
    textCardMainSubHeading2: {
        fontFamily: 'OpenSans-Regular', fontSize: 9, color: '#000000', marginTop: 15
    },
    listImage: {
        height: 90,
        width: 100,
        borderRadius: 3
    },
    listView: {
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        backgroundColor: 'white',
        paddingVertical: 2,
        paddingHorizontal: 3,
        marginHorizontal: 5,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    listName: {
        fontSize: 14,
        fontFamily: 'Montserrat-SemiBold',
        color: 'black',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    location: {
        fontSize: 9,
        fontFamily: 'Montserrat-Medium',
        color: '#A3A3A3',
    },
    subject: {
        fontSize: 9,
        fontFamily: 'Montserrat-Medium',
        color: '#A3A3A3',
        // marginTop: 7
    },
    button: {
        fontSize: 10,
        fontFamily: 'Montserrat-SemiBold',
        marginTop: 10
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
        // paddingHorizontal: 20
    },
    bottomSheetOptionText: {
        color: '#333333',
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        marginVertical: 10
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    radioText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
    btn: {
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

    btnTxt: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 13,
        color: colorObj.primarColor,
        // marginTop: 15
    },

    textInput: {
        backgroundColor: '#F5F6FA',
        borderRadius: 5,
        marginVertical: 10,
        width: '100%',
        fontFamily: 'Montserrat-Regular'

    },

    ///filter

    filterSubHeading: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 20,
        color: '#000'
    },

    categoryContainer: {
        backgroundColor: '#f0faf9',
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
        color: '#000',
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
        paddingHorizontal: 20
    },

    flexRowAlignCenter: {
        display: "flex",
        // marginVertical: 15,
        flexDirection: "row",
        alignItems: "center",
    },

    checkBoxText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#000'
    },


    customFilterHeadingBox: {
        paddingVertical: 10
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


    newContainer: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 26,
        paddingVertical: 10,
        marginVertical: 10,
        marginHorizontal: 7,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.18,
        // shadowRadius: 1.00,

        // elevation: 1,
    },
    // categoryName: {
    //     color: colorObj.whiteColor,
    //     textAlign: 'center',
    //     fontFamily: 'OpenSans-Regular',
    // },
    newcategoryName: {
        color: colorObj.whiteColor,
        textAlign: 'center',
        fontSize: 11,
        fontFamily: 'OpenSans-Regular',
        // paddingHorizontal: 20
    },
})