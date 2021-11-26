import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj, light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import NavBar from '../components/Navbar';
import { getAllCategory } from '../Services/Category';
import { useIsFocused } from '@react-navigation/core';
import { getAllTeachers, getAllTeachersSubjectWise } from '../Services/User';
import { imageObj } from '../globals/images';
import { getAllSubjects } from '../Services/Subjects';
import { generateImageUrl } from '../globals/utils';
import messaging from '@react-native-firebase/messaging';
import { saveTokenToDatabase } from '../Services/User';
import AllTeacher from './AllTeacher';
import { useNavigation } from '@react-navigation/core';
export default function HomeScreen(props) {
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [subjectArr, setSubjectArr] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [teachersArr, setTeachersArr] = useState([]);
    const [mainTeachersArr, setMainTeachersArr] = useState([]);



    const [subjectWiseTeacherArr, setSubjectWiseTeacherArr] = useState([]);

   

    const [categoryArr, setCategoryArr] = useState([]);

    const handleViewAll = () => {
        navigation.navigate(AllTeacher)
    }
    const getSubjects = async () => {
        try {
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

    const getSubjectWise = async () => {
        try {
            const { data: res } = await getAllTeachersSubjectWise();
            if (res.success) {
                let tempArr = res.data;
                tempArr = tempArr.filter(el => el.userArr.length >= 1)
                console.log(JSON.stringify(tempArr, null, 2))

                setSubjectWiseTeacherArr([...tempArr])
            }
        } catch (error) {
            console.error(error)
        }
    }



    async function registerAppWithFCM() {
        await messaging().registerDeviceForRemoteMessages();
    }

    

    useEffect(() => {
        messaging()
            .getToken()
            .then(token => {
                return saveTokenToDatabase(token);
            });
        registerAppWithFCM();
    }, [])


    useEffect(() => {
        getSubjects()
        getTeachers()
        getSubjectWise()
    }, [isFocused])



    const handleSubjectSelection = async (id) => {
        let tempArr = [...mainTeachersArr];
        console.log(JSON.stringify(tempArr, null, 2))
        tempArr = tempArr.filter(el => el?.enquiryObj?.classesArr?.some(ele => ele.subjectArr.some(elx => elx.subjectId == id)))
        setTeachersArr([...tempArr])
        setSelectedSubjectId(id)
    }


    const renderItem = ({ item, index }) => {
        return (
            <Pressable style={styles.cardContainer} onPress={() => props.navigation.navigate("TeacherProfile", { data: item._id })}>

                <Image style={styles.teacherImg} source={{ uri: item?.profileImage ? generateImageUrl(item?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }} />
                <View style={styles.textCardContainer}>
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

    return (
        <View style={styles.container}>
            <NavBar rootProps={props} />
            <ScrollView>
                <View style={styles.bannerContainer}>
                    <Image source={require('../../assets/images/Banner.png')} />
                </View>

                <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                    <Text style={styles.headingAboveCard}>Top Instructors</Text>
                    <Pressable onPress={() => handleViewAll()}><Text style={styles.viewAllText}>View All</Text></Pressable>
                </View>
                <FlatList

                    horizontal
                    data={subjectArr}
                    renderItem={({ item, index }) => {
                        return (
                            <Pressable onPress={() => { handleSubjectSelection(item._id) }} style={[styles.categoryContainer, selectedSubjectId != item._id && { backgroundColor: '#f0faf9' }]}>
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
                        <Text style={{ fontFamily: 'Montserrat-Regular', padding: 10 }}>No teachers found</Text>
                    }
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                />





               
                <FlatList
                    data={subjectWiseTeacherArr}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={{marginVertical:10}}>
                                <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between' }]}>
                                    <Text style={styles.headingAboveCard}>{item?.name} Instructors</Text>
                                    <Pressable onPress={() => props.navigation.navigate('AllTeacher')}>
                                        <Text style={styles.viewAllText}>View All</Text>
                                    </Pressable>
                                </View>
                                <FlatList
                                    data={item?.userArr}
                                    keyExtractor={(item, index) => `${item._id}`}
                                    horizontal
                                    renderItem={({ item: itemX, index: indexX }) => {
                                        return (
                                            <Pressable style={[styles.cardContainer,{marginVertical:10,paddingVertical:5}]} onPress={() => props.navigation.navigate("TeacherProfile", { data: itemX._id })}>

                                                <Image style={styles.teacherImg} source={{ uri: itemX?.profileImage ? generateImageUrl(itemX?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }} />
                                                <View style={styles.textCardContainer}>
                                                    <View>

                                                        <Text style={styles.textCardMainHeading}>{itemX?.name}</Text>
                                                        <Text style={styles.textCardMainSubHeading1}>{itemX?.enquiryObj?.classesArr?.reduce((acc, el) => acc + el.className + ',', '')}</Text>
                                                        <Text style={styles.textCardMainSubHeading2}>{itemX?.enquiryObj?.experience} Year Experience</Text>
                                                    </View>
                                                    <View style={{ position: 'absolute', top: 5, right: 10 }} >
                                                        <Icon name="bookmark-outline" size={16} color="black" />
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






                {/* <FlatList
                    style={{ height: 150 }}
                    horizontal
                    data={productsArr}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                /> */}



            </ScrollView>
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
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        height: 100,
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
    teacherImg: {
        height: 100,
        width: 100,
        left: -10,
        top: 15,
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
    }

})
