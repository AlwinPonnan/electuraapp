import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, FlatList, Pressable, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/core';
import { getAllTeachers } from '../Services/User';
import { generateImageUrl } from '../globals/utils';
export default function AllTeacher(props) {

    const focused = useIsFocused()

    const [productsArr, setProductsArr] = useState([
        {
            name: "Lorem Course",
            categoryName: 'Science',
            teacher: "Mr. Teacher",
            teacherImg: "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
            imgUrl: "https://images.unsplash.com/photo-1475778057357-d35f37fa89dd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti atque cum id assumenda nesciunt modi asperiores totam in vel iure?",
            courseEstimatedTime: '1hr 30min',
            active: false

        },
        {
            name: "Lorem Course2",
            categoryName: 'Physics',
            teacher: "Mr. Teacher",
            teacherImg: "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
            imgUrl: "https://images.unsplash.com/photo-1497002961800-ea7dbfe18696?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1052&q=80",
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti atque cum id assumenda nesciunt modi asperiores totam in vel iure?",
            courseEstimatedTime: '1hr 30min',
            active: false
        },
        {
            name: "Lorem Course3",
            categoryName: 'A.I.',
            teacher: "Mr. CBSE",
            teacherImg: "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
            imgUrl: "https://images.unsplash.com/photo-1475778057357-d35f37fa89dd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti atque cum id assumenda nesciunt modi asperiores totam in vel iure?",
            active: false
        },
        {
            name: "Lorem Course",
            categoryName: 'Science',
            teacher: "Mr. Teacher",
            teacherImg: "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
            imgUrl: "https://images.unsplash.com/photo-1497002961800-ea7dbfe18696?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1052&q=80",
            description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corrupti atque cum id assumenda nesciunt modi asperiores totam in vel iure?",
            courseEstimatedTime: '1hr 30min',
            active: false
        },
    ])

    const [TeachersArr, setTeachersArr] = useState([])
    const [MainTeachersArr, setMainTeachersArr] = useState([]);

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


    const handleOnint = () => {
        getTeachers()
    }

    useEffect(() => {
        handleOnint()
    }, [focused])




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
                        <Ionicons name="bookmark-outline" size={16} color="black" />
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
                    source={{ uri: item?.profileImage ? generateImageUrl(item?.profileImage) : "https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGQlMjBpbWFnZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80" }}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.listName]}>{item.name}</Text>
                    <Text style={[styles.location]}><Ionicons name="location-outline" size={16} color="#A3A3A3" style={{ marginRight: 10 }} />{item?.location ? item?.location : "Delhi"}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%' }}>
                        <Text style={[styles.subject]}>{item?.enquiryObj?.classesArr?.reduce((acc, el) => acc + el.className + ',', '')}</Text>
                        <Text style={[styles.subject]}>{item.course}</Text>
                        <Text style={[styles.subject]}>{item?.enquiryObj?.experience ? item?.enquiryObj?.experience : 1}+ Year Experience</Text>
                    </View>
                    <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                        <Pressable onPress={() => props.navigation.navigate("TeacherProfile", { data: item._id })}>

                            <Text style={[styles.button, { color: '#828282', marginRight: 25 }]}>View Profile</Text>
                        </Pressable>
                        <Pressable>

                            <Text style={[styles.button, { backgroundColor: '#085A4E', color: '#fff', paddingHorizontal: 15, paddingVertical: 3, borderRadius: 5 }]}>Enquire</Text>
                        </Pressable>
                    </View>
                </View>


            </View >



        )
    }

    return (
        <View style={[styles.container]}>
            <View style={{ flexDirection: 'row' }}>
                <AntDesign name='left' size={20} style={[styles.topIcons, { flex: 1 }]} />
                <AntDesign name='search1' size={20} style={[styles.topIcons, { marginRight: 25 }]} />
                <AntDesign name='message1' size={20} style={[styles.topIcons, { marginRight: 25 }]} />
                <Feather name='bell' size={20} style={[styles.topIcons]} />
            </View>

            <View style={[styles.searchInputView]}>
                <AntDesign name='search1' size={20} style={[styles.topIcons, { marginRight: 15 }]} />
                <TextInput
                    style={styles.input}
                    placeholder="Search Categories"
                />
                <Feather name='align-right' size={20} style={[styles.topIcons, { marginRight: 10 }]} />
            </View>
            <Text style={[styles.title]}>Top Instructors</Text>
            <View>
                <FlatList
                    style={{ height: 150 }}
                    horizontal
                    data={TeachersArr}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                />
            </View>
            <Text style={[styles.title, { marginVertical: 10 }]}>Instructors Online</Text>
            <FlatList
                style={{ height: 300 }}
                data={TeachersArr}
                renderItem={renderTeacherItem}
                keyExtractor={(item, index) => `${index}`}
            />
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
        fontSize: 16,
        color: 'black',
        marginTop: 40
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
        marginHorizontal: 20,
        marginTop: 20
    },
    teacherImg: {
        height: 100,
        width: 100,
        left: -10,
        top: 15,
        position: "absolute",
        borderRadius: 100
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
    }
})