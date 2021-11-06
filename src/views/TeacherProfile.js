import React, { useCallback, useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ImageBackground, TouchableHighlight } from 'react-native';
import NavBar from '../components/Navbar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { colorObj } from '../globals/colors';
import RBSheet from "react-native-raw-bottom-sheet";
import { RadioButton } from 'react-native-paper';

import Swipeable from 'react-native-swipeable';
export default function TeacherProfile(props) {

    const refRBSheet = useRef();

    const [checked, setChecked] = useState('specific');
    const leftContent = () => {
        return (
            <Pressable style={styles.btn} >
                <Text style={styles.btnTxt}>Enquire</Text>
            </Pressable>
        )
    };


    return (
        <>
            <NavBar rootProps={props} />
            <ImageBackground resizeMode="cover" source={require('../../assets/images/teacherBackBanner.png')} style={{ width: wp(100), height: hp(15) }}>

                <View style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', width: wp(25), position: 'absolute', bottom: 10, right: 20 }]}>
                    <Icon name="logo-instagram" size={25} color={colorObj.whiteColor} />
                    <Icon name="logo-facebook" size={25} color={colorObj.whiteColor} />
                    <Icon name="logo-youtube" size={25} color={colorObj.whiteColor} />
                </View>

            </ImageBackground>
            <View style={[styles.flexRow, { width: wp(90), alignSelf: "center", justifyContent: 'space-between' }]}>
                <Image source={require('../../assets/images/user.png')} style={{ width: 100, height: 100, position: "relative", top: -40, }} resizeMode="cover" />

                <Pressable style={styles.btn} onPress={() => refRBSheet.current.open()}>
                    <Text style={styles.btnTxt}>Enquire</Text>
                </Pressable>
            </View>
            <View style={[styles.flexRow, { marginLeft: 15, marginTop: -10, alignItems: 'center' }]}>
                <Text style={styles.TeacherName}>Annie Besant</Text>
                <View style={[styles.flexRow, { alignItems: 'center', paddingHorizontal: 20 }]}>
                    <Text style={{ fontFamily: 'RedHatText-Medium', fontSize: 12, color: '#828282' }}>4.2</Text>
                    <Icon name="star" style={{ marginHorizontal: 3 }} size={15} color="orange" />
                </View>
            </View>
            <View style={[styles.flexRow, { width: wp(90), alignSelf: "center", marginVertical: 10 }]}>
                <View style={[styles.flexRow, { width: "33%" }]}>
                    <Image source={require("../../assets/images/office.png")} />
                    <Text style={styles.smallTxt}>Mayo Clinic</Text>
                </View>
                <View style={[styles.flexRow, { width: "33%" }]}>
                    <Image source={require("../../assets/images/medal.png")} />
                    <Text style={styles.smallTxt}>MBBS, MD</Text>

                </View>
                <View style={[styles.flexRow, { width: "33%" }]}>
                    <Image source={require("../../assets/images/time.png")} />
                    <Text style={styles.smallTxt}>10 year experience</Text>
                </View>
            </View>


            <View style={[styles.flexColumn, { width: wp(90), alignSelf: "center", marginTop: 20, }]}>
                <Text style={styles.description}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis ducimus quasi quis. Qui, neque fugit </Text>
            </View>

            {/* <Swipeable leftActionActivationDistance={10} onLeftActionRelease={() => alert("Enquired")} leftContent={leftContent}>
                <Text>Enquire Now</Text>
            </Swipeable> */}


            {/* bottom  sheet */}
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                animationType="slide"
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,0.5)",
                    },
                    container: {
                        height: hp(30)
                    },
                    draggableIcon: {
                        backgroundColor: "#000"
                    }
                }}
            >
                <View style={styles.bottomSheetInnerContainer}>

                    <Text style={styles.bottomSheetHeading}>Enquiry Options</Text>
                    <Pressable onPress={() => setChecked('specific')} style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', width: wp(90) }]}>
                        <Text style={styles.bottomSheetOptionText}>Specific Enquriy</Text>
                        <RadioButton
                            value="specific"
                            color={colorObj.primarColor}
                            status={checked == 'specific' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('specific')}
                        />

                    </Pressable>
                    <Pressable onPress={() => setChecked('slot')} style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', width: wp(90) }]}>
                        <Text style={styles.bottomSheetOptionText}>Slot Booking</Text>
                        <RadioButton
                            value="slot"
                            color={colorObj.primarColor}

                            status={checked === 'slot' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('slot')}
                        />
                    </Pressable>
                    <Pressable onPress={() => setChecked('connect')} style={[styles.flexRow, { alignItems: 'center', justifyContent: 'space-between', width: wp(90) }]}>
                        <Text style={styles.bottomSheetOptionText}>Connect Now</Text>
                        <RadioButton
                            value="connect"
                            color={colorObj.primarColor}
                            status={checked === 'connect' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('connect')}
                        />
                    </Pressable>


                    <Pressable style={styles.btn} onPress={() => refRBSheet.current.close()}>
                        <Text style={styles.btnTxt}>Enquire</Text>
                    </Pressable>
                </View>
            </RBSheet>


        </>
    )
}
const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
    TeacherName: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
        color: colorObj.primarColor,
        // marginTop: 15
    },
    smallTxt: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: "black",
        marginLeft: 5
    },
    description: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 13,
        color: "black",
        lineHeight: 20,
        marginTop: 8,
        marginBottom: 8,
    },
    btnTxt: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 13,
        color: "white",
        // marginTop: 15
    },

    heading: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        color: "black",
    },

    btn: {
        backgroundColor: colorObj.primarColor,
        borderRadius: 50,
        // width: wp(20),
        paddingHorizontal: 25,
        height: 40,
        // paddingVertical: 10,
        marginVertical: 10,
        marginLeft: 40,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },




    ////bottom sheet 
    bottomSheetHeading: {
        color: '#333333',
        fontFamily: 'Montserrat-Medium',
        fontSize: 18,
        marginVertical: 10

    },
    bottomSheetInnerContainer: {
        width: wp(90),
        paddingHorizontal: 20
    },
    bottomSheetOptionText: {
        color: '#333333',
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        marginVertical: 10
    }


})