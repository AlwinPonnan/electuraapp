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
    const [isLoading, setIsLoading] = useState(loadingContext);

    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr

    const [teacherObj, setTeacherObj] = useState({});

    const [alertText, setAlertText] = alertTextArr

    const focused = useIsFocused()

    const [allSlotArr, setAllSlotArr] = useState([]);

    const [slotsToggle, setSlotsToggle] = useState('all');

    const handleOnint = () => {
        getTeacher()
    }



    const getTeacher = async () => {
        setIsLoading(true)
        try {
            let decodedTokenObj = await getDecodedToken();
            const { data: res } = await getById(decodedTokenObj.userId)
            console.log(JSON.stringify(res.data.enquiryObj, null, 2), "teacher data")
            if (res.success) {
                let tempTimeSlotsArr = getSlotArr();
                // if(res.data.enquiryObj)
                tempTimeSlotsArr = tempTimeSlotsArr.map((el, i) => {
                    let obj = {
                        day: el.day,
                        slotsArr: el.slotsArr.map(ely => {
                            let innerObj = {
                                ...ely,
                                checked:res?.data?.enquiryObj?.timeslots?.length && res?.data?.enquiryObj?.timeslots[i]?.slotArr?.some(elz => elz.time == ely.time)
                            }
                            return innerObj
                        })

                    }
                    return obj
                })
                setSlotsArr([...tempTimeSlotsArr])
                setTeacherObj(res.data)
                setAllSlotArr([{
                    day:"All Days",
                    slotsArr: [...tempTimeSlotsArr[0].slotsArr.map(el => {
                        let obj = {
                            ...el,
                            checked: res?.data?.enquiryObj?.timeslots?.length && res?.data?.enquiryObj?.timeslots.every(elx=>elx?.slotArr?.some(elz => elz.time == el.time)),
                        }
                        return obj
                    })]
                }])
            }
        } catch (error) {
            console.error(error)
        }
        setIsLoading(false)
    }
    const handleSlotSelection = (index1, index2, value) => {
        console.log(index1)
        console.log(index2)
        if(slotsToggle == "all"){
            let tempArr = allSlotArr.map((el, index) => {
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
            setAllSlotArr(tempArr);
            let tempDailyArr = slotsArr.map((el,index)=> {
                el.slotsArr.map((ele,indexX)=> {
                    if(indexX == index2){
                        ele.checked = value
                        return ele
                    }
                    else{
                       return ele
                    }
                })
                return el
            })
            console.log(JSON.stringify(tempDailyArr, null, 2), "all days arr")
            setSlotsArr(tempDailyArr)
        }
        else{
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
    }

    // const handleAllSlotSelection = (index) => {

    //     setAllSlotArr(prevState => {
    //         prevState[index].checked = !prevState[index].checked
    //         return [...prevState]
    //     })
    // }



    const handleSubmit = async () => {
        setIsLoading(true)
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
                props.navigation.goBack()
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
        setIsLoading(false)
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
                                {

                                    slotsToggle == "all"
                                        ?
                                        <Text style={styles.textCardMainHeading}>
                                            All Days
                                        </Text>
                                        :
                                        <Text style={styles.textCardMainHeading}>
                                            {item?.day}
                                        </Text>
                                }
                            </>
                        }
                        scrollEnabled={false}
                        keyExtractor={(itemX, indexX) => indexX}
                        numColumns={3}
                        renderItem={(itemX, indexX) => {
                            return (
                                <>
                                    <Pressable onPress={() => handleSlotSelection(index, itemX.index,!itemX?.item?.checked )} style={[styles.slotItem, { backgroundColor: itemX?.item?.checked ? colorObj.primarColor : "white" }]}>
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
    // const renderAllSlots = ({ item, index }) => {
    //     return (
    //         <View style={[styles.slotContainer, { width: wp(30, ali) }]}>


    //             <Pressable onPress={() => handleAllSlotSelection(index)} style={[styles.slotItem, { backgroundColor: item?.checked ? colorObj.primarColor : "white" }]}>
    //                 <Text style={item?.checked ? styles.slotItemCheckedText : styles.slotItemText} >
    //                     {item?.time}
    //                 </Text>
    //             </Pressable>


    //         </View>
    //     )
    // }

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
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingVertical: 15 }}>
                        <Pressable onPress={() => { setSlotsToggle('individual') }} style={[styles.categoryContainer, slotsToggle != 'individual' && { backgroundColor: '#f0faf9' }]}>
                            {/* <Icon name="film-outline" size={14} /> */}
                            <Text style={[styles.categoryName, slotsToggle != "individual" && { color: '#000' }]}>Individual</Text>
                        </Pressable>
                        <Pressable onPress={() => { setSlotsToggle('all') }} style={[styles.categoryContainer, slotsToggle != 'all' && { backgroundColor: '#f0faf9' }]}>
                            {/* <Icon name="film-outline" size={14} /> */}
                            <Text style={[styles.categoryName, slotsToggle != "all" && { color: '#000' }]}>All</Text>
                        </Pressable>
                    </View>
                </>

                <FlatList
                    data={slotsToggle == "individual" ? slotsArr : allSlotArr}
                    scrollEnabled={true}
                    contentContainerStyle={{ paddingTop: 10, paddingBottom: 250 }}
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

    ///
    categoryContainer: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 26,
        paddingVertical: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },

    categoryName: {
        color: colorObj.whiteColor,
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
        paddingHorizontal: 20
    },
})
