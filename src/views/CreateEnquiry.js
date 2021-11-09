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

export default function CreateEnquiry(props) {




    const focused = useIsFocused()
    const [ClassType, setClassType] = useState("Immediately");
    const [gender, setGender] = useState("Male");
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



    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr





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

    }

    const getClassBySubjectId = async (id) => {
        const { data: res } = await getBySubjectId(id);
        if (res.success) {
            console.log(res.data)
            setClassArr(res.data)
        }
    }

    const handleClassSelection = async (id) => {
        setSelectedClassId(id)
        console.log("Adsad")
        getTopics(id, selectedSubjectId)
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
    }

    const handleOnint = () => {
        getSubjects()
    }



    const handleEnquirySubmit = async () => {
        try {
            if (selectedClassId != "" && selectedSubjectId != "" && ClassType != "" && price != "" && gender != "") {

                let obj = {
                    classId: selectedClassId,
                    subjectId: selectedSubjectId,
                    topicId: selectedTopicId,
                    region,
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
                {subject != "" &&
                    <View style={styles.ListBackground}>
                        <FlatList
                            data={subjectArr}
                            renderItem={({ item, index }) => {
                                return (
                                    <Pressable onPress={() => { handleSubjectSelection(item) }}>

                                        <Text style={[styles.radioText, { paddingHorizontal: 10, paddingVertical: 4 }]}>{index + 1}. {item.name}</Text>
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
                <Text style={styles.textInputLabel}>Class</Text>
                <Picker
                    style={styles.textInput}
                    selectedValue={selectedClassId}
                    onValueChange={(itemValue, itemIndex) =>
                        handleClassSelection(itemValue)
                    }>
                    {

                        classArr.map(el => {
                            return (

                                <Picker.Item key={el._id} label={el.name} value={el._id} />
                            )

                        })
                    }
                </Picker>

                <Text style={styles.textInputLabel}>Topic</Text>
                <Picker
                    style={styles.textInput}
                    selectedValue={selectedTopicId}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedTopicId(itemValue)
                    }>
                    {

                        topicArr.map(el => {
                            return (

                                <Picker.Item key={el._id} label={el.name} value={el._id} />
                            )

                        })
                    }
                </Picker>

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

                <Text style={styles.textInputLabel}>Region</Text>
                <TextInput style={styles.textInput} onChangeText={(e) => setRegion(e)} />

                <Text style={styles.textInputLabel}>How much you want to pay per hour?</Text>
                <TextInput style={styles.textInput} keyboardType="number-pad" value={price} onChangeText={(e) => setPrice(e)} />

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