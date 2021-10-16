import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, Image, TextInput, Pressable, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj } from '../globals/colors';
import { imageObj } from '../globals/images';

import Icon from 'react-native-vector-icons/Ionicons'

import { getDecodedToken, getToken, SendOtp } from '../Services/User';
import { checkValidPhone } from '../globals/utils';
import NavBar from '../components/Navbar'
import { newEnquiry } from '../Services/TeacherEnquiry';
import { getAllCategory } from '../Services/Category';

import { Picker } from '@react-native-picker/picker';
import { courseAdd } from '../Services/Course';


export default function CreateCourse(props) {


    const [name, setName] = useState('');
    const [experience, setExperience] = useState('');
    const [description, setDescription] = useState('');
    const [hours, setHours] = useState('');

    const [assignments, setAssignments] = useState('');
    const [price, setPrice] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const handleSubmit = async () => {
        try {
            let userToken = await getDecodedToken()
            console.log(userToken)
            let obj = {
                name,
                hours,
                assignments,
                youtubeLink,
                description,
                userId: userToken.userId,
                categoryId: selectedCategoryId,
                categoryArr: [{ categoryId: selectedCategoryId }],
            }
            console.log(obj)
            const { data: res } = await courseAdd(obj);
            if (res.success) {
                alert(res.message)
            }
        } catch (error) {
            console.error(error)
            if (error.response.data.message) {
                alert(error.response.data.message)
            }
            else {
                alert(error.message)
            }
        }
    }


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

    useEffect(() => {
        getCategories()
    }, [])


    return (

        <View style={styles.container}>
            <NavBar rootProps={props} />
            <View style={styles.innerContainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                        <Image source={require('../../assets/images/Banner.png')} style={{ alignSelf: 'center', marginTop: 10 }} />
                        <View style={styles.textContainer}>
                            <Text style={styles.mainHeading}>Create Your Course</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="person-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setName(val)} placeholder="Enter Name" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="home-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setPrice(val)} placeholder="Enter Price" keyboardType="numeric" />
                        </View>
                        <Picker
                            style={styles.inputContainer}
                            selectedValue={selectedCategoryId}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedCategoryId(itemValue)
                            }>
                            <Picker.Item label="Please Select Category" value="" />

                            {categoryArr.map((el, i) => {
                                return (

                                    <Picker.Item key={el._id} label={el.name} value={el._id} />
                                )
                            })}

                        </Picker>
                        <View style={styles.inputContainer}>
                            <Icon name="library-outline" size={14} color="black" />
                            <TextInput multiline={true} style={styles.inputStyles} onChangeText={(val) => setHours(val)} placeholder="No of Hours" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="library-outline" size={14} color="black" />
                            <TextInput multiline={true} style={styles.inputStyles} onChangeText={(val) => setAssignments(val)} placeholder="No Of assignments" />
                        </View>
                        <View style={[styles.inputContainer, { minHeight: 80 }]}>
                            <Icon name="chatbox-ellipses-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setDescription(val)} placeholder="Enter Description" multiline={true} />
                        </View>

                        <View style={[styles.inputContainer, { minHeight: 80 }]}>
                            <Icon name="chatbox-ellipses-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setYoutubeLink(val)} placeholder="Youtube video link" multiline={true} />
                        </View>


                        <View style={styles.btnContainer}>
                            <Text style={styles.termsText}></Text>
                            <Pressable style={styles.btn} onPress={() => handleSubmit()}>
                                <Text style={styles.btnText}>Create</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // display: 'flex',
        // flexDirection: 'column',
    },

    innerContainer: {
        minHeight: hp(100),
        minWidth: wp(100),
        backgroundColor: colorObj.whiteColor
    },
    textContainer: {
        padding: 20,
    },

    mainHeading: {
        fontFamily: 'Montserrat-Bold',
        // lineHeight: 21,
        marginVertical: 5,
        fontSize: 30,
        color: colorObj.primarColor
    },
    labelSubHeading: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#828282',
        lineHeight: 15,
        marginTop: 2
    },
    inputContainer: {
        width: wp(90),
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        paddingHorizontal: 20,
        elevation: 3,
        marginTop: 20,
        borderColor: 'transparent',
        backgroundColor: colorObj.whiteColor
    },
    inputStyles: {
        fontFamily: 'Montserrat-Regular',
        width: '100%',
        paddingLeft: 10,
    },
    btn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 61,
        width: wp(80),
        paddingVertical: 15
    },
    btnText: {
        fontFamily: 'Montserrat-SemiBold',
        color: colorObj.whiteColor,
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 20
    },
    termsText: {
        fontSize: 12,
        color: '#828282',
        fontFamily: 'Montserrat-Regular',
        marginVertical: 10,
        textAlign: 'center'
    },
    btnContainer: {
        width: wp(90),
        paddingHorizontal: 20,
        // position: 'absolute',
        // bottom: 50,
        // backgroundColor:'red',
        left: 20
    }
})
