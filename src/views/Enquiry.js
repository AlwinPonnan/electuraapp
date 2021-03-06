import React, { useState, useEffect, useContext, useRef } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj, light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import NavBar from '../components/Navbar';
import { checkNcreateChatRoom, getAllEnquiries, updateEnquiryStatusById } from '../Services/Enquiry';
import { useIsFocused } from '@react-navigation/core';

import { FAB, RadioButton } from 'react-native-paper';

import { generateImageUrl, sortByText } from '../globals/utils'
import EnquiryStatuses from '../globals/EnquiryStatus';

import { loadingContext, roleContext } from '../navigators/stacks/RootStack';
import EnquiryTypes from '../globals/EnquiryTypes';
import { successAlertContext } from '../../App';

import RBSheet from "react-native-raw-bottom-sheet";
import { getAllClasses } from '../Services/Classses';
import { getAllTopics } from '../Services/Topic';
import { getAllSubjects } from '../Services/Subjects';
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import { Checkbox } from 'react-native-paper';
export default function Enquiry(props) {
    const [roleName, setRoleName] = useContext(roleContext);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [enquiryArr, setEnquiryArr] = useState([]);
    const [mainEnquiryArr, setMainEnquiryArr] = useState([]);


    const [activeFilterContainer, setActiveFilterContainer] = useState('subject');      ///subject,class,topic,price ,sortby
    ////price range picker

    const [maxFees, setMaxFees] = useState(0);
    const [minFees, setMinFees] = useState(0);
    const Focused = useIsFocused()

    const [optionsModal, setOptionsModal] = useState(false);

    const [selectedEnquriyObj, setSelectedEnquriyObj] = useState({});

    const [selectedEnquiryStatus, setSelectedEnquiryStatus] = useState(EnquiryStatuses.OPEN);


    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr


    const [loading, setLoading] = useContext(loadingContext);


    const [searchQuery, setSearchQuery] = useState('');
    const filterBottomSheetRef = useRef()

    const [subjectArr, setSubjectArr] = useState([]);

    const [classesArr, setClassesArr] = useState([]);
    const [topicArr, setTopicArr] = useState([]);
    const [mainTopicArr, setMainTopicArr] = useState([]);

    const [multiSliderValue, setMultiSliderValue] = useState([10, 250]);

    const [sortBy, setSortBy] = useState("general");

    const [isScrollEnabled, setIsScrollEnabled] = useState(true);

    const getYourEnquires = async () => {
        setLoading(true)
        setIsRefreshing(true)
        try {
            const { data: res } = await getAllEnquiries();
            console.log(JSON.stringify(res, null, 2))
            if (res.success) {
                console.log("asdsada")
                console.log(JSON.stringify(res.data, null, 2))
                setEnquiryArr(res.data.map(el => {
                    let obj = {
                        ...el,
                        checked: false
                    }
                    return obj
                }))
                setMainEnquiryArr(res.data.map(el => {
                    let obj = {
                        ...el,
                        checked: false
                    }
                    return obj
                }))
                let maxCount = 0;
                let minCount = res?.data[0]?.price ? parseInt(res?.data[0]?.price) : 0;
                let tempArr = [...res.data.map(el => {

                    if (parseInt(el?.price) > maxCount) {
                        maxCount = parseInt(el?.price)
                    }
                    if (parseInt(el?.price) < minCount)
                        minCount = parseInt(el?.price)
                    return el
                })]
                if (maxCount == minCount) {
                    maxCount += maxCount
                }
                setMinFees(minCount)
                setMaxFees(maxCount)
                console.log(maxCount, minCount)
            }
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
        setIsRefreshing(false)
    }


    const handleEnquiryStatusUpdate = async () => {
        try {

            const { data: res } = await updateEnquiryStatusById(selectedEnquriyObj._id, { enquiryStatus: selectedEnquiryStatus });
            if (res.success) {
                handleOnint()
                setOptionsModal(false)
                setSuccessAlert(true)
                setAlertText(`${res.message}`)

            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleEnquirySelection = (id) => {
        console.log(id)
        setEnquiryArr(prevState => {
            let index = prevState.findIndex(el => el._id == id);
            if (index != -1) {

                prevState[index].checked = !prevState[index].checked;
                console.log(JSON.stringify(prevState,null,2))
            }
            return [...prevState]
        })
    }

    const handleOnint = () => {
        getYourEnquires()
        getSubjects()
        getClasses()
        getTopics()
    }


    const handleOptionsModal = (obj) => {
        setSelectedEnquriyObj(obj);
        setSelectedEnquiryStatus(obj.enquiryStatus)
        setOptionsModal(true)
    }


    const handleChatButtonClick = async (id, id2) => {
        setLoading(true)
        try {
            console.log(id);
            const { data: res } = await checkNcreateChatRoom(id, id2);
            if (res.success) {
                props.navigation.navigate("MainTopTab")
            }
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }



    const handleSearch = (value) => {
        let tempStr = value.toLowerCase();
        let tempArr = [...mainEnquiryArr]
        tempArr = tempArr.filter(el =>
            el?.enquiryType.toLowerCase().includes(tempStr) ||
            el?.teacherObj?.name.toLowerCase().includes(tempStr) ||
            el?.teacherObj?.name.toLowerCase().includes(tempStr) ||
            el?.subjectName.toLowerCase().includes(tempStr) ||
            el?.topicName.toLowerCase().includes(tempStr) ||
            el?.className.toLowerCase().includes(tempStr))
        setEnquiryArr([...tempArr])
    }

    const getSubjects = async () => {
        try {
            const { data: res } = await getAllSubjects();
            if (res.success) {
                setSubjectArr([...res.data.map(el => {
                    let obj = {
                        ...el,
                        checked: false
                    }
                    return obj
                })])
            }
        } catch (error) {
            console.error(error)
        }
    }
    const getClasses = async () => {
        try {
            const { data: res } = await getAllClasses();
            if (res.success) {
                setClassesArr([...res.data.map(el => {
                    let obj = {
                        ...el,
                        checked: false
                    }
                    return obj
                })])
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleTopicFilter = () => {
        let tempArr = [...mainTopicArr];
        let tempClassesArr = [...classesArr.filter(elx => elx.checked)]
        let tempSubjectArr = [...subjectArr.filter(elx => elx.checked)]

        tempArr = tempArr.filter(ely => tempClassesArr.some(ele => ele._id == ely.classId) || tempSubjectArr.some(ele => ele._id == ely.subjectId));
        console.log(tempArr)
        setTopicArr([...tempArr])
    }

    const handleSubjectSelection = (id) => {
        setSubjectArr(prevState => {
            let tempIndex = prevState.findIndex(el => el._id == id);
            if (tempIndex != -1)
                prevState[tempIndex].checked = !prevState[tempIndex].checked
            return [...prevState]
        })
        handleTopicFilter()
    }
    const handleClassSelection = (id) => {
        setClassesArr(prevState => {
            let tempIndex = prevState.findIndex(el => el._id == id);
            if (tempIndex != -1)
                prevState[tempIndex].checked = !prevState[tempIndex].checked
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

    const getTopics = async () => {
        try {
            const { data: res } = await getAllTopics();
            if (res.success) {
                setTopicArr([...res.data.map(el => {
                    let obj = {
                        ...el,
                        checked: false
                    }
                    return obj
                })])
                setMainTopicArr([...res.data.map(el => {
                    let obj = {
                        ...el,
                        checked: false
                    }
                    return obj
                })])
            }
        } catch (error) {
            console.error(error)
        }
    }

    const multiSliderValuesChange = values => { console.log(values); setMultiSliderValue(values) };

    const handleShowFilterResults = () => {
        // filterBottomSheetRef.current.close()



        let filteredClassesArr = [...classesArr.filter(el => el.checked)]
        let filteredSubjectArr = [...subjectArr.filter(el => el.checked)]
        let filteredTopicArr = [...topicArr.filter(el => el.checked)]

        let tempArr = [...mainEnquiryArr];

        if (filteredClassesArr.length > 0) {
            console.log("class filter")

            tempArr = tempArr.filter(el => filteredClassesArr.some(ely => ely._id == el.classId))

        }
        if (filteredSubjectArr.length > 0) {
            console.log("subject filter")
            tempArr = tempArr.filter(el => filteredSubjectArr.some(ele => ele._id == el.subjectId))
        }
        if (filteredTopicArr.length > 0) {
            console.log("subject filter")
            tempArr = tempArr.filter(el => filteredTopicArr.some(ele => ele._id == el.topicId))
        }


        tempArr = tempArr.filter(el => el.price >= parseInt(multiSliderValue[0]) || el.price <= parseInt(multiSliderValue[1])).filter(el => el.enquiryType.toLowerCase() == sortBy.toLowerCase())


        // tempArr = tempArr.filter(el => filteredClassesArr.some(ele => ele._id == el.classId) || filteredSubjectArr.some(ele => ele._id == el.subjectId) || (el.price >= multiSliderValue[0] && el.price <= multiSliderValue[1]))
        // console.log(tempArr)
        setEnquiryArr([...tempArr])
        filterBottomSheetRef.current.close()
    }

    useEffect(() => {
        if (Focused) {

            handleOnint()
        }
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
                                <TextInput style={styles.searchInput} placeholder="Search enquiries" onChangeText={(e) => handleSearch(e)} placeholderTextColor="#828282" />
                            </View>
                            <Pressable onPress={() => filterBottomSheetRef.current.open()}>

                                <Icon name="options-outline" size={20} color="#828282" />
                            </Pressable>
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
                            <Text style={{ marginTop: 20, }}>No Enquiries yet !</Text>
                        }
                        onRefresh={() => getYourEnquires()}
                        refreshing={isRefreshing}
                        scrollEnabled={true}
                        nestedScrollEnabled={true}
                        renderItem={({ item, index }) => {
                            return (
                                <>
                                    <Pressable style={[styles.enquiryListHeader, { backgroundColor: item.enquiryType == "ONETOONE" ? "#f7f7f7" : "#fff" }]} onPress={() => handleEnquirySelection(item._id)} >
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
                                                {item?.ClassType == "Immediately" &&
                                                    <Text style={[styles.ListHeaderStatus, { borderColor: "#EB5757", color: "#EB5757", borderWidth: 1, borderRadius: 3, marginHorizontal: 2 }]}>Immediate</Text>
                                                }
                                                {item?.ClassType == "Within a week" &&
                                                    <Text style={[styles.ListHeaderStatus, { borderColor: "#EB5757", color: "#EB5757", borderWidth: 1, borderRadius: 3, marginHorizontal: 2 }]}>Immediate</Text>
                                                }


                                            </View>
                                            <Pressable onPress={() => { handleOptionsModal(item) }}>

                                                <Icon name="ellipsis-vertical-outline" size={20} color="#828282" />
                                            </Pressable>

                                        </View>
                                        <View style={[styles.flexRowAlignCenter, { marginTop: 7, justifyContent: "space-between" }]}>
                                            {
                                                item?.enquiryType == EnquiryTypes.GENERAL ?
                                                    <Text style={styles.ListHeaderDescription}>
                                                        Class : {item?.className},Subject :{item?.subjectName} , Topic :{item?.topicName}
                                                    </Text>
                                                    :
                                                    <Text style={styles.ListHeaderDescription}>
                                                        {item?.teacherObj?.name} | {item?.enquiryType}
                                                    </Text>
                                            }
                                            <TouchableOpacity onPress={() => handleEnquirySelection(item?._id)}>
                                                <Icon name="chevron-down-outline" size={20} color="#828282" />
                                            </TouchableOpacity>
                                        </View>
                                    </Pressable>
                                    {item.checked &&

                                        <ScrollView style={[styles.EnquiryContainer, { maxHeight: hp(35) }]}>
                                            <FlatList
                                                data={item?.enquiryResponses}
                                                keyExtractor={(item, index) => `${index}`}
                                                scrollEnabled={false}
                                                ListEmptyComponent={
                                                    <View style={styles.card}>
                                                        {item?.enquiryType != EnquiryTypes.GENERAL ?
                                                            <>{item?.acceptedByTeacher ?
                                                                <Text style={[styles.cardHeading, { marginTop: 5 }]}>Enquiry Accepted By Teacher</Text>

                                                                :
                                                                <Text style={[styles.cardHeading, { marginTop: 5 }]}>You do not have any responses yet !</Text>

                                                            }
                                                            </>
                                                            :
                                                            <Text style={[styles.cardHeading, { marginTop: 5 }]}>You do not have any responses yet !</Text>

                                                        }
                                                    </View>
                                                }
                                                renderItem={({ item: itemX, index: indexX }) => {
                                                    return (
                                                        <View style={styles.card}>
                                                            <View style={styles.flexRow}>
                                                                <Image source={{ uri: generateImageUrl(itemX.userObj?.profileImage) }} style={styles.cardImage} />
                                                                <View style={[styles.flexColumn, { justifyContent: "center" }]}>
                                                                    <Text style={styles.cardHeading}>{itemX?.userObj?.name}</Text>
                                                                    <Text style={[styles.cardSmallData, { width: wp(60) }]}>{itemX?.message} . {new Date(itemX.createdAt).toDateString()},{new Date(itemX.createdAt).toLocaleTimeString()}</Text>
                                                                </View>

                                                            </View>
                                                            <Pressable onPress={() => handleChatButtonClick(itemX?.teacherId, item._id)}>
                                                                <Icon name="chatbubble-ellipses-outline" size={20} color={"black"} />
                                                            </Pressable>
                                                        </View>
                                                    )
                                                }}
                                            />
                                        </ScrollView>
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
                    {
                        roleName == "TEACHER" &&

                        <FAB
                            style={styles.fab}
                            small
                            color={colorObj.whiteColor}

                            // icon="plus"
                            label="General Enquiries"
                            onPress={() => props.navigation.navigate('GeneralEnquiries')}
                        />
                    }
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


                            <View style={styles.bottomSheetInnerContainer}>
                                <View style={[styles.flexRowAlignCenter, { justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colorObj.greyColor, paddingBottom: 10 }]}>
                                    <Text style={[styles.filterSubHeading, { paddingHorizontal: 10 }]}>Filter</Text>
                                    <Text style={[styles.filterSubHeading, { color: colorObj.primarColor, fontSize: 14, paddingHorizontal: 10 }]}>Clear All</Text>
                                </View>
                                <View style={[styles.flexRowAlignCenter]}>

                                    <View style={[styles.flexColumn, { height: hp(90), width: wp(30), backgroundColor: '#fafafa' }]}>
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
                                    <View style={[styles.flexColumn, { height: hp(90) }]}>
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
                                                                <Checkbox
                                                                    color={colorObj.primarColor}
                                                                    status={item.checked ? "checked" : "unchecked"}
                                                                    onPress={() => handleSubjectSelection(item._id)}
                                                                />
                                                                <Pressable onPress={() => handleSubjectSelection(item._id)} style={{ paddingVertical: 5, width: '100%' }} >
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
                                                data={classesArr}
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
                                                                    onPress={() => handleClassSelection(item._id)}
                                                                />
                                                                <Pressable onPress={() => handleClassSelection(item._id)} style={{ paddingVertical: 5, width: '100%' }} >
                                                                    <Text style={[styles.checkBoxText, { textAlign: 'left' }]}>{item.name}</Text>

                                                                </Pressable>

                                                            </View>

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
                                            <View style={{ paddingHorizontal: 20, marginTop: 50 }}>
                                                <Text style={[styles.bottomSheetHeading, { fontSize: 16 }]}>Selected Price Range</Text>
                                                <Text style={[styles.bottomSheetHeading, { fontSize: 14 }]}>??? {multiSliderValue[0]} - ??? {multiSliderValue[1]} </Text>
                                                <MultiSlider
                                                    values={[multiSliderValue[0], multiSliderValue[1]]}
                                                    sliderLength={250}
                                                    onValuesChange={multiSliderValuesChange}
                                                    min={minFees}
                                                    max={maxFees}
                                                    step={50}
                                                    // allowOverlap
                                                    // snapped
                                                    // enableLabel
                                                    //  customLabel={CustomLabel}
                                                    onValuesChangeStart={() => setIsScrollEnabled(false)}
                                                    onValuesChangeFinish={() => setIsScrollEnabled(true)}
                                                />
                                            </View>
                                        }
                                        {activeFilterContainer == "sortBy" &&
                                            <View style={{ paddingHorizontal: 20, marginTop: 50, width: wp(50) }}>

                                                <RadioButton.Group onValueChange={newValue => setSortBy(newValue)} value={sortBy}>
                                                    <View style={[{ marginVertical: 10 }, styles.flexColumn, { justifyContent: 'space-between' }]}>

                                                        <Pressable onPress={() => setSortBy('General')} style={[styles.flexRow, { alignItems: 'center' }]}>
                                                            <RadioButton color={colorObj.primarColor} value="general" />
                                                            <Text style={styles.radioText}>General</Text>
                                                        </Pressable>
                                                        <Pressable onPress={() => setSortBy('specific')} style={[styles.flexRow, { alignItems: 'center' }]}>

                                                            <RadioButton color={colorObj.primarColor} value="specific" />
                                                            <Text style={styles.radioText}>Specific</Text>
                                                        </Pressable>
                                                        <Pressable onPress={() => setSortBy('slot')} style={[styles.flexRow, { alignItems: 'center' }]}>
                                                            <RadioButton color={colorObj.primarColor} value="slot" />
                                                            <Text style={styles.radioText}>Slot</Text>
                                                        </Pressable>
                                                        <Pressable onPress={() => setSortBy('Connect')} style={[styles.flexRow, { alignItems: 'center' }]}>
                                                            <RadioButton color={colorObj.primarColor} value="connect" />
                                                            <Text style={styles.radioText}>Connect Now</Text>
                                                        </Pressable>
                                                    </View>
                                                </RadioButton.Group>

                                            </View>
                                        }

                                    </View>
                                </View>

                            </View>

                            <View style={[styles.flexRowAlignCenter, { justifyContent: 'space-evenly', width: wp(100), position: 'absolute', bottom: 0, backgroundColor: 'white' }]}>
                                <Pressable style={styles.btn} onPress={() => filterBottomSheetRef.current.close()} >
                                    <Text style={styles.btnTxt}>Close</Text>
                                </Pressable>
                                <Pressable style={styles.btn} onPress={() => handleShowFilterResults()} >
                                    <Text style={styles.btnTxt}>Apply</Text>
                                </Pressable>
                            </View>
                        </>

                    </RBSheet>




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
        color: "black",
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


    listImage: {
        height: 100,
        width: 100,
        borderRadius: 7
    },
    listView: {
        borderBottomRightRadius: 10,
        shadowColor: "rgba(0,0,0,0.3)",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        padding: 15,
        // paddingVertical: 20,
        elevation: 2,
        // width: '100%',
        // height: '100%',
        // position: 'relative',
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
        fontSize: 10,
        fontFamily: 'Montserrat-Regular',
        color: '#A3A3A3',
        marginTop: 7
    },
    subject: {
        fontSize: 10,
        fontFamily: 'Montserrat-Regular',
        color: '#A3A3A3',
        marginTop: 7
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
    }
})