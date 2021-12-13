import { useIsFocused } from '@react-navigation/core';
import React, { useState, useEffect,useContext } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, Modal, TextInput } from 'react-native'
import { colorObj } from '../globals/colors';
import { getEnquiryById, sendGeneralEnquiryResponse } from '../Services/Enquiry'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { successAlertContext } from '../../App';
import { loadingContext } from '../navigators/stacks/RootStack';

export default function EnquiryDetail(props) {
    const [loading, setLoading] = useContext(loadingContext);

    const [enquiryObj, setEnquiryObj] = useState({});

    const focused = useIsFocused()

    const [responseMessage, setResponseMessage] = useState('');

    const [responseModal, setResponseModal] = useState(false);


    const { successAlertArr, alertTextArr, warningAlertArr, errorAlertArr } = useContext(successAlertContext)


    const [successAlert, setSuccessAlert] = successAlertArr
    const [warningAlert, setWarningAlert] = warningAlertArr
    const [errorAlert, setErrorAlert] = errorAlertArr


    const [alertText, setAlertText] = alertTextArr
    const getSpecificEnquiry = async () => {
        try {
            let enquiryId = props.route.params.enquiryId
            const { data: res } = await getEnquiryById(enquiryId);
            if (res.success) {
                setEnquiryObj(res.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async () => {
        setResponseModal(false)

        setLoading(true)
        try {
            
            let obj = {
                enquiryId: enquiryObj?._id,
                message: responseMessage
            }
            const { data: res } = await sendGeneralEnquiryResponse(obj);
            if (res.success) {
                setAlertText(res.message)
                setSuccessAlert(true)
                setResponseMessage("")
                props.navigation.goBack()
                
            }
        } catch (error) {
            setErrorAlert(true)
            console.log(error.response.data.message)
            if(error?.response?.data?.message)
            {
                setResponseMessage("")
                setAlertText(`${error.response.data.message}`)
            }
            else{
                setResponseMessage("")
                setAlertText(`Could not respond`)
            }

        }
        setLoading(false)
    }


    const handleOninit = () => {
        getSpecificEnquiry()
    }

    useEffect(() => {
        handleOninit()
    }, [focused])

    return (
        <ScrollView style={styles.mainContainer}>
            <View style={styles.innerContainer}>

                <Text style={styles.contentHeading}>Name</Text>
                <Text style={styles.contentText}>{enquiryObj?.userObj?.name}</Text>

                <Text style={styles.contentHeading}>Class</Text>
                <Text style={styles.contentText}>{enquiryObj?.className}</Text>

                <Text style={styles.contentHeading}>Subject</Text>
                <Text style={styles.contentText}>{enquiryObj?.subjectName}</Text>


                <Text style={styles.contentHeading}>Topic</Text>
                <Text style={styles.contentText}>{enquiryObj?.topicName}</Text>

                <Text style={styles.contentHeading}>Gender Preference</Text>
                <Text style={styles.contentText}>{enquiryObj?.gender}</Text>

                <Text style={styles.contentHeading}>How much he will pay per hour ?</Text>
                <Text style={styles.contentText}>₹ {enquiryObj?.price}</Text>


                <Text style={styles.contentHeading}>Region</Text>
                <Text style={styles.contentText}>{enquiryObj?.region}</Text>

                <Text style={styles.contentHeading}>Specific Requirement</Text>
                <Text style={styles.contentText}>{enquiryObj?.specificRequirement}</Text>


                <Text style={styles.contentHeading}>Prefered Teaching Mode</Text>
                <Text style={styles.contentText}>{enquiryObj?.teachingMode}</Text>


                <Text style={styles.contentHeading}>Class Starts  </Text>
                <Text style={styles.contentText}>{enquiryObj?.ClassType}</Text>


                <Text style={styles.contentHeading}>Enquiry Type  </Text>
                <Text style={styles.contentText}>{enquiryObj?.enquiryType}</Text>


                <Text style={styles.contentHeading}>Enquiry Status  </Text>
                <Text style={styles.contentText}>{enquiryObj?.enquiryStatus}</Text>

                <Pressable style={styles.submitBtn} onPress={() => setResponseModal(true)}>
                    <Text style={styles.submitBtnText}>Respond</Text>
                </Pressable>

            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={responseModal}
                onRequestClose={() => {
                    setResponseModal(false);
                }}
            >
                <Pressable style={styles.centeredView} onPress={()=>setResponseModal(false)}>
                    <Pressable style={styles.modalView}>
                        <Text style={styles.responseModalHeading}>Enquiry Response</Text>
                        <Text style={[styles.textInputLabel, { marginTop: 10 }]}>Message</Text>
                        <TextInput style={[styles.textInput]} value={responseMessage} onChangeText={(e) => setResponseMessage(e)} />
                        <Pressable style={styles.submitBtn} onPress={() => handleSubmit()}>
                            <Text style={styles.submitBtnText}>Respond</Text>
                        </Pressable>

                    </Pressable>
                </Pressable>
            </Modal>
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
    contentHeading: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        marginVertical: 4
    },
    contentText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
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
    },

    responseModalHeading: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginVertical: 10
    },

    //text input styles
    textInputLabel: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
        color: '#000'
    },
    textInput: {
        backgroundColor: '#F5F6FA',
        borderRadius: 5,
        marginVertical: 10,
        width: '100%',
        fontFamily: 'OpenSans-Regular'

    },


    //modal styles

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.6)'

    },
    modalView: {
        margin: 20,
        width: wp(80),
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
})
