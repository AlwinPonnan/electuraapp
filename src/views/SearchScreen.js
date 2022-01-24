import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView, TextInput } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RBSheet from "react-native-raw-bottom-sheet";
import { colorObj } from '../globals/colors';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import NavBar from '../components/Navbar';
import { getAllCategory } from "../Services/Category"
import { Searchbar } from 'react-native-paper';
import { getAllSubjects } from '../Services/Subjects';
import { addTOWishList, BookmarkTeacher, getAllTeachers, getDecodedToken } from '../Services/User';
import { generateImageUrl, sortByText } from '../globals/utils';
import { getAllForUsersHomePage } from '../Services/Course';
import { getAllBySubject, getAllClasses } from '../Services/Classses';
import { getAllTopics } from '../Services/Topic';
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import { Checkbox } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useIsFocused } from '@react-navigation/native';

export default function SearchScreen(props) {
    const [categoryArr, setCategoryArr] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [teachersArr, setTeachersArr] = useState([]);
    const [mainTeachersArr, setMainTeachersArr] = useState([]);

    const [courseArr, setCourseArr] = useState([]);
    const [mainCourseArr, setMainCourseArr] = useState([]);


    const filterBottomSheetRef = useRef()

    const [subjectArr, setSubjectArr] = useState([]);

    const [classesArr, setClassesArr] = useState([]);
    const [topicArr, setTopicArr] = useState([]);
    const [mainTopicArr, setMainTopicArr] = useState([]);

    const [multiSliderValue, setMultiSliderValue] = useState([10, 550]);

    const [sortBy, setSortBy] = useState(sortByText.popularity);

    const [activeFilterContainer, setActiveFilterContainer] = useState('subject');      ///subject,class,topic,price ,sortby
    ////price range picker

    const [maxFees, setMaxFees] = useState(0);
    const [minFees, setMinFees] = useState(0);

    const [nestedClassArr, setNestedClassArr] = useState([]);
    const [mainNestedClassArr, setMainNestedClassArr] = useState([]);

    const [isScrollEnabled, setIsScrollEnabled] = useState(true);


    const [includeNoFeesTeachers, setIncludeNoFeesTeachers] = useState(false);

    const focused = useIsFocused()

    const onChangeSearch = query => {
        let tempQuery = query.toLowerCase()
        let tempArr = [...mainTeachersArr];
        console.log(JSON.stringify(tempArr, null, 2))
        tempArr = tempArr.filter(el => el?.name.toLowerCase().includes(tempQuery) || el?.enquiryObj?.classesArr?.some(ele => ele.subjectArr?.some(elx => elx?.subjectName?.toLowerCase().includes(tempQuery))))
        setTeachersArr([...tempArr])


        let tempCourseArr = [...mainCourseArr]
        tempCourseArr = tempCourseArr.filter(el => el?.name.toLowerCase().includes(tempQuery) || el?.classesArr?.some(ele => ele.subjectArr?.some(elx => elx?.subjectName?.toLowerCase().includes(tempQuery))) || el?.name.includes(tempQuery))
        setCourseArr([...tempCourseArr])

        setSearchQuery(query)

    };


    const handleBookmarkTeacher = async (id) => {
        try {

            const { data: res } = await BookmarkTeacher(id);
            if (res) {
                // setSuccessAlert(true)
                // setAlertText(`${res.message}`)
                handleOnint()
            }

        } catch (error) {
            console.error(error)
            setIsrefreshing(false)
        }
    }
    const handleAddCourseToWhishlist = async (id) => {
        try {
            let tokenObj = await getDecodedToken()
            let obj = {
                userId: tokenObj?.userId,
                courseId: id
            }
            console.log(obj)
            const { data: res } = await addTOWishList(obj);
            if (res.success) {
                handleOnint()

            }
        } catch (error) {
            console.error(error)

        }
    }

    const getSubjects = async () => {
        try {
            const { data: res } = await getAllSubjects();
            if (res.success) {
                setCategoryArr(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getTeachers = async () => {
        try {
            const { data: res } = await getAllTeachers();
            if (res.success) {

                setTeachersArr(res.data)
                setMainTeachersArr(res.data)
            }

        } catch (error) {
            console.error(error)
        }
    }

    const getCourses = async () => {
        try {
            const { data: res } = await getAllForUsersHomePage();
            if (res.success) {
                let tempArr = res.data;

                let temp = tempArr.map(el => {
                    let obj = {
                        ...el,
                        imgUrl: el?.thumbnailImage?.url ? generateImageUrl(el?.thumbnailImage?.url) : "https://images.unsplash.com/photo-1497002961800-ea7dbfe18696?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1052&q=80",

                    }
                    return obj
                })
                console.log(JSON.stringify(temp, null, 2))
                setCourseArr(temp)
                setMainCourseArr(temp)
            }
        } catch (error) {
            console.error(error)
        }
    }



    const getFilterSubjects = async () => {
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
                // setIsrefreshing(false)
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
                // setIsrefreshing(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getNestedClasses = async () => {
        try {
            const { data: res } = await getAllBySubject();
            if (res.success) {
                setNestedClassArr([...res.data.map(el => {
                    let obj = {
                        ...el,
                        checked: false,
                        classArr: el.classArr.map(elx => ({ ...elx, checked: false }))
                    }
                    return obj
                })])
                setMainNestedClassArr([...res.data.map(el => {
                    let obj = {
                        ...el,
                        checked: false,
                        classArr: el.classArr.map(elx => ({ ...elx, checked: false }))
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
        let tempClassesArr = [...nestedClassArr.filter(elx => elx.classArr.some(elz => elz.checked))]
        let tempSubjectArr = [...subjectArr.filter(elx => elx.checked)]

        tempArr = tempArr.filter(ely => tempSubjectArr.some(ele => ele._id == ely.subjectId));
        tempArr = tempArr.filter(ely => tempClassesArr.some(elz => elz.classArr.some(el => el._id == ely.classId)) || tempSubjectArr.some(ele => ele._id == ely.subjectId));

        // console.log(tempArr)
        setTopicArr([...tempArr])
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
        let tempClassesArr = [...mainNestedClassArr];
        console.log(tempClassesArr)
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
                // setIsrefreshing(false)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const multiSliderValuesChange = values => { console.log(values); setMultiSliderValue(values) };



    const handleOnint = () => {
        getSubjects()
        getTeachers()
        getCourses()
        getTopics();
        getClasses()
        getFilterSubjects()
        getNestedClasses()

    }

    useEffect(() => {
        if (focused) {

            handleOnint()
        }
    }, [focused])



    const handleShowFilterResults = () => {
        // filterBottomSheetRef.current.close()

        let filteredClassesArr = [...classesArr.filter(el => el.checked)]
        let filteredSubjectArr = [...subjectArr.filter(el => el.checked)]
        let filteredTopicArr = [...topicArr.filter(el => el.checked)]


        let tempArr = [...mainCourseArr];

        if (filteredClassesArr.length > 0) {
            console.log("class filter")

            tempArr = tempArr.filter(el => el?.subjectArr?.some(elx => elx.classArr.some(elz => filteredClassesArr.some(elm => elm._id == elz.classId))))


        }
        if (filteredSubjectArr.length > 0) {
            console.log("subject filter")
            tempArr = tempArr.filter(el => el?.subjectArr?.some(elx => filteredSubjectArr.some(ely => ely._id == elx.subjectId)))

        }
        if (filteredTopicArr.length > 0) {
            console.log("Topic filter")
            tempArr = tempArr.filter(el => el?.subjectArr?.some(elx => elx.classArr.some(elz => elz?.topicArr?.length > 0 ? elz.topicArr.some(elm => filteredTopicArr.some(elq => elq._id == elm.topicId)) : false)))
        }

        tempArr = tempArr.filter(el => el.price >= parseInt(multiSliderValue[0]) && el.price <= parseInt(multiSliderValue[1]))


        if (sortBy == sortByText.priceLowToHigh) {
            tempArr = tempArr.sort((a, b) => a.price - b.price)
        }
        else if (sortBy == sortByText.priceHighToLow) {
            tempArr = tempArr.sort((a, b) => b.price - a.price)
        }
        else if (sortBy == sortByText.customerRating) {
            tempArr = tempArr.sort((a, b) => b.rating - a.rating)
        }

        // tempArr = tempArr.filter(el => el?.classesArr?.some(elx => filteredClassesArr.some(ely => ely._id == elx.classId) || elx.subjectArr.some(elz => filteredSubjectArr.some(elm => elm._id == elz.subjectId))) || (el.price>=multiSliderValue[0] && el.price<=multiSliderValue[1] ) )

        setCourseArr([...tempArr])


        //filter teachers
        // let filteredClassesArr = [...classesArr.filter(el => el.checked)]
        // let filteredSubjectArr = [...subjectArr.filter(el => el.checked)]
        let tempTeachersArr = [...mainTeachersArr];
        console.log(JSON.stringify(mainTeachersArr, null, 2))
        if (filteredClassesArr.length > 0) {
            // console.log("class filter")

            tempTeachersArr = tempTeachersArr.filter(el => el?.enquiryObj?.subjectArr?.some(elx => elx.classArr.some(elz => filteredClassesArr.some(elm => elm._id == elz.classId))))

        }
        if (filteredSubjectArr.length > 0) {
            // console.log("subject filter")
            tempTeachersArr = tempTeachersArr.filter(el => el?.enquiryObj?.subjectArr?.some(elx => filteredSubjectArr.some(ely => ely._id == elx.subjectId)))
        }

        if (includeNoFeesTeachers) {
            let prevInstance = tempTeachersArr.filter(el => !el.enquiryObj?.feesObj?.minFees && !el.enquiryObj?.feesObj?.maxFees);
            tempTeachersArr = [...tempTeachersArr.filter(el => el.enquiryObj?.feesObj?.minFees >= parseInt(multiSliderValue[0]) && el.enquiryObj?.feesObj?.maxFees <= parseInt(multiSliderValue[1])), ...prevInstance]
        }
        else {
            tempTeachersArr = tempTeachersArr.filter(el => !(!el.enquiryObj?.feesObj?.minFees && !el.enquiryObj?.feesObj?.maxFees)).filter(el => el.enquiryObj?.feesObj?.minFees >= parseInt(multiSliderValue[0]) && el.enquiryObj?.feesObj?.maxFees <= parseInt(multiSliderValue[1]))

        }


        if (sortBy == sortByText.priceLowToHigh) {
            tempTeachersArr = tempTeachersArr.sort((a, b) => a.enquiryObj?.feesObj?.maxFees - b.enquiryObj?.feesObj?.maxFees)
        }
        else if (sortBy == sortByText.priceHighToLow) {
            tempTeachersArr = tempTeachersArr.sort((a, b) => b.enquiryObj?.feesObj?.maxFees - a.enquiryObj?.feesObj?.maxFees)
        }


        console.log(tempTeachersArr)
        setTeachersArr([...tempTeachersArr])

        filterBottomSheetRef.current.close()




        // filterBottomSheetRef.current.close()
    }

    const handleSubjectSelectionTop = async (id) => {
        let tempArr = [...mainTeachersArr];
        console.log(JSON.stringify(tempArr, null, 2))
        tempArr = tempArr.filter(el => el.enquiryObj.classesArr.some(ele => ele.subjectArr.some(elx => elx.subjectId == id)))
        setTeachersArr([...tempArr])


        let tempCourseArr = [...mainCourseArr]
        tempCourseArr = tempCourseArr.filter(el => el.classesArr.some(ele => ele.subjectArr.some(elx => elx.subjectId == id)))
        setCourseArr([...tempCourseArr])

        setSelectedSubjectId(id)
    }


    const renderItem = ({ item, index }) => {
        return (
            <Pressable style={styles.cardContainer} onPress={() => props.navigation.navigate("CourseDetail", { data: item._id })} >
                <Image style={styles.courseImg} source={{ uri: item?.imgUrl }} />
                <View style={styles.textCardContainer}>
                    <View>

                        <Pressable onPress={() => handleAddCourseToWhishlist(item._id)} style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={[styles.textCardMainHeading, { fontFamily: 'RedHatText-Medium', fontSize: 12 }]}>{item?.name}</Text>
                            {item.isWishListed ?

                                <Icon name="heart" size={14} color={colorObj.primarColor} />

                                :
                                <Icon name="heart-outline" size={14} color={colorObj.primarColor} />

                            }
                        </Pressable>
                        <Text style={[styles.textCardMainSubHeading1, { fontFamily: 'RedHatText-Regular', fontSize: 10 }]}>{item?.teacherName}</Text>
                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={[styles.textCardMainSubHeading2, { fontFamily: 'RedHatDisplay-Medium', fontSize: 10 }]}>₹{item?.price}</Text>
                            <Text style={styles.textCardMainSubHeading2}><Icon name="star" size={14} color={colorObj.primarColor} />{item.rating}</Text>
                        </View>
                    </View>

                </View>
            </Pressable>
        )
    }
    const renderInstructorItem = ({ item, index }) => {
        return (
            <Pressable style={styles.cardInstructorContainer} onPress={() => props.navigation.navigate("TeacherProfile", { data: item._id })} >
                <View style={styles.teacherImgContainer}>

                    <Image style={styles.teacherInstructorImg} source={{ uri: item?.profileImage ? generateImageUrl(item?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }} />
                </View>
                <View style={styles.textCardInstructorContainer}>
                    <View>

                        <Text style={{ fontFamily: 'OpenSans-SemiBold', fontSize: 10, color: '#232323' }}>{item?.name}</Text>
                        <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 9, color: '#7E7E7E', marginTop: 2 }}>{item?.enquiryObj?.classesArr?.reduce((acc, el) => acc + el.className + ',', '')}</Text>
                        <Text style={{ fontFamily: 'OpenSans-Regular', fontSize: 9, color: '#000000', marginTop: 15 }}>{item?.enquiryObj?.experience} Year Experience</Text>
                    </View>
                    <Pressable onPress={() => handleBookmarkTeacher(item?._id)} style={{ position: 'absolute', top: 5, right: 10 }} >
                        {item?.enquiryObj?.bookmarked ?
                            <Icon name="bookmark" size={14} color={colorObj?.primarColor} />

                            :

                            <Icon name="bookmark-outline" size={14} color={colorObj?.primarColor} />

                        }
                    </Pressable>
                </View>
            </Pressable>
        )
    }



    const renderCategoryItem = ({ item, index }) => {
        return (
            <Pressable onPress={() => { handleSubjectSelectionTop(item._id) }} style={[styles.categoryContainer, selectedSubjectId != item._id && { backgroundColor: '#f0faf9' }]}>
                {item?.thumbnailImage &&
                    <Image source={{ uri: generateImageUrl(item?.thumbnailImage) }} style={{ height: 12, width: 12, marginRight: 3 }} />
                }
                {/* <Icon name="film-outline" size={14} /> */}
                <Text style={[styles.categoryName, selectedSubjectId != item._id && { color: '#828282' }]}>{item.name}</Text>
            </Pressable>
        )
    }
    return (
        <View style={styles.container}>
            <NavBar rootProps={props} />
            <View style={[styles.searchInputView]}>
                <AntDesign name='search1' size={20} style={[styles.topIcons, { marginRight: 15 }]} />
                <TextInput
                    style={styles.input}
                    placeholder="Search Categories"
                    onChangeText={(e) => onChangeSearch(e)}
                />
                <Pressable style={{ width: wp(20), height: 30, alignItems: 'center' }} onPress={() => filterBottomSheetRef.current.open()}>
                    <Image source={require('../../assets/images/Filter.png')} style={{ marginTop: 10 }} />
                </Pressable>
            </View>

            <ScrollView>

                <FlatList
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    data={categoryArr}
                    renderItem={renderCategoryItem}
                    // numColumns={3}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    // columnWrapperStyle={{ justifyContent: 'space-between' }}
                    keyExtractor={(item, index) => `${index}`}
                />
                <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                    <Text style={[styles.headingAboveCard, { fontFamily: 'RedHatText-Medium' }]}>Recommended Courses</Text>
                    <Pressable onPress={() => props.navigation.navigate("MainDrawer", { screen: "MainBottomTab", params: { screen: "Courses", params: { screen: "AllCourses" } } })}>

                        <Text style={[styles.viewAllText, { fontFamily: 'RedHatText-Regular' }]}>View All</Text>
                    </Pressable>
                </View>

                <FlatList
                    horizontal
                    data={courseArr}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={{ fontFamily: 'Montserrat-Regular', padding: 10 }}>No Courses found</Text>
                    }
                    keyExtractor={(item, index) => `${index}`}
                />
                <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                    <Text style={[styles.headingAboveCard, { fontFamily: 'RedHatText-Medium' }]}>Top Instructors</Text>
                    <Pressable onPress={() => props.navigation.navigate("AllTeacher")}>

                        <Text style={[styles.viewAllText, { fontFamily: 'RedHatText-Regular' }]}>View All</Text>

                    </Pressable>
                </View>

                <FlatList
                    style={{ height: 150 }}
                    horizontal
                    data={teachersArr}
                    renderItem={renderInstructorItem}
                    ListEmptyComponent={
                        <Text style={{ fontFamily: 'Montserrat-Regular', padding: 10 }}>No Results found</Text>
                    }
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                />

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

                                        <Text style={[styles.bottomSheetHeading, { fontSize: 14, paddingHorizontal: 10 }]}>Subcategory</Text>
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
                                            <Text style={[styles.bottomSheetHeading, { fontSize: 14, marginTop: 20 }]}>₹ {multiSliderValue[0]} - ₹ {multiSliderValue[1]} </Text>
                                            <MultiSlider
                                                values={[multiSliderValue[0], multiSliderValue[1]]}
                                                sliderLength={250}
                                                onValuesChange={multiSliderValuesChange}
                                                min={10}
                                                max={10000}
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



            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FEFEFE',
        flex: 1,
    },
    searchBar: {
        width: wp(95),
        display: "flex",
        alignSelf: "center",
        borderRadius: 10,
        marginVertical: 15,
        fontSize: 10,
        fontFamily: 'RedHatText-Regular',
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
    cardContainer: {
        width: wp(40),
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        borderRadius: 14,
        marginHorizontal: 10,
        marginVertical: 10,
        paddingVertical: 3,
    },
    textCardContainer: {
        paddingHorizontal: 7,
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
    headingAboveCard: {
        fontSize: 16, fontFamily: 'OpenSans-SemiBold', color: '#303030', paddingLeft: 13, marginTop: 10
    },
    viewAllText: {
        fontSize: 14, fontFamily: 'OpenSans-Regular', color: '#828282', paddingRight: 13, marginTop: 10
    },
    // categoryContainer: {
    //     backgroundColor: colorObj.primarColor,
    //     borderRadius: 26,
    //     paddingVertical: 10,
    //     marginVertical: 10,
    //     marginHorizontal: 10,
    //     display: 'flex',
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     justifyContent: 'space-evenly'
    // },

    categoryName: {
        color: colorObj.whiteColor,
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
        paddingHorizontal: 20
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





    //instructor

    cardInstructorContainer: {
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
    textCardInstructorContainer: {
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


    teacherInstructorImg: {
        height: 90,
        width: 90,
        left: 0,
        // textAlign:'center',
        position: "absolute",
        borderRadius: 100
    },
    teacherImgContainer: {
        borderRadius: 50,
        height: 90,
        width: 90,
        left: -10,
        opacity: 1,
        backgroundColor: "white",
        borderColor: "rgba(0,0,0,0.1)",
        borderWidth: 1,
        position: "absolute",
    },





    ///category
    categoryCard: {
        // width: wp(30),
        // // height: 80,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // paddingHorizontal: 20,
        // // marginHorizontal: 10,
        // marginVertical: 10,
        // elevation: 5,
        // backgroundColor: colorObj.whiteColor,
        // borderRadius: 10


        backgroundColor: colorObj.primarColor,
        borderRadius: 26,
        width: wp(30),

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
    categoryImage: {
        height: 40,
        width: 40,
        borderRadius: 100,
    },
    cardCategoryName: {
        textAlign: 'center',
        fontFamily: 'Montserrat-SemiBold',
        paddingHorizontal: 10,
        color: '#232323'
    },
    teacherImg: {
        height: 90,
        width: 90,
        left: 0,
        // textAlign:'center',
        position: "absolute",
        borderRadius: 100
    },
    searchInputView: {
        backgroundColor: '#F2F2F2',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 35,
        width: wp(90),
        alignSelf: 'center'
    },
    input: {
        width: '70%'
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
        backgroundColor: colorObj.primarColor,
        borderRadius: 26,
        paddingVertical: 10,
        marginVertical: 10,
        marginHorizontal: 7,
        paddingHorizontal: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryName: {
        color: colorObj.whiteColor,
        textAlign: 'center',
        fontSize: 11,
        fontFamily: 'OpenSans-Regular',
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
    }


})
