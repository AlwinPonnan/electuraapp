import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, FlatList, StyleSheet, Pressable } from 'react-native'
import NavBar from '../components/Navbar'
import { colorObj } from '../globals/colors'
import { getSlotArr } from '../globals/utils';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function TeacherSlots(props) {
    const [slotsArr, setSlotsArr] = useState([]);

    useEffect(() => {
        let tempArr = getSlotArr()
        if (tempArr.length > 0) {
            setSlotsArr(tempArr)
        }
        console.log(JSON.stringify(tempArr, null, 2), "tempArr")
    }, [])


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

    const renderSlots = ({ item, index }) => {
        return (
            <View style={styles.slotContainer}>
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
            </View>
        )
    }

    return (
        <>
            <NavBar rootProps={props} />
            <FlatList
                data={slotsArr}
                scrollEnabled={true}
                contentContainerStyle={{ paddingTop: 10, paddingBottom:60 }}
                ListHeaderComponent={
                    <>
                        <Text style={[styles.textCardMainHeading, { marginLeft: 10, fontSize: 20, marginBottom: 10 }]}>
                            Select Slots
                        </Text>
                    </>
                }
                keyExtractor={(item, index) => index}
                renderItem={renderSlots}
            />
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
        marginVertical:10
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
