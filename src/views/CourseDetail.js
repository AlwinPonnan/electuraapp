import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Image, Pressable, SectionList, ScrollView,Linking } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj, light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import NavBar from '../components/Navbar';
import { getById } from '../Services/Course';
import { useIsFocused } from '@react-navigation/core';


export default function CourseDetail(props) {
    const [courseObj, setCourseObj] = useState({});

    const isFocused = useIsFocused();
    const getCourseById = async () => {
        try {
            const { data: res } = await getById(props.route.params.data)
            if (res.success) {
                console.log(res.data)
                setCourseObj(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleLinkingOpen=()=>{
        Linking.openURL(courseObj?.youtubeLink)
    }



    const handleOnint = () => {

        getCourseById()
    }

    useEffect(() => {
        handleOnint()
    }, [isFocused])

    return (
        <View style={styles.container}>
            <NavBar rootProps={props} />
            <View style={styles.innerContainer}>

                <View style={[styles.flexRow, { alignItems: "center", justifyContent: "space-between", }]}>
                    <View style={[styles.flexRow]} >
                        <Text style={styles.pageHeading}>{courseObj?.name}</Text>
                        <View style={[styles.flexRow, { alignItems: "center" }]}>
                            <Text style={styles.ratingTxt}>4.2</Text>
                            <Icon name="star" size={10} color="rgba(8, 90, 78, 1)" />
                        </View>
                    </View>
                    <Icon name="heart-outline" size={20} color="rgba(8, 90, 78, 1)" />
                </View>
                <View style={[styles.flexRow, { alignItems: "center", marginTop: 5 }]}>
                    <Image source={require("../../assets//images/user.png")} style={styles.img} />
                    <Text style={styles.userName}>{courseObj?.teacherName}</Text>
                </View>

                <Image source={require("../../assets//images/Banner1.png")} resizeMode="cover" style={styles.bannerimg} />


                <View style={[styles.flexRow, { marginVertical: 15 }]}>
                    <Text style={styles.dataItem}>4 Enrollments</Text>
                    <Text style={styles.dataItem}>{courseObj?.hours} Hours</Text>
                    <Text style={styles.dataItem}>{courseObj?.assignments} Assignments</Text>
                </View>
                <Text style={styles.description}>
                    {courseObj?.description}
                </Text>
            </View>
            <Pressable style={styles.btn} onPress={() =>handleLinkingOpen()}>
                <Text style={styles.btnText}>Buy Now</Text>
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FEFEFE',
        flex: 1,
    },
    innerContainer: {
        width: wp(95),
        alignSelf: "center",
        display: "flex",
        marginTop: 15,
        flexDirection: "column",
        justifyContent: "center",
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
    pageHeading: {
        fontFamily: 'Montserrat-SemiBold', fontSize: 18, color: '#000000', marginRight: 10
    },
    ratingTxt: {
        color: "rgba(8, 90, 78, 1)",
        fontFamily: 'Montserrat-Regular',
        marginRight: 5,
        fontSize: 12
    },
    img: {
        height: 30,
        width: 30,
        borderRadius: 8,
        marginRight: 10
    },
    bannerimg: {
        display: "flex",
        alignSelf: "center",
        marginLeft: wp(5)
    },
    userName: {
        fontFamily: 'Montserrat-Regular', fontSize: 14, color: '#000000',

    },
    dataItem: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 13,
        color: 'grey',
        marginRight: 20,
        marginLeft: 7
    },
    btn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 61,
        width: wp(80),
        alignSelf: "center",
        display: "flex",
        marginTop: 100,
        position: "absolute",
        bottom: 30,
        paddingVertical: 15
    },
    btnText: {
        fontFamily: 'Montserrat-SemiBold',
        color: colorObj.whiteColor,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 20
    },
    description: { fontFamily: 'Montserrat-Regular', fontSize: 14, color: 'rgba(0,0,0,0.6)', paddingHorizontal: 8 },
})