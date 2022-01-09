import React from 'react'
import { View, Text, StyleSheet, Image, TextInput, Pressable } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icons from "react-native-vector-icons/FontAwesome";
import IconsFoundation from "react-native-vector-icons/Foundation";
import IconsFeather from "react-native-vector-icons/Feather";
export default function Contact() {
    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={styles.container}>

                <View style={styles.flexRow}>
                    <View style={styles.flexColumn}>
                        <Text style={styles.headingText}>Help Center</Text>
                        <Text style={styles.greyText}>
                            Please get in touch with team Electura and we’ll be happy to help you.
                        </Text>
                        <View style={[styles.flexRow, { marginTop: 20 }]}>
                            <View style={styles.circle}>
                                <Icons color="#E517DD" name="instagram" size={15} />
                            </View>
                            <View style={styles.circle}>
                                <Icons color="#64D315" name="whatsapp" size={15} />
                            </View>
                            <View style={styles.circle}>
                                <Icons color="#6747ED" name="linkedin" size={15} />
                            </View>
                            <View style={styles.circle}>
                                <IconsFeather color="#FF900E" name="mail" size={15} />
                            </View>
                            <View style={styles.circle}>
                                <Icons color="#0085FF" name="facebook" size={15} />
                            </View>
                            <View style={styles.circle}>
                                <IconsFoundation color="#085A4E" name="web" size={15} />
                            </View>
                        </View>
                    </View>

                    <Image style={{ height: hp(17), flex: 0.6 }} resizeMode='contain' source={require('../../assets/images/contact.png')} />
                </View>
                <View style={{ height: 5, width: wp(100), backgroundColor: "#F5F6FA", position: "relative", left: wp(-5) }}></View>
                <View style={[styles.flexColumn, { marginTop: 40 }]}>
                    <Text style={[styles.headingText, { fontSize: 16 }]}>
                        Send Feedback
                    </Text>
                    <Text style={styles.greyText}>
                        Are you facing any issues? Report a bug? Suggest a new feature? Let us know. We’ll get back to you at earliest.
                    </Text>
                    <TextInput />
                    <Pressable style={styles.submitBtn}>
                        <Text>
                            Submit
                        </Text>
                    </Pressable>

                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: wp(90),
        height: hp(100),
        paddingTop: hp(4),
        alignSelf: "center",
        justifyContent: "center",
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
        flex: 1.2,
    },
    headingText: {
        fontFamily: 'RedHatText-SemiBold',
        fontSize: 18
    },
    circle: {
        backgroundColor: "#F5F6FA",
        height: 30,
        width: 30,
        marginVertical: 8,
        marginRight: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50
    },
    greyText: {
        fontFamily: 'RedHatText-SemiBold',
        fontSize: 12,
        color: "#828282",
        marginTop: 10,
        // width: "90%",
    },

})