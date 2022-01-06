import React, { useState, useEffect, useCallback, useContext } from 'react'
import { View, Text, StyleSheet, Image, TextInput, Pressable, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity, FlatList } from 'react-native'

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
import { courseAdd, getByCoursesUserId, uploadCourseImage } from '../Services/Course';
import { Checkbox } from 'react-native-paper';
import { getAllClasses } from '../Services/Classses';
import DocumentPicker from 'react-native-document-picker'
import { successAlertContext } from '../../App';
import { loadingContext } from '../navigators/stacks/RootStack';
import { useIsFocused } from '@react-navigation/core';
import { newCoupon } from '../Services/Coupons';

export default function AddCoupons(props) {

    const [loading, setLoading] = useContext(loadingContext);

    const [code, setCode] = useState('');

    const [description, setDescription] = useState('');
    const [hours, setHours] = useState('');
    const [amountOff, setAmountOff] = useState('');


    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr


    const [courseArr, setCourseArr] = useState([]);

    const focused = useIsFocused()
    const handleSubmit = async () => {
        setLoading(true)
        try {


            if ( code != "" && amountOff!="" && courseArr.some(el=>el.checked)) {
                let obj = {
                    code,
                    amountOff,
                    courseArr: courseArr.filter(el => el.checked).map(el => {
                        let tempObj={
                            courseId:el._id
                        }
                        return tempObj
                    })
                }
                const { data: res } = await newCoupon(obj);
                if (res.success) {

                    setAlertText(res.message)
                    setSuccessAlert(true)
                    props.navigation.goBack()
                }
            }
            else {
                setWarningAlert(true)
                setAlertText("Please fill all the fields")
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

    const handleCourseGet = async () => {
        try {
            let decodedTokenObj = await getDecodedToken()
            const { data: res } = await getByCoursesUserId(decodedTokenObj.userId);
            if (res.success) {
                setCourseArr([...res.data.map(el => {
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


    const handleCourseSelection = (id) => {
        setCourseArr(prevState => {
            let tempIndex = prevState.findIndex(el => el._id == id);
            prevState[tempIndex].checked = !prevState[tempIndex].checked;
            return [...prevState]
        })
    }

    const handleOnint = () => {
        handleCourseGet()
    }

    useEffect(() => {
        handleOnint()
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
                        <Image source={require('../../assets/images/Banner.png')} style={{ alignSelf: 'center', marginTop: 10,height:210,width:wp(100) }} />
                        <View style={styles.textContainer}>
                            <Text style={styles.mainHeading}>Add Coupon</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="person-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setCode(val)} placeholder="Enter Code" />
                        </View>
                        <View style={styles.inputContainer}>
                            <Icon name="cash-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} maxLength={2} onChangeText={(val) => setAmountOff(val)} placeholder="Enter Amount Off" keyboardType="numeric" />
                        </View>

                        <Text style={styles.label}>Select your courses *</Text>

                        <FlatList
                            data={courseArr}
                            keyExtractor={(item, index) => `${item._id}`}
                            renderItem={({ item, index }) => {
                                return (
                                    <View>
                                        <View style={[styles.flexRowAlignCenter, { paddingHorizontal: 10 }]}>
                                            <Checkbox
                                                color={colorObj.primarColor}
                                                status={item.checked ? "checked" : "unchecked"}
                                                onPress={() => {
                                                    handleCourseSelection(item._id);
                                                }}
                                            />
                                            <TouchableOpacity style={{ width: wp(82), paddingVertical: 5, }} onPress={() => {
                                                handleCourseSelection(item._id);
                                            }}>
                                                <Text style={{ fontFamily: 'Montserrat-Regular' }}>{item.name}</Text>
                                            </TouchableOpacity>

                                        </View>

                                    </View>
                                )
                            }}
                        />

                        {/* <View style={[styles.inputContainer, { minHeight: 80 }]}>
                            <Icon name="chatbox-ellipses-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setDescription(val)} placeholder="Enter Description" multiline={true} />
                        </View> */}

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
        color: colorObj.primarColor,
        textAlign: 'center'
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
    },
    flexRowAlignCenter: {
        display: "flex",
        marginVertical: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    label: {
        fontFamily: "Montserrat-Regular",
        fontSize: 16,
        width: wp(90),
        marginTop: 20,
        display: "flex",
        alignSelf: "center",
    },
})
