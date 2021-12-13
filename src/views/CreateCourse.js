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
import { courseAdd, uploadCourseImage } from '../Services/Course';
import { Checkbox } from 'react-native-paper';
import { getAllClasses } from '../Services/Classses';
import DocumentPicker from 'react-native-document-picker'
import { successAlertContext } from '../../App';
import { loadingContext } from '../navigators/stacks/RootStack';
import { RadioButton } from 'react-native-paper';


export default function CreateCourse(props) {

    const [loading, setLoading] = useContext(loadingContext);

    const [name, setName] = useState('');
    const [experience, setExperience] = useState('');
    const [description, setDescription] = useState('');
    const [hours, setHours] = useState('');

    const [assignments, setAssignments] = useState('');
    const [price, setPrice] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const [classesArr, setClassesArr] = useState([]);
    const [courseImg, setCourseImg] = useState();

    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr

    const [ClassType, setClassType] = useState("offline");

    const handleSubmit = async () => {
        setLoading(true)
        try {

            let classesFilteredArr = classesArr.filter(el => el.checked == true).map(el => {
                let obj = {
                    ...el,
                    classId: el._id,
                    subjectArr: el.subjectArr.filter(ele => ele.checked).map(ele => {
                        ele.subjectId = ele.subjectId
                        return ele
                    })
                }
                return obj
            })
            if (courseImg?.name != "" && name != "" && hours != "" && assignments != "" && description != "" && classesFilteredArr.length >= 1) {

                let userToken = await getDecodedToken()
                console.log(userToken)
                let obj = {
                    name,
                    hours,
                    price,
                    assignments,
                    classesArr: classesFilteredArr,

                    youtubeLink,
                    description,
                    userId: userToken?.userId,
                    ClassType
                }
                console.log(obj)
                const { data: res } = await courseAdd(obj);
                if (res.success) {
                    let formData = new FormData()
                    formData.append('file', courseImg)

                    const { data: response } = await uploadCourseImage(res.data._id, formData)

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

    const getClasses = async () => {
        try {
            let { data: res, status: statusCode } = await getAllClasses();
            console.log(statusCode)
            if (statusCode == 200 || statusCode == 304) {

                let tempArr = res.data.map(el => {
                    let obj = {
                        ...el,
                        subjectArr: el.subjectArr.map(ele => {
                            let tempObj = {
                                ...ele,
                                checked: false
                            }
                            return tempObj
                        }),
                        checked: false

                    }
                    return obj
                })
                // console.log(JSON.stringify(tempArr, null, 2), "classes")
                setClassesArr(tempArr)
            }
        }
        catch (err) {
            console.error(err)
        }
    }
    const setClassSelected = (id) => {

        let tempArr = classesArr.map(el => {
            if (el._id == id) {
                el.checked = !el.checked
            }
            return el
        })
        setClassesArr(tempArr)
        console.log(tempArr, "temp arr")
    }

    const setSelectedSubject = (classId, subjectId) => {
        setClassesArr(prevState => {
            let index = prevState.findIndex(el => el._id == classId);
            if (index != -1) {
                let subjectIndex = prevState[index].subjectArr.findIndex(ele => ele.subjectId == subjectId)
                if (subjectIndex != -1)
                    prevState[index].subjectArr[subjectIndex].checked = !prevState[index].subjectArr[subjectIndex].checked;

            }
            return [...prevState]
        })
    }
    const pickCourseImg = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.images],
            })
            console.log(
                res.uri,
                res.type, // mime type
                res.name,
                res.size,
            )
            setCourseImg(res)



        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err
            }
        }
    }
    useEffect(() => {
        // getCategories()
        getClasses()
    }, [])


    return (

        <View style={styles.container}>
            <NavBar rootProps={props} />
            <FlatList data={[]} renderItem={() => null}
                ListHeaderComponent={
                    <>

                        <Image source={require('../../assets/images/Banner.png')} style={{ alignSelf: 'center', marginTop: 10 }} />
                        <View style={styles.textContainer}>
                            <Text style={styles.mainHeading}>Create Your Course</Text>
                        </View>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={[styles.container, styles.inputContainer]}
                        >
                            <Icon name="person-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setName(val)} placeholder="Enter Course Name" />
                        </KeyboardAvoidingView>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={[styles.container,styles.inputContainer]}
                        >
                            <Icon name="cash-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setPrice(val)} placeholder="Enter Price" keyboardType="numeric" />
                        </KeyboardAvoidingView>
                        <TouchableOpacity style={[styles.inputContainer, { minHeight: 80 }]} onPress={() => pickCourseImg()}>
                            <Icon name="camera-outline" size={14} color={"#085A4E"} />
                            <Text style={{ fontFamily: "Montserrat-Thin", fontSize: 14, marginLeft: 10 }}>{courseImg?.name ? courseImg?.name : "Upload Thumbnail Image *"}</Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>Select Classes taught by you *</Text>

                        <FlatList
                            data={classesArr}
                            keyExtractor={(item, index) => `${item._id}`}
                            renderItem={({ item, index }) => {
                                return (
                                    <View>
                                        <View style={[styles.flexRowAlignCenter, { paddingHorizontal: 10 }]}>
                                            <Checkbox
                                                color={colorObj.primarColor}
                                                status={item.checked ? "checked" : "unchecked"}
                                                onPress={() => {
                                                    setClassSelected(item._id);
                                                }}
                                            />
                                            <TouchableOpacity style={{ width: wp(82), paddingVertical: 5, }} onPress={() => {
                                                setClassSelected(item._id);
                                            }}>
                                                <Text style={styles.radioText}>{item.name}</Text>
                                            </TouchableOpacity>

                                        </View>
                                        {item.checked &&
                                            <FlatList
                                                data={item.subjectArr}
                                                keyExtractor={(item, index) => `${item._id}`}
                                                renderItem={({ item: itemX, index: indexX }) => {
                                                    return (
                                                        <View style={[styles.flexRowAlignCenter, { marginVertical: 2, paddingHorizontal: 20 }]}>
                                                            <Checkbox
                                                                color={colorObj.primarColor}
                                                                status={itemX.checked ? "checked" : "unchecked"}
                                                                onPress={() => {
                                                                    setSelectedSubject(item._id, itemX.subjectId);
                                                                }}
                                                            />
                                                            <TouchableOpacity style={{ width: wp(82), paddingVertical: 5, }} onPress={() => {
                                                                setSelectedSubject(item._id, itemX.subjectId);
                                                            }}>
                                                                <Text>{itemX.subjectName}</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                }}
                                            />
                                        }
                                    </View>
                                )
                            }}
                        />
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={[styles.container, styles.inputContainer]}
                        >
                            <Icon name="library-outline" size={14} color="black" />
                            <TextInput keyboardType="numeric" style={styles.inputStyles} onChangeText={(val) => setHours(val)} placeholder="No of Hours" />
                        </KeyboardAvoidingView>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={[styles.container, styles.inputContainer]}
                        >
                            <Icon name="library-outline" size={14} color="black" />
                            <TextInput keyboardType="numeric" style={styles.inputStyles} onChangeText={(val) => setAssignments(val)} placeholder="No Of assignments" />
                        </KeyboardAvoidingView>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={[styles.container, styles.inputContainer]}
                        >
                            <Icon name="chatbox-ellipses-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setDescription(val)} placeholder="Enter Description" multiline={true} />
                        </KeyboardAvoidingView>

                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={[styles.container, styles.inputContainer]}
                        >
                            <Icon name="chatbox-ellipses-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setYoutubeLink(val)} placeholder="Youtube video link" multiline={true} />
                        </KeyboardAvoidingView>
                        <Text style={[styles.textInputLabel, { paddingHorizontal: 20, marginVertical: 10 }]}>Course Type</Text>

                        <RadioButton.Group onValueChange={newValue => setClassType(newValue)} value={ClassType}>
                            <View style={[{ marginVertical: 10, paddingHorizontal: 20 }]}>

                                <Pressable onPress={() => setClassType("online")} style={[styles.flexRow, { justifyContent: 'space-between' }]}>
                                    <Text style={styles.radioText}>1. Online</Text>
                                    <RadioButton color={colorObj.primarColor} value="online" />
                                </Pressable>
                                <Pressable onPress={() => setClassType("offline")} style={[styles.flexRow, { justifyContent: 'space-between' }]}>

                                    <Text style={styles.radioText}>2. Offline</Text>
                                    <RadioButton color={colorObj.primarColor} value="offline" />
                                </Pressable>

                            </View>
                        </RadioButton.Group>

                        <Pressable style={styles.btnContainer} onPress={() => {handleSubmit()}}>
                            <Text style={styles.termsText}></Text>
                            <Pressable style={styles.btn} onPress={() => {handleSubmit()}}>
                                <Text style={styles.btnText}>Create</Text>
                            </Pressable>
                        </Pressable>

                    </>

                }
                contentContainerStyle={{ paddingBottom: 100, backgroundColor: 'white' }} />


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
        minHeight:60,
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
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    label: {
        fontFamily: "Montserrat-Regular",
        fontSize: 16,
        width: wp(90),
        marginTop: 20,
        display: "flex",
        alignSelf: "center",
    },
    radioText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14
    },
    textInputLabel: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: '#000'
    },
})
