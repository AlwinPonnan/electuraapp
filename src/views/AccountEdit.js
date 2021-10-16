import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Appearance, TextInput, ScrollView, Keyboard, FlatList, KeyboardAvoidingView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from "react-native-vector-icons/Ionicons"
import NavBar from '../components/Navbar';
import { dark_colors, light_colors } from '../globals/colors';
import DocumentPicker from 'react-native-document-picker'
import { getUser, updateProfile, updateProfileImage } from '../Services/User';
import { generateImageUrl } from '../globals/utils';
export default function AccountEdit(props) {
    const [QualificationArr, setQualificationArr] = useState([{ qualificationName: "asd" }]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const [documentVal, setDocumentVal] = useState("");
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const addQualification = () => {
        setQualificationArr(previousState => {
            return [...previousState, { qualificationName: "" }]
        })
    }

    const removeQualification = (index) => {
        setQualificationArr(previousState => {

            previousState.splice(index, 1)

            return [...previousState]
        })
    }

    const handleQualificationInput = (index, val) => {
        let tempArr = QualificationArr.map((el, i) => {
            if (i == index) {
                el.qualificationName = val
            }
            return el
        })
        setQualificationArr(tempArr)
    }

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);



    const pickImageProfilePhoto = async () => {
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
            setProfilePhoto(res)

            handleProfileImageUpdate(res)




        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err
            }
        }
    }


    const pickImageDocument = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.images],
            })
            console.log(res)
            console.log(
                res.uri,
                res.type, // mime type
                res.name,
                res.size,
            )
            setDocumentVal(res)
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err
            }
        }
    }




    const handleProfileUpdate = async () => {
        try {
            let obj = {
                name,
                email,
                phone: mobile,
            }
            console.log(obj)
            let { data: res, status: statusCode } = await updateProfile()
            if (statusCode == 200 || statusCode == 304) {
                console.log(res.message)
                alert(res.message)
            }
            console.log(res)
        }
        catch (err) {
            console.error(err)
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
                // alert(res.message)/
                getUserData()
            }
            console.log(res)
        }
        catch (err) {
            console.error(err)
        }
    }





    const renderQualification = ({ item, index }) => {
        return (
            <>
                <View style={[styles.flexRow, { alignItems: "center", marginVertical: 7 }]}>
                    <TextInput onChangeText={(val) => handleQualificationInput(index, val)} value={item.qualificationName} style={[styles.txtInput, { flex: 1 }]} placeholder="name" />
                    <TouchableOpacity style={[styles.AddBtn, { padding: 5, marginLeft: 10 }]} onPress={() => removeQualification(index)}>
                        <Icon name="ios-trash-outline" size={20} color={"#085A4E"} />
                    </TouchableOpacity>
                </View>
            </>
        )
    }



    const getUserData = async () => {
        try {
            let { data: res, status: statusCode } = await getUser();
            console.log(statusCode)
            if (statusCode == 200 || statusCode == 304) {
                console.log(JSON.stringify(res.data, null, 2))
                setName(res.data.name)
                setEmail(res.data.email)
                setMobile(res.data.phone)
                setProfilePhoto(res.data.profileImage)
                // console.log(JSON.stringify(res.data, null, 2))
            }
        }
        catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getUserData()
    }, [])




    return (
        <>
            <NavBar rootProps={props} />
            <View style={styles.container}>
                <KeyboardAvoidingView>
                    {/* 
                <FlatList
                    contentContainerStyle={[styles.innerContainer, { paddingBottom: isKeyboardVisible ? 250 : 80 }]}
                    data={QualificationArr}
                    keyExtractor={(item, index) => index}
                    renderItem={renderQualification}
                    ListHeaderComponent={ */}
                    <>
                        <View style={styles.profileImageContainer}>
                            {
                                profilePhoto != "" && profilePhoto ?
                                    <Image style={styles.profileImage} source={{ uri: generateImageUrl(profilePhoto) }} />
                                    :
                                    <Image style={styles.profileImage} source={require("../../assets/images/user.jpg")} />
                            }

                            <TouchableOpacity style={styles.PickImageBtn} onPress={() => pickImageProfilePhoto()}>
                                <Icon name="camera-outline" size={30} color={"#085A4E"} />
                            </TouchableOpacity>
                        </View>

                        <TextInput value={name} onChangeText={(e) => setName(e)} style={styles.txtInput} placeholder="Name" />
                        <TextInput value={email} onChangeText={(e) => setEmail(e)} style={styles.txtInput} placeholder="Email" />
                        <TextInput value={mobile} onChangeText={(e) => setMobile(e)} maxLength={10} style={styles.txtInput} keyboardType="number-pad" placeholder="Phone" />

                        {/* <TouchableOpacity onPress={() => pickImageDocument()} style={[styles.txtInput, { justifyContent: "space-between", display: "flex", flexDirection: "row", alignItems: "center", ddingHorizontal: 15, height: 45, }]} placeholder="Phone">
                        <Text style={{ color: "black" }}>{documentVal != "" ? documentVal.name : "Please upload an Id proof"}</Text>
                        <Icon name="camera-outline" size={30} color={"#085A4E"} />
                    </TouchableOpacity> */}
                        {/* <View style={[styles.flexRow, { justifyContent: "space-between", alignItems: "center", marginTop: 20 }]}>
                        <Text style={styles.label}>
                            Qualifications
                        </Text>
                        <TouchableOpacity style={styles.AddBtn} onPress={() => addQualification()}>
                            <Icon name="ios-add-outline" size={30} color={"#085A4E"} />
                        </TouchableOpacity>
                    </View> */}
                        <Pressable style={styles.btn} onPress={() => handleProfileUpdate()}>
                            <Text style={styles.btnTxt}>Update Profile</Text>
                        </Pressable>
                    </>

                </KeyboardAvoidingView>

            </View>
        </>

    )
}
const styles = StyleSheet.create({
    container: {
        display: "flex",
        height: hp(97),
        backgroundColor: "white",
        paddingHorizontal: 25,
        paddingTop: hp(5)
    },
    innerContainer: {
        width: wp(82),
        display: "flex",
        justifyContent: "center",
        paddingTop: 30,
        alignSelf: "center",
        paddingBottom: 50,
    },
    profileImageContainer: {
        height: 130,
        width: 130,
        borderRadius: 150,
        marginBottom: 50,
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: Appearance.getColorScheme() == 'dark' ? dark_colors.primary : light_colors.primary,
    },

    ///////txt

    label: {
        fontFamily: 'OpenSans-SemiBold',
        color: "black",
        fontSize: 14,
        marginBottom: 8,
        color: "grey",
        paddingLeft: 5,
        marginTop: 30,
        // paddingTop: 15,
        textTransform: "capitalize",
    },
    btnTxt: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 17,
        color: "grey",
        paddingLeft: 5,
        // paddingTop: 15,
        textTransform: "capitalize",
        color: "white"
    },

    ////image
    profileImage: {
        height: "95%",
        width: "95%",
        borderRadius: 150,
    },

    //////txtinput
    txtInput: {
        borderColor: "rgba(0,0,0,0.1)",
        borderWidth: 2,
        borderRadius: 25,
        marginTop: 20,
        paddingHorizontal: 10,
        paddingLeft: 20,
        backgroundColor: "#fff",

    },

    //////btn
    becomeATeacherBtn: {
        backgroundColor: "#F6F5F8",
        width: wp(50),
        marginTop: hp(2),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        height: 45,
        borderRadius: 10
    },
    PickImageBtn: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#E3E7FD",
        padding: 5,
        borderRadius: 8,
    },
    AddBtn: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E3E7FD",
        height: 30,
        borderRadius: 8,
    },
    btn: {
        backgroundColor: "#085A4E",
        borderRadius: 25,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
        paddingVertical: 10,
    },

    //////flex
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
})
