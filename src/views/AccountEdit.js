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
import { successAlertContext } from '../../App';
import { getAllStates } from '../Services/state';
import { getByStateId } from '../Services/city';
import { getByCityId } from '../Services/area';
import { Picker } from '@react-native-picker/picker';

import MatIcon from 'react-native-vector-icons/MaterialIcons'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import uuid from 'react-native-uuid';

export default function AccountEdit(props) {

    const [modalVisible, setModalVisible] = useState(false);
    const [profileData, setProfileData] = useContext(profileContext);
    const [roleName, setRoleName] = useContext(roleContext);
    const [weekScheduleIsVisible, setWeekScheduleIsVisible] = useState(false);
    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)

    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr



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

    const [stateArr, setStateArr] = useState([]);
    const [cityArr, setCityArr] = useState([]);
    const [areaArr, setAreaArr] = useState([]);

    const [selectedStateId, setSelectedStateId] = useState('');
    const [selectedCityId, setSelectedCityId] = useState('');
    const [selectedAreaId, setSelectedAreaId] = useState('');
    const [isLoading, setIsLoading] = useContext(loadingContext);


    const [selectedQulifications, setSelectedQulifications] = useState([]);

    const items = [
        // this is the parent or 'item'
        {
            name: 'Art/Science',
            id: 1,
            // these are the children or 'sub items'
            children: [
                {
                    name: 'B.A.',
                    id: 2,
                },
                {
                    name: 'M.A.',
                    id: 3,

                },
                {
                    name: 'B.F.A',
                    id: 4,

                },
                {
                    name: 'M.F.A',
                    id: 5,

                },
                {
                    name: 'B.Ed',
                    id: 6,

                },
                {
                    name: 'M.Ed',
                    id: 7,

                },
                {
                    name: 'B.Sc.',
                    id: 8,

                },
                {
                    name: 'M.Sc.',
                    id: 9,

                },
                {
                    name: 'BJMC',
                    id: 10,

                },
                {
                    name: 'BJMC',
                    id: 11,

                },
                {
                    name: 'MJMC',
                    id: 12,

                },
                {
                    name: 'MSW',
                    id: 13,

                }
            ],
        },
        {
            name: 'Computers',
            id: 14,

            // these are the children or 'sub items'
            children: [
                {
                    name: 'B.IT.',
                    id: 15,

                },
                {
                    name: 'BCA',
                    id: 16,

                },
                {
                    name: 'MCA/PGDCA',
                    id: 17,

                },
            ],
        },
        {
            name: 'Doctorate',
            id: 18,
            // these are the children or 'sub items'
            children: [
                {
                    name: 'M.Phill',
                    id: 19,

                },
                {
                    name: 'Ph.D.',
                    id: 20,

                },

            ],
        },
        {
            name: 'Engineering/Design',
            id: 21,
            // these are the children or 'sub items'
            children: [
                {
                    name: 'B.Tech/B.E.',
                    id: 22,

                },
                {
                    name: 'M.Tech/M.E.',
                    id: 23,

                },
                {
                    name: 'M.Tech/M.E.',
                    id: 24,

                },
                {
                    name: 'B.Arch',
                    id: 25,

                },
                {
                    name: 'M.Arch',
                    id: 26,

                },
                {
                    name: 'B.Des.',
                    id: 27,

                },
                {
                    name: 'M.Arch',
                    id: 28,

                },
                {
                    name: 'B.Pharma',
                    id: 29,

                },
                {
                    name: 'M.Pharma',
                    id: 30,

                },
                {
                    name: 'M.S.(Engineering)',
                    id: 31,

                }

            ],
        },
        {
            name: 'Finance/Commerce',
            id: 32,

            // these are the children or 'sub items'
            children: [
                {
                    name: 'B.Com.',
                    id: 33,

                },
                {
                    name: 'M.Com.',
                    id: 34,

                },
                {
                    name: 'CA',
                    id: 35,

                },
                {
                    name: 'CFA',
                    id: 36,

                },
                {
                    name: 'CS',
                    id: 37,

                },
                {
                    name: 'ICWA',
                    id: 38,

                },
            ],
        },
        {
            name: 'Law',
            id: 39,

            // these are the children or 'sub items'
            children: [
                {
                    name: 'BL/LLB',
                    id: 40,

                },
                {
                    name: 'ML/LLM',
                    id: 41,

                },
            ],
        },
        {
            name: 'Management',
            id: 42,

            // these are the children or 'sub items'
            children: [
                {
                    name: 'BBA',
                    id: 43,

                },
                {
                    name: 'BHM',
                    id: 44,

                },
                {
                    name: 'MBA/PGDM',
                    id: 45,

                }
            ],
        },

        {
            name: 'Medicine',
            id: 46,

            // these are the children or 'sub items'
            children: [
                {
                    name: 'BAMS',
                    id: 47,

                },
                {
                    name: 'BDS',
                    id: 48,

                },
                {
                    name: 'BHMS',
                    id: 49,

                },
                {
                    name: 'BPT',
                    id: 50,


                },
                {
                    name: 'BVSc.',
                    id: 51,

                },
                {
                    name: 'M.D.',
                    id: 52,

                },
                {
                    name: 'M.S. (Medicine)',
                    id: 53,

                },
                {
                    name: 'MBBS',
                    id: 54,

                },
                {
                    name: 'MCh',
                    id: 55,

                },
                {
                    name: 'MDS',
                    id: 56,

                },
                {
                    name: 'MPT',
                    id: 57,

                },
                {
                    name: 'MVSc.',
                    id: 58,

                }
            ],
        },
        {
            name: 'Non-Graduate',
            id: 59,

            // these are the children or 'sub items'
            children: [
                {
                    name: 'Diploma',
                    id: 60,

                },

                {
                    name: 'High School',
                    id: 61,

                }
            ],
        },
        {
            name: 'Other',
            id: 62,

            // these are the children or 'sub items'
            children: [
                {
                    name: 'Order Diploma/Degree',
                    id: 63,

                },
            ],
        },

    ];

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


    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        alert("You have entered an invalid email address!")
        return (false)
    }

    const handleProfileUpdate = async () => {
        try {
            setIsLoading(true)
            if (!ValidateEmail(email)) {
                setIsLoading(false)
                alert("Please enter a valid email")
            }
            else {

                let tempArr=[]
                if(selectedQulifications?.length>0){

                    selectedQulifications.forEach(el=>{
                        items.forEach(elx=>{
                            let index=elx.children.findIndex(elz=>elz.id==el)
                            if(index!=-1){
                                tempArr.push({name:elx.children[index].name,id:el})
                            }
                        })
                    })
                }
                let obj = {
                    name,
                    email,
                    phone: mobile,
                    gender: genderIsSelected ? "Male" : "Female",
                    enquiryObj: { ...profileData.enquiryObj, educationObj: { degree }, areaId: selectedAreaId, cityId: selectedCityId, stateId: selectedStateId, qualificationArr: tempArr }
                }
                console.log(tempArr)
                let { data: res, status: statusCode } = await updateProfile(obj)
                if (statusCode == 200 || statusCode == 304) {
                    console.log(res.message)
                    getUserData()
                    setSuccessAlert(true)
                    setAlertText(`${res.message}`)
                    // alert(res.message)
                    props.navigation.goBack()
                    setIsLoading(false)
                }
                console.log(res)
            }
        }
        catch (err) {
            setIsLoading(false)
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
                setSelectedAreaId(res?.data?.enquiryObj?.areaId ? res?.data?.enquiryObj?.areaId : "")
                setSelectedCityId(res?.data?.enquiryObj?.cityId ? res?.data?.enquiryObj?.cityId : "")

                setSelectedStateId(res?.data?.enquiryObj?.stateId ? res?.data?.enquiryObj?.stateId : "")

                setDegree(res?.data?.enquiryObj?.educationObj?.degree)
                setGenderIsMale(res?.data?.enquiryObj?.gender == "Male" ? true : false)
                setRoleName(res.data.role)

                // let tempArr=res?.data?.enquiryObj?.qualificationArr;
                // tempArr=tempArr.map(el=>{
                //     let temp=items.find(elx=>elx.children.find)
                // })

                setSelectedQulifications(res?.data?.enquiryObj?.qualificationArr.map(el=>el.id))
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
        else if (field == "minFees") {
            setProfileData(prevState => {
                prevState.enquiryObj.feesObj.minFees = val;
                return { ...prevState }
            })
        }
        else if (field == "maxFees") {
            setProfileData(prevState => {
                prevState.enquiryObj.feesObj.maxFees = val;
                return { ...prevState }
            })
        }
        else if (field == "degree") {
            setProfileData(prevState => {
                prevState.enquiryObj.educationObj.degree = val;
                return { ...prevState }
            })
        }
    }

    const getStates = async () => {
        try {
            const { data: res } = await getAllStates();
            if (res.success) {
                let tempArr = res.data.map(el => ({ ...el, name: `${el.name.charAt(0)}`.toUpperCase() + el.name.slice(1).toLowerCase() }))
                setStateArr(tempArr)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getCity = async (stateId) => {
        try {
            const { data: res } = await getByStateId(stateId);
            console.log(res.data)
            if (res.success) {
                setCityArr(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const getArea = async (cityId) => {
        try {
            const { data: res } = await getByCityId(cityId);
            if (res.success) {
                setAreaArr(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const onSelectedItemsChange = (value) => {
        console.log(value[0])
        setSelectedQulifications(value)
        console.log(selectedQulifications, "@@@@@@@@@@@@")
        console.log(value)
    }

    useEffect(() => {
        getUserData()
        getStates()
    }, [focused])




    return (
        <>
            <NavBar rootProps={props} />
            <ScrollView style={styles.container}>
                <View>

                    <ImageBackground source={imageObj.teacherBackBanner} style={styles.topContainer}>

                    </ImageBackground>
                    <Pressable onPress={() => pickImageProfilePhoto()} style={styles.circleImg}>
                        {
                            profilePhoto != "" && profilePhoto ?
                                <Image style={styles.profileImage} source={{ uri: generateImageUrl(profilePhoto) }} />
                                :
                                <Image style={styles.profileImage} source={require("../../assets/images/user.png")} />
                        }

                        <Image style={{ height: 30, width: 30, position: "absolute", bottom: 0, right: 0 }} source={require("../../assets/images/camera.png")} />
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
                    <TextInput value={mobile} editable={false} keyboardType="numeric" onChangeText={(e) => setMobile(e)} style={[styles.txtInput, { color: "grey" }]} placeholder="Enter your phone" />
                    {
                        roleName == "TEACHER" &&
                        <>
                            {/* <Text style={styles.label}>
                                Location
                            </Text>
                            <TextInput value={profileData?.enquiryObj?.address} onChangeText={(e) => handleProfileDataUpdate(e, "address")} style={styles.txtInput} placeholder="Enter your address" /> */}

                            <Text style={styles.label}>State</Text>
                            <Picker
                                style={[styles.textInput]}
                                selectedValue={selectedStateId}
                                onValueChange={(itemValue, itemIndex) => {

                                    if (itemValue != "") {
                                        setSelectedStateId(itemValue)
                                        getCity(itemValue)
                                    }
                                    else {
                                        setSelectedStateId('')
                                        setCityArr([])
                                        setAreaArr([])
                                    }
                                }
                                }>
                                <Picker value="" label="Please Select State" />
                                {

                                    stateArr.map(el => {
                                        return (
                                            <Picker.Item key={el._id} label={el.name} value={el._id} />
                                        )

                                    })
                                }
                            </Picker>
                            {
                                cityArr.length > 0 &&
                                <>
                                    <Text style={styles.label}>City</Text>
                                    <Picker
                                        style={[styles.textInput]}
                                        selectedValue={selectedCityId}
                                        onValueChange={(itemValue, itemIndex) => {

                                            if (itemValue != "") {
                                                setSelectedCityId(itemValue)
                                                getArea(itemValue)

                                            }
                                            else {
                                                setSelectedCityId('')
                                                setAreaArr([])
                                            }
                                        }
                                        }>
                                        <Picker value="" label="Please Select City" />
                                        {

                                            cityArr.map(el => {
                                                return (
                                                    <Picker.Item key={el._id} label={el.name} value={el._id} />
                                                )

                                            })
                                        }
                                    </Picker>
                                </>
                            }
                            {areaArr.length > 0 &&
                                <>
                                    <Text style={styles.label}>Region</Text>
                                    <Picker
                                        style={[styles.textInput, { fontFamily: 'Montserrat-Regular' }]}
                                        selectedValue={selectedAreaId}
                                        onValueChange={(itemValue, itemIndex) => {

                                            if (itemValue != "") {
                                                setSelectedAreaId(itemValue)
                                            }
                                            else {
                                                setSelectedAreaId('')
                                            }
                                        }
                                        }>
                                        <Picker style={{ fontFamily: 'Montserrat-Regular' }} value="" label="Please Select Area" />
                                        {

                                            areaArr.map(el => {
                                                return (
                                                    <Picker.Item key={el._id} label={el.name} value={el._id} />
                                                )

                                            })
                                        }
                                    </Picker>
                                </>
                            }

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
                                Fees Range (In Rupees)
                            </Text>
                            <View style={[styles.flexRow, { alignItems: 'center' }]}>
                                <TextInput value={`${profileData?.enquiryObj?.feesObj?.minFees}`} keyboardType="numeric" onChangeText={(e) => handleProfileDataUpdate(e, "minFees")} style={[styles.txtInput, { width: wp(40) }]} placeholder="Min" />
                                <Icon name="remove-outline" size={20} color="black" />
                                <TextInput value={`${profileData?.enquiryObj?.feesObj?.maxFees}`} keyboardType="numeric" onChangeText={(e) => handleProfileDataUpdate(e, "maxFees")} style={[styles.txtInput, { width: wp(40) }]} placeholder="Max" />

                            </View>
                            <Text style={styles.label}>
                                Qualification
                            </Text>
                            {/* <TextInput value={degree} onChangeText={(e) => setDegree(e)} style={styles.txtInput} placeholder="Your Qualification" /> */}
                            <SectionedMultiSelect
                                items={items}
                                IconRenderer={MatIcon}
                                uniqueKey="id"
                                subKey="children"
                                searchPlaceholderText={"Search Qualifications..."}
                                searchTextFontFamily={{ fontFamily: "Montserrat-Medium" }}
                                confirmFontFamily={{ fontFamily: "Montserrat-SemiBold" }}
                                selectText="Choose Your Qualifications..."
                                showDropDowns={true}

                                itemFontFamily={{ fontFamily: 'Montserrat-SemiBold' }}
                                subItemFontFamily={{ fontFamily: "Montserrat-Regular" }}
                                // subItemFontFamily={"Montserrat"}
                                showChips={true}
                                styles={{ selectToggleText: { fontFamily: 'Montserrat-Regular', fontSize: 14 }, selectToggle: { borderBottomColor: "rgba(0,0,0,0.1)", borderBottomWidth: 2, paddingVertical: 10, paddingHorizontal: 10 }, button: [styles.btn, { flex: 1, marginHorizontal: wp(28) }], confirmText: [styles.btnTxt], itemText: { fontFamily: 'Montserrat-Regular' }, chipContainer: { backgroundColor: '#E0E0E0', borderRadius: 5, borderWidth: 0 }, chipText: { fontFamily: 'Montserrat-Regular' } }}
                                readOnlyHeadings={true}
                                onSelectedItemsChange={onSelectedItemsChange}
                                selectedItems={selectedQulifications}
                            />
                            <Text style={styles.label}>
                                Teaching Experience
                            </Text>
                            <TextInput value={profileData?.enquiryObj?.experience} onChangeText={(e) => handleProfileDataUpdate(e, "experience")} style={styles.txtInput} keyboardType="number-pad" placeholder="Your Teaching Experience (in years)" />

                            <Text style={styles.label}>
                                Facebook profile link
                            </Text>
                            <TextInput value={profileData?.enquiryObj?.facebookLink} onChangeText={(e) => handleProfileDataUpdate(e, "facebookLink")} style={styles.txtInput} placeholder="Facebook profile link" />

                            <Text style={styles.label}>
                                Youtube Channel link
                            </Text>
                            <TextInput value={profileData?.enquiryObj?.youtubeLink} onChangeText={(e) => handleProfileDataUpdate(e, "youtubeLink")} style={styles.txtInput} placeholder="Youtube channel link" />

                            <Text style={styles.label}>
                                Instagram username
                            </Text>
                            <TextInput value={profileData?.enquiryObj?.instagramLink} onChangeText={(e) => handleProfileDataUpdate(e, "instagramLink")} style={styles.txtInput} placeholder="Instagram username" />
                        </>

                    }
                    <Pressable style={styles.btn} onPress={() => handleProfileUpdate()}>
                        <Text style={styles.btnTxt}>Save</Text>
                    </Pressable>
                </View>

            </ScrollView>

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
        alignSelf: 'center',
        backgroundColor: 'white'
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
