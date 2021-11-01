import React,{useState,useEffect} from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'

export default function EnquiryDetail(props) {

    

    return (
        <ScrollView style={styles.mainContainer}>
            <View style={styles.innerContainer}>

                <Text style={styles.contentHeading}>Class</Text>
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
    contentHeading: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16,
    }
})
