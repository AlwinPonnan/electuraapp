import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable, Appearance, TextInput, ScrollView } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from "react-native-vector-icons/Ionicons"
import { dark_colors, light_colors } from '../globals/colors';
export default function AccountEdit() {
    const [QualificationArr, setQualificationArr] = useState([]);

    const [name, setName] = useState("John Emanuel");
    const [email, setEmail] = useState("electura@electura.com");
    const [mobile, setMobile] = useState("9919291919");


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.innerContainer}>


                <View style={styles.profileImageContainer}>
                    <Image style={styles.profileImage} source={require("../assets/images/user.jpg")} />
                    <TouchableOpacity style={styles.PickImageBtn}>
                        <Icon name="camera-outline" size={30} color={"#798FF8"} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>
                    Name
                </Text>
                <TextInput value={name} style={styles.txtInput} placeholder="Name" />
                <Text style={styles.label}>
                    Email
                </Text>
                <TextInput value={email} style={styles.txtInput} placeholder="Email" />
                <Text style={styles.label}>
                    Phone
                </Text>
                <TextInput value={mobile} style={styles.txtInput} placeholder="Phone" />

                <Text style={styles.label}>
                    Id Proof
                </Text>
                <View style={[styles.txtInput, { justifyContent: "space-between", display: "flex", flexDirection: "row", alignItems: "center", paddingHorizontal: 15, height: 45, }]} placeholder="Phone">
                    <Text>Please upload an Id proof</Text>
                    <Icon name="camera-outline" size={30} color={"#798FF8"} />
                </View>
                <View style={[styles.flexRow, { justifyContent: "space-between", alignItems: "center", marginTop: 20 }]}>
                    <Text style={styles.label}>
                        Qualifications
                    </Text>
                    <TouchableOpacity style={styles.AddBtn}>
                        <Icon name="ios-add-outline" size={30} color={"#798FF8"} />
                    </TouchableOpacity>
                </View>
                <TextInput style={styles.txtInput} placeholder="name" />


                <Pressable style={styles.btn}>
                    <Text style={styles.btnTxt}>Update Profile</Text>
                </Pressable>


            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        display: "flex",
        height: hp(85),
        backgroundColor: "white"
    },
    innerContainer: {
        width: wp(80),
        display: "flex",
        justifyContent: "center",
        paddingTop: 30,
        alignSelf: "center",
        paddingBottom: 50,
    },
    profileImageContainer: {
        height: 130,
        width: 130,
        borderRadius: 150,
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: Appearance.getColorScheme() == 'dark' ? dark_colors.primary : light_colors.primary,
    },


    ///////txt

    label: {
        fontFamily: 'OpenSans-SemiBold',
        color: "black",
        fontSize: 14,
        marginBottom: 8,
        color: "grey",
        paddingLeft: 5,
        marginTop: 30,
        // paddingTop: 15,
        textTransform: "capitalize",
    },
    btnTxt: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: "grey",
        paddingLeft: 5,
        // paddingTop: 15,
        textTransform: "capitalize",
        color: "white"
    },

    ////image
    profileImage: {
        height: "95%",
        width: "95%",
        borderRadius: 150,
    },



    //////txtinput
    txtInput: {
        borderColor: "rgba(0,0,0,0.1)",
        borderWidth: 2,
        borderRadius: 7,
        paddingLeft: 20,
        backgroundColor: "#F1F3FD",

    },

    //////btn
    becomeATeacherBtn: {
        backgroundColor: "#F6F5F8",
        width: wp(50),
        marginTop: hp(2),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        height: 45,
        borderRadius: 10
    },
    PickImageBtn: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#E3E7FD",
        padding: 5,
        borderRadius: 8,
    },
    AddBtn: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E3E7FD",
        height: 30,
        borderRadius: 8,
    },
    btn: {
        backgroundColor: "#363D4D",
        borderRadius: 8,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
        paddingVertical: 10,
    },



    //////flex
    flexRow: {
        display: "flex",
        flexDirection: "row",
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
    },
})
