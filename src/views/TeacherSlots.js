import React, { useEffect, useState, useContext } from 'react'
import { View, Text, ScrollView, FlatList, StyleSheet, Pressable } from 'react-native'
import NavBar from '../components/Navbar'
import { colorObj } from '../globals/colors'
import { getSlotArr } from '../globals/utils';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { loadingContext } from '../navigators/stacks/RootStack';
import { useIsFocused } from '@react-navigation/core';
import { getById, getDecodedToken, updateTeacherSlots } from '../Services/User';
import { successAlertContext } from '../../App';

export default function TeacherSlots(props) {
    const [slotsArr, setSlotsArr] = useState([]);
    const [loading, setLoading] = useState(loadingContext);

    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr

    const [teacherObj, setTeacherObj] = useState({});

    const [alertText, setAlertText] = alertTextArr

    const focused = useIsFocused()

    const handleOnint = () => {
        getTeacher()
    }


    const getTeacher = async () => {
        setLoading(true)
        try {
            let decodedTokenObj = await getDecodedToken();
            const { data: res } = await getById(decodedTokenObj.userId)
            console.log(JSON.stringify(res.data.enquiryObj.facebookLink, null, 2), "teacher data")
            if (res.success) {
                let tempTimeSlotsArr = getSlotArr();
                // if(res.data.enquiryObj)
                tempTimeSlotsArr = tempTimeSlotsArr.map((el, i) => {
                    let obj = {
                        day: el.day,
                        slotsArr: el.slotsArr.map(ely => {
                            let innerObj = {
                                ...ely,
                                checked: res?.data?.enquiryObj?.timeslots[i]?.slotArr?.some(elz => elz.time == ely.time)
                            }
                            return innerObj
                        })

                    }
                    return obj
                })
                setSlotsArr([...tempTimeSlotsArr])
                setTeacherObj(res.data)
            }
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    }
    const handleSlotSelection = (index1, index2) => {
        let tempArr = slotsArr.map((el, index) => {
            if (index1 == index) {
                el.slotsArr.map((ele, indexX) => {
                    if (indexX == index2) {
                        ele.checked = !ele.checked;
                        return ele
                    }
                    else {
                        return ele
                    }
                })
                return el
            }
            else {
                return el
            }
        })
        console.log(JSON.stringify(tempArr, null, 2))
        setSlotsArr(tempArr)
    }



    const handleSubmit = async () => {
        setLoading(true)
        try {
            console.log(slotsArr)
            let tempArr = slotsArr.map(el => {
                let obj = {
                    day: el.day,
                    slotArr: el.slotsArr.filter(ele => ele.checked)
                }
                return obj
            })
            const { data: res } = await updateTeacherSlots({ timeslotArr: tempArr });
            if (res.success) {
                setAlertText(res.message)
                setSuccessAlert(true)
            }
        }
        catch (error) {
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

    useEffect(() => {
        if (focused)
            handleOnint()
    }, [focused])


    const renderSlots = ({ item, index }) => {
        return (
            <View style={styles.slotContainer}>
                {
                    <FlatList
                        data={item.slotsArr}
                        ListHeaderComponent={
                            <>
                                <Text style={styles.textCardMainHeading}>
                                    {item?.day}
                                </Text>
                            </>
                        }
                        scrollEnabled={false}
                        keyExtractor={(itemX, indexX) => indexX}
                        numColumns={3}
                        renderItem={(itemX, indexX) => {
                            return (
                                <>
                                    <Pressable onPress={() => handleSlotSelection(index, itemX.index)} style={[styles.slotItem, { backgroundColor: itemX?.item?.checked ? colorObj.primarColor : "white" }]}>
                                        <Text style={itemX?.item?.checked ? styles.slotItemCheckedText : styles.slotItemText} >
                                            {itemX?.item?.time}
                                        </Text>
                                    </Pressable>
                                </>
                            )
                        }}
                    />
                }
            </View>
        )
    }

    return (
        <>
            <NavBar rootProps={props} />
            <View style={{ backgroundColor: 'white' }}>

                <>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 15 }}>
                        <Text style={[styles.textCardMainHeading, { marginLeft: 10, fontSize: 20, marginBottom: 10 }]}>
                            Select Slots
                        </Text>
                        <Pressable onPress={() => handleSubmit()} style={{ backgroundColor: colorObj.primarColor, alignSelf: "center", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 5, marginRight: 10, paddingHorizontal: 15 }}>
                            <Text style={[styles.textCardMainHeading, { color: "white" }]}>
                                Submit
                            </Text>
                        </Pressable>
                    </View>
                </>
                <FlatList
                    data={slotsArr}
                    scrollEnabled={true}
                    contentContainerStyle={{ paddingTop: 10, paddingBottom: 60 }}

                    ListFooterComponent={
                        <></>
                    }
                    keyExtractor={(item, index) => index}
                    renderItem={renderSlots}
                />
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    slotContainer: {
        width: wp(95),
        display: "flex",
        alignSelf: "center",
    },
    textCardMainHeading: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 14,
        color: '#232323',
        marginVertical: 10
    },
    slotItem: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        borderColor: "rgba(0,0,0,0.2)",
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
        marginVertical: 10
    },
    slotItemText: {
        fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#7E7E7E', marginTop: 2
    },
    slotItemCheckedText: {
        fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#fff', marginTop: 2
    },
    textCardMainSubHeading1: {
        fontFamily: 'Montserrat-Regular', fontSize: 12, color: '#7E7E7E', marginTop: 2
    },
    textCardMainSubHeading2: {
        fontFamily: 'Montserrat-Regular', fontSize: 12, color: colorObj.primarColor, marginTop: 15
    },
})
