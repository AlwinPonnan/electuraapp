import React from 'react'
import { View, Text, StyleSheet, Image, TextInput, Pressable } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Contact() {
    return (
        <View>
            <View style={styles.flexRow}>
                <View style={styles.flexColumn}>
                    <Text style={styles.headingText}>Help Center</Text>
                    <Text style={styles.greyText}>
                        Please get in touch with team Electura and we’ll be happy to help you.
                    </Text>
                </View>

                <Image style={{ height: hp(20), flex: 1 }} resizeMode='contain' source={require('../../assets/images/contact.png')} />
            </View>
            <View style={styles.flexRow}>

            </View>
            <View style={[styles.flexColumn, { backgroundColor: "green" }]}>
                <Text>
                    Send Feedback
                </Text>
                <Text>
                    Are you facing any issues? Report a bug? Suggest a new feature? Let us know. We’ll get back to you at earliest.
                </Text>
                <TextInput />
                <Pressable>
                    <Text>
                        Submit
                    </Text>
                </Pressable>

            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    flexRowAlignCenter: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
        // backgroundColor: "red",
        flex: 0.6
    },
    headingText: {
        fontFamily: 'RedHatText-SemiBold',
        fontSize: 16
    },
    greyText: {
        fontFamily: 'RedHatText-SemiBold',
        fontSize: 10,
        color: "#828282",
    },

})