import React, { useState, useEffect, useContext } from 'react'
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native'
import NavBar from '../components/Navbar'
import { colorObj } from '../globals/colors'
import { RadioButton } from 'react-native-paper';
import { getAllSubjects } from '../Services/Subjects';
import { useIsFocused } from '@react-navigation/core';
import { FlatList } from 'react-native-gesture-handler';
import { getBySubjectId } from '../Services/Classses';
import { Picker } from '@react-native-picker/picker';
import { getByClassNsubjectId } from '../Services/Topic';
import { NewEnquiry } from '../Services/Enquiry';

import { successAlertContext } from '../../App';

import { loadingContext } from '../navigators/stacks/RootStack';
import { getAllStates } from '../Services/state';
import { getByStateId } from '../Services/city';
import { getByCityId } from '../Services/area';
export default function CreateEnquiry(props) {


    const [isLoading, setIsLoading] = useContext(loadingContext);

    const focused = useIsFocused()
    const [ClassType, setClassType] = useState("Immediately");
    const [gender, setGender] = useState("No Preference");
    const [price, setPrice] = useState('');
    const [region, setRegion] = useState('');
    const [subject, setSubject] = useState('');
    const [specificRequirement, setSpecificRequirement] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [subjectArr, setSubjectArr] = useState([]);
    const [mainSubjectArr, setMainSubjectArr] = useState([]);
    const [classArr, setClassArr] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [topicArr, setTopicArr] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');

    const [subjectStepper, setSubjectStepper] = useState(0);

    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr

    const [stateArr, setStateArr] = useState([]);
    const [cityArr, setCityArr] = useState([]);
    const [areaArr, setAreaArr] = useState([]);

    const [selectedStateId, setSelectedStateId] = useState('');
    const [selectedCityId, setSelectedCityId] = useState('');
    const [selectedAreaId, setSelectedAreaId] = useState('');

    const getSubjects = async () => {
        try {
            const { data: res } = await getAllSubjects();
            if (res.success) {
                setSubjectArr(res.data)
                setMainSubjectArr(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubjectSelection = (item) => {
        setSelectedSubjectId(item._id)
        getClassBySubjectId(item._id)
        setSubject(item.name)
        setSubjectStepper(1)

    }

    const getClassBySubjectId = async (id) => {
        const { data: res } = await getBySubjectId(id);
        if (res.success) {
            console.log(res.data)
            setClassArr(res.data)
        }
    }

    const handleClassSelection = async (id) => {
        if (id != "") {

            setSelectedClassId(id)
            console.log("Adsad")
            getTopics(id, selectedSubjectId)
        }
        else {
            setSelectedClassId('')
        }
    }

    const getTopics = async (classId, subjectId) => {
        console.log("getting topic")
        const { data: res } = await getByClassNsubjectId(classId, subjectId);
        if (res.success) {
            console.log(res.data)
            setTopicArr(res.data)
        }
    }

    const handleSubjectFilter = (e) => {
        let tempArr = [...mainSubjectArr]
        tempArr = tempArr.filter(el => el.name.toLowerCase().includes(e.toLowerCase()))
        setSubjectArr([...tempArr])
        setSubject(e)
        setSubjectStepper(0)
    }

    const handleOnint = () => {
        getSubjects()
        getStates()
    }



    const getStates = async () => {
        try {
            const { data: res } = await getAllStates();
            if (res.success) {
                setStateArr(res.data)
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
                setAreaArr([])
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



    const handleEnquirySubmit = async () => {
        setIsLoading(true)
        try {
            if (selectedClassId != "" && selectedSubjectId != "" && ClassType != "" && price != "" && gender != "" ) {

                let obj = {
                    classId: selectedClassId,
                    subjectId: selectedSubjectId,
                    topicId: selectedTopicId,
                    region:selectedAreaId,
                    ClassType,
                    gender,
                    price,
                    specificRequirement
                }
                let { data: res } = await NewEnquiry(obj);
                if (res.success) {
                    setSuccessAlert(true)
                    setAlertText(res.message)
                    // alert(res.message)
                    props.navigation.goBack()
                }
            }
            else {
                setWarningAlert(true)
                setAlertText("Please Fill All the fields")
            }
        } catch (error) {
            console.log(error)
            setErrorAlert(true)
            setAlertText(error.message)

        }
        setIsLoading(false)
    }




    useEffect(() => {
        handleOnint()
    }, [focused])

    return (
        <ScrollView style={styles.mainContainer}>
            <NavBar rootProps={props} />
            <Text style={styles.mainHeading}>General Enquiry</Text>
            <View style={styles.innerContainer}>

                <Text style={styles.textInputLabel}>What do you want to study</Text>
                <TextInput style={styles.textInput} value={subject} onChangeText={(e) => handleSubjectFilter(e)} />
                {(subject != "" && subjectStepper == 0) &&
                    <View style={styles.ListBackground}>
                        <FlatList
                            data={subjectArr}
                            renderItem={({ item, index }) => {
                                return (
                                    <Pressable onPress={() => { handleSubjectSelection(item) }}>

                                        <Text style={[styles.radioText, { paddingHorizontal: 10, paddingVertical: 4 }]}>{item.name}</Text>
                                    </Pressable>
                                )
                            }}
                            keyExtractor={(item, index) => `${item._id}`}
                            ListEmptyComponent={
                                <Text>No Data found</Text>
                            }
                        />
                    </View>
                }
                {
                    classArr.length > 0 &&
                    <>

                        <Text style={styles.textInputLabel}>Which sub-category do you want to study for?</Text>
                        <Picker
                            style={styles.textInput}
                            selectedValue={selectedClassId}
                            onValueChange={(itemValue, itemIndex) =>
                                handleClassSelection(itemValue)
                            }>
                            <Picker label="Please Select Class" value="" />
                            {

                                classArr.map(el => {
                                    return (

                                        <Picker.Item key={el._id} label={el.name} value={el._id} />
                                    )

                                })
                            }
                        </Picker>
                    </>
                }

                {
                    topicArr.length > 0 &&
                    <>


                        <Text style={styles.textInputLabel}>Which topic you want to study?</Text>
                        <Picker
                            style={styles.textInput}
                            selectedValue={selectedTopicId}
                            onValueChange={(itemValue, itemIndex) => {

                                if (itemValue != "") {
                                    setSelectedTopicId(itemValue)
                                }
                                else {
                                    setSelectedTopicId('')
                                }
                            }
                            }>
                            <Picker value="" label="Please Select Topic" />
                            {

                                topicArr.map(el => {
                                    return (

                                        <Picker.Item key={el._id} label={el.name} value={el._id} />
                                    )

                                })
                            }

                        </Picker>
                    </>
                }

                <Text style={styles.textInputLabel}>Any Specific Requirment (optional)</Text>
                <TextInput style={styles.textInput} value={specificRequirement} onChangeText={(e) => setSpecificRequirement(e)} />

                <Text style={styles.textInputLabel}>When do you want your classes to start?</Text>


                <RadioButton.Group onValueChange={newValue => setClassType(newValue)} value={ClassType}>
                    <View style={[{ marginVertical: 10 }]}>

                        <Pressable onPress={() => setClassType("Immediately")} style={[styles.flexRow, { justifyContent: 'space-between' }]}>
                            <Text style={styles.radioText}>1. Immediately</Text>
                            <RadioButton color={colorObj.primarColor} value="Immediately" />
                        </Pressable>
                        <Pressable onPress={() => setClassType("Within a week")} style={[styles.flexRow, { justifyContent: 'space-between' }]}>

                            <Text style={styles.radioText}>2. Within a week</Text>
                            <RadioButton color={colorObj.primarColor} value="Within a week" />
                        </Pressable>
                        <Pressable onPress={() => setClassType("Within a month")} style={[styles.flexRow, { justifyContent: 'space-between' }]}>
                            <Text style={styles.radioText}>3. Within a month</Text>
                            <RadioButton color={colorObj.primarColor} value="Within a month" />
                        </Pressable>
                    </View>
                </RadioButton.Group>

                <Text style={styles.textInputLabel}>State</Text>
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
                        <Text style={styles.textInputLabel}>City</Text>
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
                        <Text style={styles.textInputLabel}>Region</Text>
                        <Picker
                            style={[styles.textInput]}
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
                            <Picker value="" label="Please Select Area" />
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
                {/* <TextInput style={styles.textInput} onChangeText={(e) => setRegion(e)} /> */}

                <Text style={styles.textInputLabel}>How much you want to pay per hour?</Text>
                <TextInput placeholder={"Enter amount in INR"} style={styles.textInput} keyboardType="number-pad" value={price} onChangeText={(e) => setPrice(e)} />

                <Text style={styles.textInputLabel}>Gender preference for teacher</Text>


                <RadioButton.Group onValueChange={newValue => setGender(newValue)} value={gender}>
                    <View style={[{ marginVertical: 10 }, styles.flexRow, { justifyContent: 'space-between' }]}>

                        <Pressable onPress={() => setGender("Male")} style={[styles.flexRow, { justifyContent: 'space-between' }]}>
                            <Text style={styles.radioText}>Male</Text>
                            <RadioButton color={colorObj.primarColor} value="Male" />
                        </Pressable>
                        <Pressable onPress={() => setGender("Female")} style={[styles.flexRow, { justifyContent: 'space-between' }]}>

                            <Text style={styles.radioText}>Female</Text>
                            <RadioButton color={colorObj.primarColor} value="Within a week" />
                        </Pressable>
                        <Pressable onPress={() => setGender("No Preference")} style={[styles.flexRow, { justifyContent: 'space-between' }]}>
                            <Text style={styles.radioText}>No Preference</Text>
                            <RadioButton color={colorObj.primarColor} value="No Preference" />
                        </Pressable>
                    </View>
                </RadioButton.Group>
                <Pressable style={styles.submitBtn} onPress={() => handleEnquirySubmit()}>
                    <Text style={styles.submitBtnText}>Submit Enquiry</Text>
                </Pressable>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
        flex: 1
    },
    innerContainer: {
        paddingHorizontal: 25,
        paddingVertical: 20
    },
    mainHeading: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
        paddingVertical: 20,
        textAlign: 'center'
    },
    textInputLabel: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: '#000'
    },
    textInput: {
        backgroundColor: '#F5F6FA',
        borderRadius: 5,
        marginVertical: 10

    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    radioText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14
    },
    ListBackground: {
        backgroundColor: '#F5F6FA',
        borderRadius: 5,
        marginVertical: 4
    },
    submitBtn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 25,
        marginVertical: 10
    },
    submitBtnText: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: colorObj.whiteColor,
        textAlign: 'center',
        paddingVertical: 10,
    }
})