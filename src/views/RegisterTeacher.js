import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, Image, TextInput, Pressable, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj } from '../globals/colors';
import { imageObj } from '../globals/images';

import Icon from 'react-native-vector-icons/Ionicons'

import { getDecodedToken, getToken, getUser, SendOtp } from '../Services/User';
import { checkValidPhone } from '../globals/utils';
import NavBar from '../components/Navbar'
import { newEnquiry } from '../Services/TeacherEnquiry';
import { Picker } from '@react-native-picker/picker';
import { getAllCategory } from '../Services/Category';
import { useIsFocused } from '@react-navigation/core';


export default function RegisterTeacher(props) {
    const [qualificationArr, setQualificationArr] = useState([]);
    const [phone, setPhone] = useState();

    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [experience, setExperience] = useState('');
    const [subject, setSubject] = useState('');
    const [teacherClass, setTeacherClass] = useState('');
    const [description, setDescription] = useState('');
    const [degree, setDegree] = useState('');

    const [university, setUniversity] = useState('');
    const [minFees, setMinFees] = useState('');
    const [maxFees, setMaxFees] = useState('');
    const focused=useIsFocused()
    const handleSubmit = async () => {
        try {
            let userToken = await getDecodedToken()
            let obj = {
                name,
                email,
                address,
                class: teacherClass,
                subject,
                description,
                userId: userToken.userId,
                educationObj: {
                    degree,
                    university
                },
                categoryArr: [{ categoryId: selectedCategoryId }],
                experience,
                feesObj: {
                    minFees,
                    maxFees
                }
            }
            const { data: res } = await newEnquiry(obj);
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


    const getUserData = async () => {
        try {
            let { data: res, status: statusCode } = await getUser();
            console.log(statusCode)
            if (statusCode == 200 || statusCode == 304) {
                console.log(JSON.stringify(res.data, null, 2))
                setName(res.data.name)
                setEmail(res.data.email)
                setPhone(res.data.phone)
                // console.log(JSON.stringify(res.data, null, 2))
            }
        }
        catch (err) {
            console.error(err)
        }
    }


    

    useEffect(() => {
        getCategories()
        getUserData()
    }, [focused])



    return (

        <View style={styles.container}>
            <NavBar rootProps={props} />
            <View style={styles.innerContainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.container}
                >
                    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                        <Image source={imageObj.loginImage} style={{ alignSelf: 'center', marginTop: 10, height: hp(30), width: wp(80) }} />
                        <View style={styles.textContainer}>
                            <Text style={styles.mainHeading}>Become a Teacher</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <Icon name="person-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} value={name} editable={false} onChangeText={(val) => setName(val)} placeholder="Enter your Name" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="mail-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} value={email} editable={false} onChangeText={(val) => setEmail(val)} keyboardType="email-address" placeholder="Enter your Email" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="call-outline" size={14} color="black" />
                            <TextInput maxLength={10} style={styles.inputStyles} editable={false} value={phone} onChangeText={(val) => setPhone(val)} keyboardType="numeric" placeholder="+91     Enter Number" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="home-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setAddress(val)} value={address} placeholder="Enter Address" multiline={true} />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="home-outline" size={14} color="black" />
                            <TextInput keyboardType="number-pad" style={styles.inputStyles} onChangeText={(val) => setMinFees(val)} value={minFees} placeholder="Enter Min Fees" keyboardType="numeric" />
                        </View><View style={styles.inputContainer}>
                            <Icon name="home-outline" size={14} color="black" />
                            <TextInput keyboardType="number-pad" style={styles.inputStyles} onChangeText={(val) => setMaxFees(val)} value={maxFees} placeholder="Enter Max Fees" keyboardType="numeric" />
                        </View>
                        <Picker
                            style={[styles.inputContainer, { borderRadius: 20 }]}
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
                            <TextInput multiline={true} style={styles.inputStyles} value={degree} onChangeText={(val) => setDegree(val)} placeholder="Enter your Degree" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="library-outline" size={14} color="black" />
                            <TextInput multiline={true} style={styles.inputStyles} value={university} onChangeText={(val) => setUniversity(val)} placeholder="Enter your university" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="library-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} keyboardType="number-pad" value={experience} onChangeText={(val) => setExperience(val)} placeholder="Enter your Experience in Yrs" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="file-tray-full-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setSubject(val)} value={subject} placeholder="Enter Subject" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="desktop-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setTeacherClass(val)} value={teacherClass} keyboardType="numeric" placeholder="Enter Class" />
                        </View>

                        <View style={[styles.inputContainer, { minHeight: 80 }]}>
                            <Icon name="chatbox-ellipses-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setDescription(val)} value={description} placeholder="Enter Description" multiline={true} />
                        </View>



                        <View style={styles.btnContainer}>
                            <Text style={styles.termsText}>By Continuing you accept the <Text style={{ color: colorObj.primarColor }}>terms and conditions</Text></Text>
                            <Pressable style={styles.btn} onPress={() => handleSubmit()}>
                                <Text style={styles.btnText}>Become A Teacher</Text>
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
        color: "black"
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
