import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj, light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import NavBar from '../components/Navbar';
import { getAllCategory } from '../Services/Category';
import { getAllCoursesSubjectWise, getAllForUsersHomePage } from '../Services/Course';
import { useIsFocused } from '@react-navigation/core';
import { generateImageUrl } from '../globals/utils';
import { getAllSubjects } from '../Services/Subjects';
import { addTOWishList, getDecodedToken } from '../Services/User';
import { successAlertContext } from '../../App';
import { loadingContext } from '../navigators/stacks/RootStack';

export default function Courses(props) {
    const [courseArr, setCourseArr] = useState([

    ])
    const focused = useIsFocused()
    const [subjectArr, setSubjectArr] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('All');
    const [isrefreshing, setIsrefreshing] = useState(false);

    const [subjectWiseCoursesArr, setSubjectWiseCoursesArr] = useState([]);
    const [mainCourseArr, setMainCourseArr] = useState([]);

    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)

    const [loading, setLoading] = useContext(loadingContext);

    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr

    const [categoryArr, setCategoryArr] = useState([]);

    const getCategories = async () => {
        try {
            const { data: res } = await getAllCategory();
            if (res.success) {
                setCategoryArr(res.data)
            }
        } catch (error) {
            console.error(error)
        }
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
                setSubjectArr([{ name: "All", _id: "All" }, ...tempArr])
                setIsrefreshing(false)

            }
        } catch (error) {
            console.error(error)
            setIsrefreshing(false)

        }
    }

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
                console.log(temp)
                setCourseArr(temp.filter((el,i)=>i<10).sort((a,b)=>b?.enrollments-a?.enrollments))
                setMainCourseArr(temp.filter((el,i)=>i<10).sort((a,b)=>b?.enrollments-a?.enrollments))
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
            const { data: res } = await getAllCoursesSubjectWise();
            if (res.success) {
                let tempArr = res.data;
                tempArr = tempArr.filter(el => el.courseArr.length >= 1)
                console.log(JSON.stringify(tempArr, null, 2))

                setSubjectWiseCoursesArr([...tempArr])
                setIsrefreshing(false)
            }
        } catch (error) {
            console.error(error)
            setIsrefreshing(false)
        }
    }



    const handleAddCourseToWhishlist = async (id) => {
        setLoading(true)
        try {
            let tokenObj = await getDecodedToken()
            let obj = {
                userId: tokenObj?.userId,
                courseId: id
            }
            console.log(obj)
            const { data: res } = await addTOWishList(obj);
            if (res.success) {
                getDataOnInit()
                // setAlertText(res.message);
                // setSuccessAlert(true)
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
    const getDataOnInit = async () => {
        getSubjects()
        getCourses()
        getSubjectWise()
    }



    useEffect(() => {
        if (focused) {
            getDataOnInit()
        }
    }, [focused])

    const renderItem = ({ item, index }) => {
        return (
            <Pressable style={styles.cardContainer} onPress={() => props.navigation.navigate("CourseDetail", { data: item._id })} >
                <Image style={styles.courseImg} source={{ uri: item?.imgUrl }} />
                <View style={styles.textCardContainer}>
                    <View>

                        <Pressable onPress={() => handleAddCourseToWhishlist(item._id)} style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={styles.textCardMainHeading}>{item?.name}</Text>
                            {item.isWishListed ?

                                <Icon name="heart" size={14} color={colorObj.primarColor} />

                                :
                                <Icon name="heart-outline" size={14} color={colorObj.primarColor} />

                            }
                        </Pressable>
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


    const handleSubjectSelection = async (id) => {
        // let tempArr = [...mainCourseArr];
        // console.log(JSON.stringify(tempArr, null, 2), "asddasdsa")
        // tempArr = tempArr.filter(el => el?.classesArr?.some(ele => ele.subjectArr.some(elx => elx.subjectId == id)))
        // setCourseArr([...tempArr])
        // setSelectedSubjectId(id)

        if (id == "All") {
            setSelectedSubjectId(id)
            setCourseArr([...mainCourseArr])
        }
        else {

            let tempArr = [...mainCourseArr];
            console.log(JSON.stringify(tempArr, null, 2), "asddasdsa")
            tempArr = tempArr.filter(el => el?.classesArr?.some(ele => ele.subjectArr.some(elx => elx.subjectId == id)))
            setCourseArr([...tempArr])
            setSelectedSubjectId(id)
        }
    }



    return (
        <View style={styles.container}>
            <NavBar rootProps={props} />

            <FlatList
                refreshing={isrefreshing}

                onRefresh={() => getDataOnInit()}
                scrollEnabled={true} data={[]} renderItem={() => null}
                ListHeaderComponent={
                    <>
                        <View style={styles.bannerContainer}>
                            <Image source={require('../../assets/images/Banner.png')} resizeMode="contain" resizeMethod="resize" style={{ width: wp(100), height: 210 }} />
                        </View>

                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={styles.headingAboveCard}>Recommended Courses</Text>
                            <Pressable onPress={() => props.navigation.navigate("AllCourses")}>
                                <Text style={styles.viewAllText}>View All</Text>
                            </Pressable>
                        </View>
                        <FlatList
                            horizontal
                            data={subjectArr}
                            renderItem={({ item, index }) => {
                                return (
                                    <Pressable onPress={() => handleSubjectSelection(item._id)} style={[styles.categoryContainer, selectedSubjectId != item._id && { backgroundColor: '#F7FFFE' }]}>
                                        {item?.thumbnailImage &&
                                            <Image source={{ uri: generateImageUrl(item?.thumbnailImage) }} style={{ height: 12, width: 12,marginRight:3 }} />
                                        }
                                        {/* <Icon name="film-outline" size={14} /> */}
                                        <Text style={[styles.categoryName, selectedSubjectId != item._id && { color: '#828282' }]}>{item.name}</Text>
                                    </Pressable>
                                )
                            }}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => `${index}`}
                        />

                        <FlatList
                            horizontal
                            data={courseArr}
                            renderItem={renderItem}
                            ListEmptyComponent={
                                <Text style={{ fontFamily: 'Montserrat-Regular', padding: 10 }}>No Courses found</Text>
                            }
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => `${index}`}
                        />

                        <FlatList
                            data={subjectWiseCoursesArr}
                            renderItem={({ item, index }) => {
                                return (
                                    <View>
                                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                                            <Text style={styles.headingAboveCard}>{item?.name}</Text>
                                            <Pressable onPress={() => props.navigation.navigate("AllCourses")}>
                                                <Text style={styles.viewAllText}>View All</Text>
                                            </Pressable>
                                        </View>
                                        <FlatList
                                            data={item?.courseArr}
                                            keyExtractor={(item, index) => `${item._id}`}
                                            horizontal
                                            renderItem={({ item: itemX, index: indexX }) => {
                                                return (
                                                    <Pressable style={styles.cardContainer} onPress={() => props.navigation.navigate("CourseDetail", { data: itemX._id })} >
                                                        <Image style={styles.courseImg} source={{ uri: generateImageUrl(itemX?.thumbnailImage?.url) }} />
                                                        <View style={styles.textCardContainer}>
                                                            <View>

                                                                <Pressable onPress={() => handleAddCourseToWhishlist(itemX._id)} style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                                                                    <Text style={styles.textCardMainHeading}>{itemX?.name}</Text>
                                                                    {
                                                                        itemX?.isWishListed ?
                                                                            <Icon name="heart" size={14} color={colorObj.primarColor} />

                                                                            :
                                                                            <Icon name="heart-outline" size={14} color={colorObj.primarColor} />

                                                                    }
                                                                </Pressable>
                                                                <Text style={styles.textCardMainSubHeading1}>{itemX?.teacherName}</Text>
                                                                <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                                                                    <Text style={styles.textCardMainSubHeading2}>₹{itemX?.price}</Text>
                                                                    <Text style={styles.textCardMainSubHeading2}>{itemX.rating}<Icon name="star" size={12} color={colorObj.primarColor} /></Text>
                                                                </View>
                                                            </View>

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

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FEFEFE',
        flex: 1,
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
        width: '95%',
        alignSelf: 'center',
        borderRadius: 12
    },
    textCardMainHeading: {
        fontFamily: 'Montserrat-Medium', fontSize: 12, color: '#232323'
    },
    textCardMainSubHeading1: {
        fontFamily: 'Montserrat-Regular', fontSize: 10, color: '#7E7E7E', marginTop: 2
    },
    textCardMainSubHeading2: {
        fontFamily: 'Montserrat-Regular', fontSize: 10, color: colorObj.primarColor, marginTop: 15
    },
    headingAboveCard: {
        fontSize: 16, fontFamily: 'OpenSans-Medium', color: '#303030', paddingLeft: 13, marginTop: 10
    },
    viewAllText: {
        fontSize: 14, fontFamily: 'OpenSans-Regular', color: '#828282', paddingRight: 13, marginTop: 10
    },
    categoryContainer: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 26,
        paddingVertical: 10,
        marginVertical: 10,
        marginHorizontal: 7,
        paddingHorizontal:20,
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

    categoryName: {
        color: colorObj.whiteColor,
        textAlign: 'center',
        fontSize: 11,
        fontFamily: 'OpenSans-Regular',
        // paddingHorizontal: 20
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
    }

})
