import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj, light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import NavBar from '../components/Navbar';
import { getAllCategory } from "../Services/Category"
import { Searchbar } from 'react-native-paper';
import { getAllSubjects } from '../Services/Subjects';
import { getAllTeachers } from '../Services/User';
import { generateImageUrl } from '../globals/utils';
import { getAllForUsersHomePage } from '../Services/Course';

export default function SearchScreen(props) {
    const [categoryArr, setCategoryArr] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [teachersArr, setTeachersArr] = useState([]);
    const [mainTeachersArr, setMainTeachersArr] = useState([]);

    const [courseArr, setCourseArr] = useState([]);
    const [mainCourseArr, setMainCourseArr] = useState([]);






    const onChangeSearch = query => {
        let tempQuery=query.toLowerCase()
        let tempArr = [...mainTeachersArr];
        console.log(JSON.stringify(tempArr, null, 2))
        tempArr = tempArr.filter(el =>  el?.name.toLowerCase().includes(tempQuery) || el?.enquiryObj?.classesArr?.some(ele => ele.subjectArr?.some(elx => elx?.subjectName?.toLowerCase().includes(tempQuery))))
        setTeachersArr([...tempArr])


        let tempCourseArr = [...mainCourseArr]
        tempCourseArr = tempCourseArr.filter(el =>  el?.name.toLowerCase().includes(tempQuery) || el?.classesArr?.some(ele => ele.subjectArr?.some(elx => elx?.subjectName?.toLowerCase().includes(tempQuery))) || el?.name.includes(tempQuery) )
        setCourseArr([...tempCourseArr])

        setSearchQuery(query)

    };




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
                console.log(JSON.stringify(temp,null,2))
                setCourseArr(temp)
                setMainCourseArr(temp)
            }
        } catch (error) {
            console.error(error)
        }
    }
    const handleOnint = () => {
        getSubjects()
        getTeachers()
        getCourses()
    }

    useEffect(() => {
        handleOnint()
    }, [])



    const handleSubjectSelection = async (id) => {
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

                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={styles.textCardMainHeading}>{item?.name}</Text>
                            <Icon name="heart" size={14} color={colorObj.primarColor} />
                        </View>
                        <Text style={styles.textCardMainSubHeading1}>{item?.teacherName}</Text>
                        <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                            <Text style={styles.textCardMainSubHeading2}>₹{item?.price}</Text>
                            <Text style={styles.textCardMainSubHeading2}><Icon name="star" size={14} color={colorObj.primarColor} />4.2</Text>
                        </View>
                    </View>

                </View>
            </Pressable>
        )
    }
    const renderInstructorItem = ({ item, index }) => {
        return (
            <Pressable style={styles.cardInstructorContainer} onPress={() => props.navigation.navigate("TeacherProfile",{data:item._id})} >
                <Image style={styles.teacherImg} source={{ uri: item?.profileImage ? generateImageUrl(item?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }} />

                <View style={styles.textCardInstructorContainer}>
                    <View>

                        <Text style={styles.textCardMainHeading}>{item?.name}</Text>
                        <Text style={styles.textCardMainSubHeading1}>{item?.enquiryObj?.classesArr?.reduce((acc, el) => acc + el.className + ',', '')}</Text>
                        <Text style={styles.textCardMainSubHeading2}>{item?.enquiryObj?.experience} Year Experience</Text>
                    </View>
                    <View style={{ position: 'absolute', top: 5, right: 10 }} >
                        <Icon name="bookmark-outline" size={16} color="black" />
                    </View>
                </View>
            </Pressable>
        )
    }



    const renderCategoryItem = ({ item, index }) => {
        return (
            <Pressable onPress={() => { handleSubjectSelection(item._id) }} style={[styles.categoryContainer, selectedSubjectId != item._id && { backgroundColor: '#f0faf9' }]}>
                {/* <Icon name="film-outline" size={14} /> */}
                <Text style={[styles.categoryName, selectedSubjectId != item._id && { color: '#000' }]}>{item.name}</Text>
            </Pressable>
        )
    }
    return (
        <View style={styles.container}>
            <NavBar rootProps={props} />
            <Searchbar
                style={styles.searchBar}
                placeholder="Search Categories"

                onChangeText={onChangeSearch}
                value={searchQuery}
            />

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
                    <Text style={styles.headingAboveCard}>Recommended Courses</Text>
                    <Text style={styles.viewAllText}>View All</Text>
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
                    <Text style={styles.headingAboveCard}>Top Instructors</Text>
                    <Text style={styles.viewAllText}>View All</Text>
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
        width: wp(45),
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
        justifyContent: 'space-evenly'
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





    //instructor

    cardInstructorContainer: {
        display: 'flex',
        width: wp(65),
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        height: 100,
        position: 'relative',
        marginHorizontal: 20

    },
    textCardInstructorContainer: {
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


    teacherInstructorImg: {
        height: 100,
        width: 100,
        left: -10,
        top: 15,
        position: "absolute",
        borderRadius: 100
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
        height: 100,
        width: 100,
        left: -10,
        top: 15,
        position: "absolute",
        borderRadius: 100
    },
})