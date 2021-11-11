import React, { useState, useEffect, useCallback, useContext } from 'react'
import { View, Text, StyleSheet, Image, TextInput, Pressable, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity, FlatList } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorObj } from '../globals/colors';
import { imageObj } from '../globals/images';

import Icon from 'react-native-vector-icons/Ionicons'
import DocumentPicker from 'react-native-document-picker'

import { getDecodedToken, getToken, getUser, SendOtp, updateProfileImage } from '../Services/User';
import { checkValidPhone } from '../globals/utils';
import NavBar from '../components/Navbar'
import { newEnquiry, uploadIdProof, uploadQualifications } from '../Services/TeacherEnquiry';
import { Picker } from '@react-native-picker/picker';
import { getAllCategory } from '../Services/Category';
import { useIsFocused } from '@react-navigation/core';
import { RadioButton } from 'react-native-paper';
import { getAllClasses } from '../Services/Classses';
import { Checkbox } from 'react-native-paper';

import { nanoid } from 'nanoid/non-secure'
import { loadingContext } from '../navigators/stacks/RootStack';

import RNPickerSelect from 'react-native-picker-select';
import { successAlertContext } from '../../App';

export default function RegisterTeacher(props) {

    const [phone, setPhone] = useState();
    const [checked, setChecked] = React.useState('individual');
    const [pincode, setPincode] = useState("");
    const [onlineIsSelected, setOnlineIsSelected] = useState(false);
    const [offlineIsSelected, setOfflineIsSelected] = useState(false);

    const [classesArr, setClassesArr] = useState([]);
    const [certificate, setCertificate] = useState();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [experience, setExperience] = useState('');
    const [degree, setDegree] = useState('');
    const [validId, setvalidId] = useState()
    const [genderIsSelected, setGenderIsMale] = useState(false);
    const [isLoading, setIsLoading] = useContext(loadingContext);
    const [topicArr, setTopicArr] = useState([
        {
            text: '', id: nanoid()
        },
        {
            text: '', id: nanoid()
        },
        { text: '', id: nanoid() }
    ]);

    const [facebookLink, setFacebookLink] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const [instagramLink, setInstagramLink] = useState('');
    const [telegramLink, setTelegramLink] = useState('');


    const [university, setUniversity] = useState('');
    const [minFees, setMinFees] = useState('');
    const [maxFees, setMaxFees] = useState('');





    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr


    const focused = useIsFocused();

    const handleSubmit = async () => {
        setIsLoading(true)
        try {

            let classesFilteredArr = classesArr.filter(el => el.checked).map(el => {
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
            // let categoryFilteredArr = categoryArr.filter(el => el.checked == true).map(el => { return { categoryId: el._id } })
            console.log(JSON.stringify(classesFilteredArr, null, 2))
            if (validId?.name != "" && name != "" && classesFilteredArr.length > 0) {
                let userToken = await getDecodedToken()
                let obj = {
                    name,
                    email,
                    userId: userToken.userId,
                    classesArr: classesFilteredArr,
                }
                const { data: res } = await newEnquiry(obj);
                if (res.success) {
                    let formData = new FormData();
                    formData.append('file', validId)
                    const { data: response } = await uploadIdProof(res.data._id, formData)
                    // if (certificate?.name) {
                    //     let form_data = new FormData();
                    //     form_data.append('file', certificate)
                    //     const { data: responses } = await uploadQualifications(res.data._id, formData)
                    // }
                    setAlertText(res.message)
                    setSuccessAlert(true)
                    // alert(res.message)
                    props.navigation.goBack()
                }
            }
            else {
                setWarningAlert(true)
                setAlertText("Please Enter All Required Values")
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
        setIsLoading(false)
    }

    const [categoryArr, setCategoryArr] = useState([]);

    // const getCategories = async () => {
    //     try {
    //         const { data: res } = await getAllCategory();
    //         if (res.success) {
    //             let tempArr = res.data.map(el => {
    //                 el.checked = false
    //                 return el
    //             })
    //             setCategoryArr(tempArr)
    //         }
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }


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

    const getClasses = async () => {
        try {
            let { data: res, status: statusCode } = await getAllClasses();
            console.log(statusCode)
            if (statusCode == 200 || statusCode == 304) {

                let tempArr = res.data.map(el => {
                    let obj = {
                        ...el,
                        label: el.name,
                        value: el._id,
                        addMore: false,
                        subjectArr: el.subjectArr.map(ele => {
                            let tempObj = {
                                ...ele,
                                checked: false,

                            }
                            return tempObj
                        }),
                        checked: false,


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
    // const setCategorySelected = (id) => {

    //     let tempArr = categoryArr.map(el => {
    //         if (el._id == id) {
    //             el.checked = !el.checked
    //         }
    //         return el
    //     })
    //     setCategoryArr(tempArr)
    // }


    const pickImageValidId = async () => {
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
            setvalidId(res)



        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err
            }
        }
    }

    const pickCertificate = async () => {
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
            setCertificate(res)



        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err
            }
        }
    }




    const handleProfileImageUpdate = async (obj) => {
        try {
            console.log(obj, "image Object")
            let formData = new FormData()
            formData.append("file", obj)
            let { data: res, status: statusCode } = await updateProfileImage(formData)
            if (statusCode == 200 || statusCode == 304) {
                console.log(res.message)
                getUserData()
            }
            console.log(res)
        }
        catch (err) {
            console.error(err)
        }
    }



    const handleTopicSet = (index, text) => {
        setTopicArr(prevState => {
            prevState[index].text = text;
            return [...prevState]
        })
    }

    useEffect(() => {
        if (focused) {
            // getCategories()
            getUserData()
            getClasses()
        }
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



                        <View style={{ display: "flex", flexDirection: "column", width: wp(92), alignSelf: "center" }}>
                            <View style={styles.flexRowAlignCenter}>

                                <RadioButton
                                    color={colorObj.primarColor}
                                    value="individual"
                                    uncheckedColor="grey"
                                    status={checked === 'individual' ? 'checked' : 'unchecked'}
                                    onPress={() => setChecked('individual')}
                                />
                                <Pressable onPress={() => setChecked('individual')}>
                                    <Text style={styles.RadioBtnTxt}>I'm an individual tutor</Text>
                                </Pressable>
                            </View>
                            <View style={styles.flexRowAlignCenter}>
                                <RadioButton
                                    value="institute"
                                    color={colorObj.primarColor}
                                    uncheckedColor="grey"
                                    status={checked === 'institute' ? 'checked' : 'unchecked'}
                                    onPress={() => setChecked('institute')}
                                />
                                <Pressable onPress={() => setChecked('institute')}>
                                    <Text style={styles.RadioBtnTxt}>I’m an institute</Text>
                                </Pressable>
                            </View>

                        </View>
                        <Text style={styles.label}>Enter your name</Text>

                        <View style={styles.inputContainer}>
                            <Icon name="person-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} value={name} onChangeText={(val) => setName(val)} placeholder="Enter your Name *" />
                        </View>
                        {/* <Text style={styles.label}>Enter your email</Text>

                        <View style={styles.inputContainer}>
                            <Icon name="mail-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} value={email}  onChangeText={(val) => setEmail(val)} keyboardType="email-address" placeholder="Enter your Email " />
                        </View> */}
                        <Text style={styles.label}>Enter your phone</Text>

                        <View style={styles.inputContainer}>
                            <Icon name="call-outline" size={14} color="black" />
                            <TextInput maxLength={10} style={styles.inputStyles} editable={false} value={phone} onChangeText={(val) => setPhone(val)} keyboardType="numeric" placeholder="+91     Enter Number  *" />
                        </View>

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
                                                <Text style={{ fontFamily: 'Montserrat-Regular' }}>{item.name}</Text>
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
                                                                <Text style={{ fontFamily: 'Montserrat-Regular' }}>{itemX.subjectName}</Text>
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

                        <Text style={styles.label}>Upload your Id</Text>

                        <TouchableOpacity style={[styles.inputContainer, { minHeight: 80 }]} onPress={() => pickImageValidId()}>
                            <Icon name="camera-outline" size={14} color={"#085A4E"} />
                            <Text style={{ fontFamily: "Montserrat-Thin", fontSize: 14, marginLeft: 10 }}>{validId?.name ? validId?.name : "Upload An Id Image *"}</Text>
                        </TouchableOpacity>
                        {/* <Text style={styles.label}>Select your Gender</Text>

                        <View style={[styles.flexRowAlignCenter, { justifyContent: "flex-start", marginLeft: wp(5) }]}>

                            <View style={{ marginTop: 10, alignItems: "center", alignSelf: "center", display: "flex", flexDirection: "row" }}>
                                <Checkbox
                                    color={colorObj.primarColor}
                                    status={genderIsSelected ? "checked" : "unchecked"}
                                    onPress={() => {
                                        setGenderIsMale(true);
                                    }}
                                />
                                <TouchableOpacity style={{ paddingVertical: 5, }} onPress={() => {
                                    setGenderIsMale(true);
                                }}>
                                    <Text>Male</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 10, alignItems: "center", alignSelf: "center", display: "flex", flexDirection: "row" }}>
                                <Checkbox
                                    color={colorObj.primarColor}
                                    status={!genderIsSelected ? "checked" : "unchecked"}
                                    onPress={() => {
                                        setGenderIsMale(false);
                                    }}
                                />
                                <TouchableOpacity style={{ paddingVertical: 5, }} onPress={() => {
                                    setGenderIsMale(false);
                                }}>
                                    <Text>Female</Text>
                                </TouchableOpacity>
                            </View>

                        </View> */}


                        {/* <Text style={styles.label}>Enter your Proficient topics</Text>
                        <FlatList
                            data={topicArr}
                            keyExtractor={(item, index) => `${item.id}`}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={styles.inputContainer}>
                                        <Icon name="book-outline" size={14} color="black" />
                                        <TextInput style={styles.inputStyles} onChangeText={(val) => handleTopicSet(index, val)} value={item.text} placeholder={`Enter Topic ${index + 1} `} />
                                    </View>
                                )
                            }}
                        />


                        <Text style={styles.label}>Select Mode of Teaching</Text>

                        <View style={[styles.flexRowAlignCenter, { justifyContent: "flex-start", marginLeft: wp(5) }]}>

                            <View style={{ marginTop: 10, alignItems: "center", alignSelf: "center", display: "flex", flexDirection: "row" }}>
                                <Checkbox
                                    color={colorObj.primarColor}
                                    status={onlineIsSelected ? "checked" : "unchecked"}
                                    onPress={() => {
                                        setOnlineIsSelected(!onlineIsSelected);
                                    }}
                                />
                                <TouchableOpacity style={{ paddingVertical: 5, }} onPress={() => {
                                    setOnlineIsSelected(!onlineIsSelected);
                                }}>
                                    <Text>Online</Text>
                                </TouchableOpacity>
                            </View>



                            <View style={{ marginTop: 10, alignItems: "center", alignSelf: "center", display: "flex", flexDirection: "row" }}>
                                <Checkbox
                                    color={colorObj.primarColor}
                                    status={offlineIsSelected ? "checked" : "unchecked"}
                                    onPress={() => {
                                        setOfflineIsSelected(!offlineIsSelected);
                                    }}
                                />
                                <TouchableOpacity style={{ paddingVertical: 5, }} onPress={() => {
                                    setOfflineIsSelected(!offlineIsSelected);
                                }}>
                                    <Text>Offline</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                        <Text style={styles.label}>Enter your pincode</Text>

                        <View style={styles.inputContainer}>
                            <Icon name="location-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} maxLength={6} onChangeText={(val) => setPincode(val)} value={pincode} placeholder="Enter Pincode" keyboardType="number-pad" />
                        </View>
                        <Text style={styles.label}>Enter your Highest Education</Text>

                        <View style={styles.inputContainer}>
                            <Icon name="library-outline" size={14} color="black" />
                            <TextInput multiline={true} style={styles.inputStyles} value={degree} onChangeText={(val) => setDegree(val)} placeholder="Enter your Highest Education" />
                        </View>

                        <Text style={styles.label}>Enter your Experience</Text>

                        <View style={styles.inputContainer}>
                            <Icon name="library-outline" size={14} color="black" />
                            <TextInput style={styles.inputStyles} keyboardType="number-pad" value={experience} onChangeText={(val) => setExperience(val)} placeholder="Enter your Experience in Yrs" />
                        </View>
                        <Text style={styles.label}>Enter your Certificate</Text>
                        <TouchableOpacity style={[styles.inputContainer, { minHeight: 80 }]} onPress={() => pickCertificate()}>
                            <Icon name="camera-outline" size={14} color={"#085A4E"} />
                            <Text style={{ fontFamily: "Montserrat-Thin", fontSize: 14, marginLeft: 10 }}>{certificate?.name ? certificate.name : "Upload An Id Image *"}</Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>Enter your Facebook Link</Text>
                        <View style={styles.inputContainer}>
                            <Icon name="logo-facebook" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setFacebookLink(val)} value={facebookLink} placeholder="Enter Facebook Link" />
                        </View>
                        <Text style={styles.label}>Enter your Youtube Link</Text>
                        <View style={styles.inputContainer}>
                            <Icon name="logo-youtube" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setYoutubeLink(val)} value={youtubeLink} placeholder="Enter Youtube Link" />
                        </View>
                        <Text style={styles.label}>Enter your Instagram Link</Text>
                        <View style={styles.inputContainer}>
                            <Icon name="logo-instagram" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setInstagramLink(val)} value={instagramLink} placeholder="Enter Instagram Link" />
                        </View>

                        <Text style={styles.label}>Enter your Telegram Link</Text>
                        <View style={styles.inputContainer}>
                            <Icon name="paper-plane" size={14} color="black" />
                            <TextInput style={styles.inputStyles} onChangeText={(val) => setTelegramLink(val)} value={telegramLink} placeholder="Enter Telegram Link" />
                        </View> */}






                        <View style={styles.btnContainer}>
                            <Text style={styles.termsText}>By Continuing you accept the <Text style={{ color: colorObj.primarColor }}>terms and conditions</Text></Text>
                            <Pressable style={styles.btn} onPress={() => handleSubmit()}>
                                <Text style={styles.btnText}>Become A Teacher</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View >
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
    },
    flexRowAlignCenter: {
        display: "flex",
        marginVertical: 15,
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
    RadioBtnTxt: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 16,
        marginLeft: 15,
    },
})
