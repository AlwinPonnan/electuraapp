import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Appearance, Modal, TextInput, ScrollView, Keyboard, FlatList, KeyboardAvoidingView, ImageBackground } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from "react-native-vector-icons/Ionicons"
import NavBar from '../components/Navbar';
import { colorObj, dark_colors, light_colors } from '../globals/colors';
import DocumentPicker from 'react-native-document-picker'
import { getUser, updateProfile, updateProfileImage } from '../Services/User';
import { generateImageUrl } from '../globals/utils';
import { Checkbox } from 'react-native-paper';
import { profileContext, roleContext } from '../navigators/stacks/RootStack';
import { imageObj } from '../globals/images';

import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/core';

import { loadingContext } from '../navigators/stacks/RootStack';
export default function AccountEdit(props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [profileData, setProfileData] = useContext(profileContext);
    const [roleName, setRoleName] = useContext(roleContext);
    const [weekScheduleIsVisible, setWeekScheduleIsVisible] = useState(false);

    const [QualificationArr, setQualificationArr] = useState([{ qualificationName: "" }]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const [documentVal, setDocumentVal] = useState("");
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [genderIsSelected, setGenderIsMale] = useState(false);
    const [degree, setDegree] = useState('');
    const [aboutModal, setAboutModal] = useState(false);

    const focused = useIsFocused()

    const [isLoading, setIsLoading] = useContext(loadingContext);
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
                gender: genderIsSelected ? "Male" : "Female",
                enquiryObj: profileData.enquiryObj
            }
            console.log(obj)
            let { data: res, status: statusCode } = await updateProfile(obj)
            if (statusCode == 200 || statusCode == 304) {
                console.log(res.message)
                getUserData()
                alert(res.message)
                props.navigation.goBack()
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









    const getUserData = async () => {
        setIsLoading(true)
        try {
            let { data: res, status: statusCode } = await getUser();
            console.log(statusCode)
            if (statusCode == 200 || statusCode == 304) {
                console.log(JSON.stringify(res.data, null, 2))
                setName(res.data.name)
                setEmail(res.data.email)
                setMobile(res.data.phone)
                setProfilePhoto(res.data.profileImage)
                setProfileData(res.data)
                setDegree(res?.data?.enquiryObj?.educationObj?.degree)
                setGenderIsMale(res?.data?.enquiryObj?.gender == "Male" ? true : false)
                setRoleName(res.data.role)
                // console.log(JSON.stringify(res.data, null, 2))
            }
        }
        catch (err) {
            console.error(err)
        }
        setIsLoading(false)
    }

    const handleProfileDataUpdate = (val, field) => {
        if (field == "address") {
            setProfileData(prevState => {
                prevState.enquiryObj.address = val;
                return { ...prevState }
            })
        }
        else if (field == "experience") {
            setProfileData(prevState => {
                prevState.enquiryObj.experience = val;
                return { ...prevState }
            })
        }

        else if (field == "description") {
            setProfileData(prevState => {
                prevState.enquiryObj.description = val;
                return { ...prevState }
            })
        }
        else if (field == "youtubeLink") {
            setProfileData(prevState => {
                prevState.enquiryObj.youtubeLink = val;
                return { ...prevState }
            })
        }
        else if (field == "facebookLink") {
            setProfileData(prevState => {
                prevState.enquiryObj.facebookLink = val;
                return { ...prevState }
            })
        }
        else if (field == "instagramLink") {
            setProfileData(prevState => {
                prevState.enquiryObj.instagramLink = val;
                return { ...prevState }
            })
        }
    }


    useEffect(() => {
        getUserData()
    }, [focused])




    return (
        <>
            <NavBar rootProps={props} />
            <ScrollView style={styles.container}>
                <View>
                    {/* {
                        profileData?.backgroundImage ?
                            <View style={styles.topContainer}>
                                <View style={styles.addPhotoBtn}>
                                    <Icon name="camera-outline" size={16} color="black" />
                                    <Text style={styles.addPhotoBtnText}>Add Cover Photo</Text>
                                </View>
                            </View>
                            :
                    } */}
                    <ImageBackground source={imageObj.teacherBackBanner} style={styles.topContainer}>

                    </ImageBackground>
                    <Pressable onPress={() => pickImageProfilePhoto()} style={styles.circleImg}>
                        {
                            profilePhoto != "" && profilePhoto ?
                                <Image style={styles.profileImage} source={{ uri: generateImageUrl(profilePhoto) }} />
                                :
                                <Image style={styles.profileImage} source={require("../../assets/images/user.png")} />
                        }
                    </Pressable>
                </View>
                <View style={styles.userInfoContainer}>
                    <Text style={styles.label}>
                        Name
                    </Text>
                    <TextInput value={name} onChangeText={(e) => setName(e)} style={styles.txtInput} placeholder="Name" />
                    <Text style={styles.label}>
                        Email
                    </Text>
                    <TextInput value={email} keyboardType="email-address" onChangeText={(e) => setEmail(e)} style={styles.txtInput} placeholder="Enter your email" />
                    <Text style={styles.label}>
                        Phone
                    </Text>
                    <TextInput value={mobile} keyboardType="numeric" onChangeText={(e) => setMobile(e)} style={styles.txtInput} placeholder="Enter your phone" />
                    {
                        roleName == "TEACHER" &&
                        <>
                            <Text style={styles.label}>
                                Location
                            </Text>
                            <TextInput value={profileData?.enquiryObj?.address} onChangeText={(e) => handleProfileDataUpdate(e, "address")} style={styles.txtInput} placeholder="Enter your address" />
                            <Text style={styles.label}>
                                Description
                            </Text>
                            <TextInput multiline value={profileData?.enquiryObj?.description} onChangeText={(e) => handleProfileDataUpdate(e, "description")} style={styles.txtInput} placeholder="Enter your Description" />
                            <Text style={styles.label}>Select your Gender</Text>
                            <View style={{ display: "flex", flexDirection: "row" }}>

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
                                        <Text style={styles.CheckboxText}>Male</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10, alignItems: "center", alignSelf: "center", display: "flex", flexDirection: "row" }}>
                                    <Checkbox
                                        color={colorObj.primarColor}
                                        status={genderIsSelected ? "unchecked" : "checked"
                                        }
                                        onPress={() => {
                                            setGenderIsMale(false);
                                        }}
                                    />
                                    <TouchableOpacity style={{ paddingVertical: 5, }} onPress={() => {
                                        setGenderIsMale(false);
                                    }}>
                                        <Text style={styles.CheckboxText}>Female</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={styles.label}>
                                Teaching Experience
                            </Text>
                            <TextInput value={profileData?.enquiryObj?.experience} onChangeText={(e) => handleProfileDataUpdate(e, "experience")} style={styles.txtInput} placeholder="Your Teaching Experience" />

                            <Text style={styles.label}>
                                Facebook Profile name
                            </Text>
                            <TextInput value={profileData?.enquiryObj?.facebookLink} onChangeText={(e) => handleProfileDataUpdate(e, "facebookLink")} style={styles.txtInput} placeholder="Facebook profile name" />

                            <Text style={styles.label}>
                                Youtube Channel Name
                            </Text>
                            <TextInput value={profileData?.enquiryObj?.youtubeLink} onChangeText={(e) => handleProfileDataUpdate(e, "youtubeLink")} style={styles.txtInput} placeholder="Youtube channel name" />

                            <Text style={styles.label}>
                                Instagram Profile Name
                            </Text>
                            <TextInput value={profileData?.enquiryObj?.instagramLink} onChangeText={(e) => handleProfileDataUpdate(e, "instagramLink")} style={styles.txtInput} placeholder="Instagram profile name" />
                        </>

                    }
                    <Pressable style={styles.btn} onPress={() => handleProfileUpdate()}>
                        <Text style={styles.btnTxt}>Save</Text>
                    </Pressable>
                </View>

            </ScrollView>
            {/* <Portal>
                <Dialog visible={aboutModal} onDismiss={() => setAboutModal(false)}>
                    <Dialog.Title style={{ textAlign: 'center', fontFamily: 'Montserrat-SemiBold', fontSize: 20 }}>About You</Dialog.Title>
                    <Dialog.Content>
                        <Text style={styles.label}>
                            Name
                        </Text>
                        <TextInput value={name} onChangeText={(e) => setName(e)} style={styles.txtInput} placeholder="Name" />
                        <Text style={styles.label}>
                            Email
                        </Text>
                        <TextInput value={email} onChangeText={(e) => setEmail(e)} style={styles.txtInput} placeholder="Email" />
                        <Text style={styles.label}>
                            Phone
                        </Text>
                        <TextInput value={mobile} onChangeText={(e) => setMobile(e)} maxLength={10} style={styles.txtInput} keyboardType="number-pad" placeholder="Phone" />

                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => handleProfileUpdate()} >Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <Portal>
                <Dialog visible={aboutModal} onDismiss={() => setAboutModal(false)}>
                    <Dialog.Title style={{ textAlign: 'center', fontFamily: 'Montserrat-SemiBold', fontSize: 20 }}>About You</Dialog.Title>
                    <Dialog.Content>
                        <Text style={styles.label}>
                            Name
                        </Text>
                        <TextInput value={name} onChangeText={(e) => setName(e)} style={styles.txtInput} placeholder="Name" />
                        <Text style={styles.label}>
                            Email
                        </Text>
                        <TextInput value={email} onChangeText={(e) => setEmail(e)} style={styles.txtInput} placeholder="Email" />
                        <Text style={styles.label}>
                            Phone
                        </Text>
                        <TextInput value={mobile} onChangeText={(e) => setMobile(e)} maxLength={10} style={styles.txtInput} keyboardType="number-pad" placeholder="Phone" />

                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => handleProfileUpdate()} >Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal> */}
            {/* <View style={styles.container}>

                <KeyboardAvoidingView>

                    <FlatList
                        contentContainerStyle={[styles.innerContainer, { paddingBottom: isKeyboardVisible ? 250 : 80 }]}
                        data={QualificationArr}
                        keyExtractor={(item, index) => index}
                        renderItem={renderQualification}
                        ListHeaderComponent={
                            <>
                                <View style={styles.profileImageContainer}>
                                    {
                                        profilePhoto != "" && profilePhoto ?
                                            <Image style={styles.profileImage} source={{ uri: generateImageUrl(profilePhoto) }} />
                                            :
                                            <Image style={styles.profileImage} source={require("../../assets/images/user.png")} />
                                    }

                                    <TouchableOpacity style={styles.PickImageBtn} onPress={() => pickImageProfilePhoto()}>
                                        <Icon name="camera-outline" size={30} color={"#085A4E"} />
                                    </TouchableOpacity>
                                </View>

                                <TextInput value={name} onChangeText={(e) => setName(e)} style={styles.txtInput} placeholder="Name" />
                                <TextInput value={email} onChangeText={(e) => setEmail(e)} style={styles.txtInput} placeholder="Email" />
                                <TextInput value={mobile} onChangeText={(e) => setMobile(e)} maxLength={10} style={styles.txtInput} keyboardType="number-pad" placeholder="Phone" />



                                <TouchableOpacity onPress={() => pickImageDocument()} style={[styles.txtInput, { justifyContent: "space-between", display: "flex", flexDirection: "row", alignItems: "center", ddingHorizontal: 15, height: 45, }]} placeholder="Phone">
                                    <Text style={{ color: "black" }}>{documentVal != "" ? documentVal.name : "Please upload an Id proof"}</Text>
                                    <Icon name="camera-outline" size={30} color={"#085A4E"} />
                                </TouchableOpacity>

                                <Text style={styles.label}>
                                    Optional Data
                                </Text>



                                <Text style={styles.label}>Select your Gender</Text>
                                <View style={{ display: "flex", flexDirection: "column", }}>

                                    <View style={{ width: wp(81), marginTop: 10, alignItems: "center", alignSelf: "center", display: "flex", flexDirection: "row" }}>
                                        <Checkbox
                                            color={colorObj.primarColor}
                                            status={genderIsSelected ? "checked" : "unchecked"}
                                            onPress={() => {
                                                setGenderIsMale(true);
                                            }}
                                        />
                                        <TouchableOpacity style={{ width: wp(70), paddingVertical: 5, }} onPress={() => {
                                            setGenderIsMale(true);
                                        }}>
                                            <Text>Male</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ width: wp(81), marginTop: 10, alignItems: "center", alignSelf: "center", display: "flex", flexDirection: "row" }}>
                                        <Checkbox
                                            color={colorObj.primarColor}
                                            status={genderIsSelected ? "unchecked" : "checked"
                                            }
                                            onPress={() => {
                                                setGenderIsMale(false);
                                            }}
                                        />
                                        <TouchableOpacity style={{ width: wp(50), paddingVertical: 5, }} onPress={() => {
                                            setGenderIsMale(false);
                                        }}>
                                            <Text>Female</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={[styles.flexRow, { justifyContent: "space-between", alignItems: "center", marginTop: 20 }]}>
                                    <Text style={styles.label}>
                                        Proficient topics
                                    </Text>
                                    <TouchableOpacity style={styles.AddBtn} onPress={() => addQualification()}>
                                        <Icon name="ios-add-outline" size={30} color={"#085A4E"} />
                                    </TouchableOpacity>
                                </View>
                            </>
                        }
                        ListFooterComponent={


                            <>

                                <Pressable style={styles.btn} onPress={() => setModalVisible(true)}>
                                    <Text style={styles.btnTxt}>Update Week Schedule</Text>
                                </Pressable>


                                <Pressable style={styles.btn} onPress={() => handleProfileUpdate()}>
                                    <Text style={styles.btnTxt}>Update Profile</Text>
                                </Pressable>

                            </>



                        }
                    />
                </KeyboardAvoidingView>

            </View>


            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <Pressable style={styles.centeredView} onPress={()=>setModalVisible(false)}>
                        <Pressable style={styles.modalView}>
                            <Text style={[styles.label, { fontSize: 20 }]}>Select Weekly Schedule</Text>

                            <ScrollView horizontal >
                                <View style={styles.weekScheduleContainer}>

                                    <View style={styles.flexRow}>
                                        <Text style={styles.weekDayNameHeading}>Monday</Text>
                                        <Text style={styles.weekDayNameHeading}>Tuesday</Text>
                                        <Text style={styles.weekDayNameHeading}>Wednesday</Text>
                                        <Text style={styles.weekDayNameHeading}>Thursday</Text>
                                        <Text style={styles.weekDayNameHeading}>Friday</Text>
                                        <Text style={styles.weekDayNameHeading}>Saturday</Text>
                                        <Text style={styles.weekDayNameHeading}>Sunday</Text>
                                    </View>
                                    <View style={styles.flexRow}>
                                        <Text style={[styles.weekDayName, styles.selectedWeedTime]}>7-8 PM</Text>
                                        <Text style={[styles.weekDayName, styles.selectedWeedTime]}>7-8 PM</Text>
                                        <Text style={styles.weekDayName}>7-8 PM</Text>
                                        <Text style={styles.weekDayName}>7-8 PM</Text>
                                        <Text style={styles.weekDayName}>7-8 PM</Text>
                                        <Text style={styles.weekDayName}>7-8 PM</Text>
                                        <Text style={styles.weekDayName}>7-8 PM</Text>
                                    </View>
                                    <View style={styles.flexRow}>
                                        <Text style={styles.weekDayName}>8-9 AM</Text>
                                        <Text style={[styles.weekDayName, styles.selectedWeedTime]}>8-9 AM</Text>
                                        <Text style={styles.weekDayName}>8-9 AM</Text>
                                        <Text style={styles.weekDayName}>8-9 AM</Text>
                                        <Text style={styles.weekDayName}>8-9 AM</Text>
                                        <Text style={styles.weekDayName}>8-9 AM</Text>
                                        <Text style={styles.weekDayName}>8-9 AM</Text>
                                    </View>
                                    <View style={styles.flexRow}>
                                        <Text style={styles.weekDayName}>9-10 AM</Text>
                                        <Text style={styles.weekDayName}>9-10 AM</Text>
                                        <Text style={styles.weekDayName}>9-10 AM</Text>
                                        <Text style={[styles.weekDayName, styles.selectedWeedTime]}>9-10 AM</Text>
                                        <Text style={styles.weekDayName}>9-10 AM</Text>
                                        <Text style={styles.weekDayName}>9-10 AM</Text>
                                        <Text style={styles.weekDayName}>9-10 AM</Text>
                                    </View>
                                    <View style={styles.flexRow}>
                                        <Text style={styles.weekDayName}>11-12 AM</Text>
                                        <Text style={styles.weekDayName}>11-12 AM</Text>
                                        <Text style={[styles.weekDayName, styles.selectedWeedTime]}>11-12 AM</Text>
                                        <Text style={styles.weekDayName}>11-12 AM</Text>
                                        <Text style={styles.weekDayName}>11-12 AM</Text>
                                        <Text style={styles.weekDayName}>11-12 AM</Text>
                                        <Text style={styles.weekDayName}>11-12 AM</Text>
                                    </View>
                                    <View style={styles.flexRow}>
                                        <Text style={styles.weekDayName}>1-2 PM</Text>
                                        <Text style={styles.weekDayName}>1-2 PM</Text>
                                        <Text style={styles.weekDayName}>1-2 PM</Text>
                                        <Text style={styles.weekDayName}>1-2 PM</Text>
                                        <Text style={styles.weekDayName}>1-2 PM</Text>
                                        <Text style={styles.weekDayName}>1-2 PM</Text>
                                        <Text style={styles.weekDayName}>1-2 PM</Text>
                                    </View>
                                    <View style={styles.flexRow}>
                                        <Text style={styles.weekDayName}>2-3 PM</Text>
                                        <Text style={[styles.weekDayName, styles.selectedWeedTime]}>2-3 PM</Text>
                                        <Text style={styles.weekDayName}>2-3 PM</Text>
                                        <Text style={styles.weekDayName}>2-3 PM</Text>
                                        <Text style={styles.weekDayName}>2-3 PM</Text>
                                        <Text style={[styles.weekDayName, styles.selectedWeedTime]}>2-3 PM</Text>
                                        <Text style={styles.weekDayName}>2-3 PM</Text>
                                    </View>
                                    <View style={styles.flexRow}>
                                        <Text style={[styles.weekDayName, styles.selectedWeedTime]}>3-4 PM</Text>
                                        <Text style={styles.weekDayName}>3-4 PM</Text>
                                        <Text style={styles.weekDayName}>3-4 PM</Text>
                                        <Text style={styles.weekDayName}>3-4 PM</Text>
                                        <Text style={styles.weekDayName}>3-4 PM</Text>
                                        <Text style={styles.weekDayName}>3-4 PM</Text>
                                        <Text style={styles.weekDayName}>3-4 PM</Text>
                                    </View>
                                    <View style={styles.flexRow}>
                                        <Text style={styles.weekDayName}>4-5 PM</Text>
                                        <Text style={styles.weekDayName}>4-5 PM</Text>
                                        <Text style={styles.weekDayName}>4-5 PM</Text>
                                        <Text style={styles.weekDayName}>4-5 PM</Text>
                                        <Text style={styles.weekDayName}>4-5 PM</Text>
                                        <Text style={styles.weekDayName}>4-5 PM</Text>
                                        <Text style={styles.weekDayName}>4-5 PM</Text>
                                    </View>
                                </View>




                            </ScrollView>
                            <Pressable style={styles.btn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.btnTxt}>Save Week Schedule</Text>
                            </Pressable>
                        </Pressable>
                    </Pressable>
                </Modal>

            </View> */}
        </>

    )
}
const styles = StyleSheet.create({
    container: {
        display: "flex",
        height: hp(97),
        backgroundColor: "white",
        // paddingHorizontal: 10,
        // paddingTop: hp(5)
    },
    topContainer: {
        height: hp(18),
        backgroundColor: colorObj.orangeColor,
        width: wp(100),
        position: 'relative',
        paddingHorizontal: 5
    },
    circleImg: {
        borderRadius: 50,
        height: 100,
        width: 100,
        position: 'absolute',
        bottom: -30,
        left: '40%',
        alignSelf: 'center'
    },
    addPhotoBtn: {
        backgroundColor: colorObj.whiteColor,
        borderRadius: 5,
        paddingHorizontal: 10,
        // width:'35%',
        position: 'absolute',
        bottom: 10,
        paddingVertical: 5,
        right: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },

    addPhotoBtnText: {
        fontFamily: 'Montserrat-Regular',
        paddingHorizontal: 5
    },

    userInfoContainer: {
        marginTop: 40,
        paddingHorizontal: 25
    },
    userInfoText: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 20
    },
    bottomLine: {
        height: 1,
        width: wp(90),
        marginHorizontal: 15,
        marginVertical: 10,
        backgroundColor: colorObj.greyColor
    },
    mainContentContainer: {
        height: hp(20),
        width: wp(90),
        backgroundColor: colorObj.whiteColor,
        marginHorizontal: 15,
        paddingHorizontal: 10,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
        marginVertical: 5
        // alignSelf:'center'
    },
    mainContentText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 13,
        marginTop: 10,
        color: '#ACB0BF'
    },
    mainContentHeading: {
        fontSize: 16,
        fontFamily: 'Montserrat-SemiBold'
    },
    mainContentBtn: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colorObj.darkBlueColor,
        paddingHorizontal: 10,
        paddingVertical: 2,
        position: 'absolute',
        right: 10,
        top: 0
    },
    mainContentBtnText: {
        fontFamily: 'Montserrat-Regular',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // paddingTop: 22,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
        margin: 10,

        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    innerContainer: {
        width: wp(88),
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

    weekScheduleContainer: {
        display: "flex",
        alignSelf: "center",
        flexDirection: "column",
        paddingHorizontal: 10,
        marginTop: 0,
    },
    weekDayNameHeading: {
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "grey",
        backgroundColor: colorObj.primarColor,
        color: "white",
        width: 100,
        paddingVertical: 10,
        textAlign: "center",
        margin: 5,
        borderRadius: 5,
        height: 40
    },
    weekDayName: {
        paddingHorizontal: 15,
        width: 100,
        paddingVertical: 10,
        textAlign: "center",
        borderColor: "grey",
        borderWidth: 1,
        borderRadius: 5,
        margin: 5,
        height: 40
    },

    selectedWeedTime: {
        backgroundColor: colorObj.orangeColor,
        color: "white"
    },

    ///////txt

    label: {
        fontFamily: 'Montserrat-Medium',
        color: "#BDBDBD",
        fontSize: 16,
        color: "grey",
        paddingLeft: 5,
        marginVertical: 5,
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
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 2,
        // borderRadius: 25,
        // marginTop: 20,
        paddingHorizontal: 10,
        // paddingLeft: 20,
        backgroundColor: "#fff",
        fontFamily: 'Montserrat-Medium',
        marginBottom: 10,
        color: '#333333'

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
        borderRadius: 5,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'flex-end',
        paddingHorizontal: 20,
        marginVertical: 10,
        marginBottom: 20,
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

    CheckboxText: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14
    }
})
