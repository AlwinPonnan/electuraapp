import React, { useState, useEffect, useContext, useRef } from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/core';
import { getAllForUsersHomePage } from '../Services/Course';
import { generateImageUrl, sortByText } from '../globals/utils';
import RBSheet from "react-native-raw-bottom-sheet";
import { colorObj } from '../globals/colors';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import { addToCart, getDecodedToken } from '../Services/User';
import { successAlertContext } from '../../App';
import { loadingContext } from '../navigators/stacks/RootStack';
import { getAllClasses } from '../Services/Classses';
import { getAllTopics } from '../Services/Topic';
import { getAllSubjects } from '../Services/Subjects';
import MultiSlider from '@ptomasroos/react-native-multi-slider'

import { Checkbox } from 'react-native-paper';

export default function AllCourses(props) {

    const [loading, setLoading] = useContext(loadingContext);
    const [isrefreshing, setIsrefreshing] = useState(false);
    const [courseArr, setCourseArr] = useState([]);
    const [mainCourseArr, setMainCourseArr] = useState([]);

    const [activeFilterContainer, setActiveFilterContainer] = useState('subject');      ///subject,class,topic,price ,sortby
    ////price range picker

    const [maxFees, setMaxFees] = useState(0);
    const [minFees, setMinFees] = useState(0);

    const focused = useIsFocused()
    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)
    const filterBottomSheetRef = useRef()

    const [subjectArr, setSubjectArr] = useState([]);

    const [classesArr, setClassesArr] = useState([]);
    const [topicArr, setTopicArr] = useState([]);
    const [mainTopicArr, setMainTopicArr] = useState([]);

    const [multiSliderValue, setMultiSliderValue] = useState([10, 550]);

    const [sortBy, setSortBy] = useState(sortByText.popularity);

    const [isScrollEnabled, setIsScrollEnabled] = useState(true);

    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr


    const getCourses = async () => {
        try {
            setIsrefreshing(true)
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
                let maxCount = 0;
                let minCount = res?.data[0]?.price ? res?.data[0]?.price : 0;
                let tempCourseArr = [...res.data.map(el => {

                    if (el?.price > maxCount) {
                        maxCount = el?.price
                    }
                    if (el?.price < minCount)
                        minCount = el?.price
                    return el
                })]
                setMaxFees(maxCount)
                setMinFees(minCount)
                console.log(JSON.stringify(temp, null, 2))
                setCourseArr(temp)
                setMainCourseArr(temp)
                setIsrefreshing(false)

            }
        } catch (error) {
            console.error(error)
            setIsrefreshing(false)
        }
    }


    const getSubjects = async () => {
        try {
            setIsrefreshing(true)
            const { data: res } = await getAllSubjects();
            if (res.success) {
                setSubjectArr([...res.data.map(el => {
                    let obj = {
                        ...el,
                        checked: false
                    }
                    return obj
                })])
                setIsrefreshing(false)
            }

        } catch (error) {
            console.error(error)
            setIsrefreshing(false)
        }
    }
    const getClasses = async () => {
        try {
            setIsrefreshing(true)
            const { data: res } = await getAllClasses();
            if (res.success) {
                setClassesArr([...res.data.map(el => {
                    let obj = {
                        ...el,
                        checked: false
                    }
                    return obj
                })])
                setIsrefreshing(false)
            }
        } catch (error) {
            console.error(error)
            setIsrefreshing(false)
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
            setIsrefreshing(true)
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
                setIsrefreshing(false)
            }
        } catch (error) {
            console.error(error)
            setIsrefreshing(false)
        }
    }

    const multiSliderValuesChange = values => { console.log(values); setMultiSliderValue(values) };

    const handleOnint = () => {
        getCourses()
        getSubjects()
        getClasses()
        getTopics()
    }


    const handleShowFilterResults = () => {
        // filterBottomSheetRef.current.close()

        let filteredClassesArr = [...classesArr.filter(el => el.checked)]
        let filteredSubjectArr = [...subjectArr.filter(el => el.checked)]


        let tempArr = [...mainCourseArr];

        if (filteredClassesArr.length > 0) {
            console.log("class filter")

            tempArr = tempArr.filter(el => el?.classesArr?.some(elx => filteredClassesArr.some(ely => ely._id == elx.classId)))

        }
        if (filteredSubjectArr.length > 0) {
            console.log("subject filter")
            tempArr = tempArr.filter(el => el?.classesArr?.some(elx => elx.subjectArr.some(elz => filteredSubjectArr.some(elm => elm._id == elz.subjectId))))
        }

        tempArr = tempArr.filter(el => el.price >= parseInt(multiSliderValue[0]) || el.price <= parseInt(multiSliderValue[1]))

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
        filterBottomSheetRef.current.close()
    }

    const handleSearch = (e) => {
        let tempArr = [...mainCourseArr]
        let query = e.toLowerCase()
        tempArr = tempArr.filter(el => el.name.toLowerCase().includes(query) || el?.classesArr?.some(ele => ele.subjectArr.some(elx => elx.subjectName.toLowerCase().includes(query))))
        setCourseArr([...tempArr])
    }

    const handleAddCourseToCart = async (id) => {
        setLoading(true)
        try {
            let tokenObj = await getDecodedToken()
            let obj = {
                userId: tokenObj?.userId,
                courseId: id
            }
            console.log(obj)
            const { data: res } = await addToCart(obj);
            if (res.success) {
                setAlertText(res.message);
                setSuccessAlert(true)
            }
        } catch (error) {
            console.error(error)
            if (error.response.data.message) {
                setErrorAlert(true)
                setAlertText(error.response.data.message)
            }
            else {
                setErrorAlert(true)
                setAlertText(error.message)
            }
        }
        setLoading(false)
    }


    useEffect(() => {
        handleOnint()
    }, [focused])


    const renderItem = ({ item, index }) => {
        return (
            <Pressable style={styles.cardContainer} onPress={() => props.navigation.navigate("CourseDetail", { data: item._id })} >
                <Image style={styles.courseImg} source={{ uri: item?.imgUrl }} />
                <View style={styles.textCardContainer}>
                    <View>

                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={styles.textCardMainHeading}>{item?.name}</Text>
                            {item.isWishListed ?
                                <Icon name="heart" size={14} color={colorObj.primarColor} />

                                :
                                <Icon name="heart-outline" size={14} color={colorObj.primarColor} />

                            }
                        </View>
                        <Text style={styles.textCardMainSubHeading1}>{item?.teacherName}</Text>
                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={styles.textCardMainSubHeading2}>₹{item?.price}</Text>
                            <Text style={styles.textCardMainSubHeading2}>{item.rating}<Icon name="star" size={12} color={colorObj.primarColor} /></Text>
                        </View>
                    </View>

                </View>
            </Pressable>
        )
    }

    const renderTeacherItem = ({ item, index }) => {
        return (
            <View style={[styles.listView]}>

                <Image
                    style={styles.listImage}
                    source={{ uri: item?.imgUrl }}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.textCardMainHeading}>{item?.name}
                        </Text>
                        <Text style={[styles.textCardMainHeading, { fontSize: 12, paddingHorizontal: 10, color: colorObj.primarColor }]}>{item.rating}<Icon name="star" size={12} color={colorObj.primarColor} />
                        </Text>
                    </View>
                    <Text style={[styles.location]}>{item?.teacherName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%' }}>
                        <Text style={[styles.subject]}>{item?.description.slice(0, 40)}...</Text>

                    </View>
                    <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>

                        <Pressable onPress={() => { handleAddCourseToCart(item._id) }}>

                            <Text style={[styles.button, { backgroundColor: '#085A4E', color: '#fff', paddingHorizontal: 15, paddingVertical: 3, borderRadius: 5 }]}>Add to cart</Text>
                        </Pressable>
                    </View>
                </View>


            </View >



        )
    }

    return (
        <View style={[styles.container]}>
           <View style={{ flexDirection: 'row' }}>
                <Pressable style={[{ flex: 1 }]} onPress={() => props.navigation.goBack()}>
                    <AntDesign name='left' size={20} style={[styles.topIcons]} />
                </Pressable>
                {/* <Pressable onPress={() => props.navigation.navigate('')}>

                    <AntDesign name='search1' size={20} style={[styles.topIcons, { marginRight: 25 }]} />
                </Pressable> */}
                <Pressable onPress={() => props.navigation.navigate('MainTopTab')}>

                    <AntDesign name='message1' size={20} style={[styles.topIcons, { marginRight: 25 }]} />
                </Pressable>
                <Pressable onPress={() => props.navigation.navigate("Notification")}>

                    <Feather name='bell' size={20} style={[styles.topIcons]} />
                </Pressable>
            </View>

            <View style={[styles.searchInputView]}>
                <AntDesign name='search1' size={20} style={[styles.topIcons, { marginRight: 15 }]} />
                <TextInput
                    style={styles.input}
                    placeholder="Search Categories"
                    onChangeText={(e) => handleSearch(e)}
                />
                <Pressable onPress={() => filterBottomSheetRef.current.open()}>
                    <Feather name='align-right' size={20} style={[styles.topIcons, { marginRight: 10 }]} />
                </Pressable>
            </View>

            <FlatList
                ListHeaderComponent={
                    <>
                        <Text style={[styles.title]}>Recommended Courses</Text>
                        <FlatList
                            horizontal
                            data={courseArr.filter(el => el?.flags?.bestsellerFlag)}

                            renderItem={renderItem}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => `${index}`}
                            ListEmptyComponent={
                                <Text style={{ textAlign: 'center', fontFamily: 'Montserrat-SemiBold', fontSize: 16, width: wp(90), marginTop: 40 }}>No Courses Found</Text>
                            }
                        />

                        <Text style={[styles.title]}>New Courses</Text>
                    </>
                }
                refreshing={isrefreshing}
                onRefresh={()=> handleOnint()}
                contentContainerStyle={{ paddingBottom:50 }}
                data={courseArr}
                renderItem={renderTeacherItem}
                keyExtractor={(item, index) => `${index}`}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', fontFamily: 'Montserrat-SemiBold', fontSize: 16, width: wp(90), marginTop: 40 }}>No Courses Found</Text>
                }
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

                                    <Text style={[styles.bottomSheetHeading, { fontSize: 14, paddingHorizontal: 10 }]}>Subject</Text>
                                </Pressable>
                                <Pressable onPress={() => setActiveFilterContainer('class')} style={[styles.customFilterHeadingBox, activeFilterContainer == "class" && { backgroundColor: 'white' }]}>

                                    <Text style={[styles.bottomSheetHeading, { fontSize: 14, paddingHorizontal: 10 }]}>Class</Text>
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
                                        <Text style={[styles.bottomSheetHeading, { fontSize: 14 }]}>₹ {multiSliderValue[0]} - ₹ {multiSliderValue[1]} </Text>
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
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 20
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
        marginTop: 35
    },
    input: {
        width: '80%'
    },
    title: {
        fontFamily: 'RedHatText-SemiBold',
        fontSize: 20,
        color: 'black',
        marginTop: 40
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
    headingAboveCard: {
        fontSize: 16, fontFamily: 'OpenSans-SemiBold', color: '#303030', paddingLeft: 13, marginTop: 10
    },
    viewAllText: {
        fontSize: 14, fontFamily: 'OpenSans-Regular', color: '#828282', paddingRight: 13, marginTop: 10
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
    },


    customFilterHeadingBox: {
        paddingVertical: 10
    }

})
