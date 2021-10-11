// import React, { useState, useEffect, useContext } from 'react'
// import { View, StyleSheet, Appearance, Pressable, Image, ScrollView, TextInput } from 'react-native'
// import LinearGradient from 'react-native-linear-gradient';



// import { Headline, Button, Text, Subheading, Checkbox } from 'react-native-paper'
// import { dark_colors, light_colors } from '../globals/colors'
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { useNavigation } from '@react-navigation/core';
// import { registerUser } from '../Services/User';

// export default function RegisterScreen(props) {




//     const navigation = useNavigation()
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [name, setName] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [phone, setphone] = useState("");
//     const [showPassword, setShowPassword] = useState(false)

//     const handleRegister = async () => {
//         try {
//             if (email == "") {
//                 alert("Please Enter Email")
//             }
//             else if (name == "") {
//                 alert("Please Enter Name")
//             }
//             else if (phone == "") {
//                 alert("Please Enter Mobile Number")
//             }
//             else if (confirmPassword.toLowerCase() != password.toLowerCase() && confirmPassword != "" && password != "") {
//                 alert("Password and confirm password does not match")
//             }
//             else if (password == "") {
//                 alert("Please Enter Password")
//             }
//             else {
//                 let obj = {
//                     email,
//                     name,
//                     email,
//                     password,
//                     phone,
//                 }
//                 const res = await registerUser(obj)
//                 console.log(res)
//                 if (res?.data?.message) {
//                     alert(res.data.message)
//                     props.navigation.navigate("Login")
//                 }
//             }
//         }
//         catch (err) {
//             if (err?.response?.data?.message) {
//                 console.log(err?.response?.data?.message)
//                 alert(err?.response?.data?.message)
//             }
//             else {
//                 alert(err)
//                 console.log(err)
//             }
//         }
//     }




//     return (
//         <View style={styles.container}>
//             <ScrollView
//                 contentContainerStyle={{ padding: 15 }}
//             >
//                 <View style={styles.imgContainer}>
//                     <Image source={require('../../assets/Logo.png')} style={styles.img} resizeMode="contain" />
//                     <Image source={require("../../assets/20943501.jpg")} style={{ width: wp(80), height: hp(30), }} />
//                     <Text style={styles.headerText}>Join us now !</Text>
//                 </View>

//                 <Text style={styles.label}>
//                     Mobile Number
//                 </Text>
//                 <TextInput onChangeText={setphone} keyboardType={"number-pad"} maxLength={10} placeholder="Mobile Number" style={styles.textInput} />


//                 <Pressable style={styles.btn} onPress={() => props.navigation.navigate("OtpScreen")}>
//                     <Text style={styles.btnTxt}>Register</Text>
//                 </Pressable>
//                 {/* <Pressable style={styles.button} onPress={() => handleRegister()}>
//                     <LinearGradient colors={[light_colors.primary, light_colors.primary2,]} start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} useAngle={true} angle={45} style={{ padding: 12 }} >
//                         <Text style={styles.buttonText}>
//                             Submit
//                         </Text>
//                     </LinearGradient>
//                 </Pressable> */}

//                 <View style={styles.registerContainer}>
//                     <Text style={styles.registerText} >Already have an Account? </Text><Pressable style={styles.registerButton} android_ripple={{ color: '#ddd' }} onPress={() => navigation.navigate('Login')}  ><Text style={styles.registerButtonText}>Login.</Text></Pressable>
//                 </View>

//                 <View style={styles.skipForNowContainer}>
//                     <Pressable style={styles.skipForNowButton} android_ripple={{ color: '#ddd' }} onPress={() => navigation.navigate('MainBottomTab')} ><Text style={styles.skipForNowText}>Skip For Now</Text></Pressable>
//                 </View>
//             </ScrollView>
//         </View >
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         minHeight: '100%',
//         backgroundColor: Appearance.getColorScheme() == 'dark' ? dark_colors.backgroundColor : light_colors.backgroundColor,
//         // padding: 15,
//         display: 'flex',
//         // justifyContent: 'center'
//     },
//     headerText: {
//         marginTop: 20,
//         marginBottom: 20,
//         fontSize: 24,
//         textAlign: 'center',
//         color: Appearance.getColorScheme() == 'dark' ? dark_colors.textColor : light_colors.textColor,
//         fontFamily: 'OpenSans-Bold',
//     },
//     textInput: {
//         borderColor: "rgba(0,0,0,0.02)",
//         borderWidth: 2,
//         borderRadius: 7,
//         paddingLeft: 20,
//         backgroundColor: "#F1F3FD",
//         marginVertical: 8
//     },
//     label: {
//         fontFamily: 'OpenSans-SemiBold',
//         color: "black",
//         fontSize: 14,
//         marginBottom: 8,
//         color: "grey",
//         paddingLeft: 5,
//         marginTop: 15,
//         // paddingTop: 15,
//         textTransform: "capitalize",
//     },
//     btn: {
//         backgroundColor: "#363D4D",
//         borderRadius: 8,
//         width: wp(92),
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         marginTop: 30,
//         paddingVertical: 10,
//     },

//     btnTxt: {
//         fontFamily: 'OpenSans-SemiBold',
//         fontSize: 14,
//         color: "grey",
//         paddingLeft: 5,
//         // paddingTop: 15,
//         textTransform: "capitalize",
//         color: "white"
//     },
//     button: {
//         borderRadius: 5,
//         marginVertical: 10,
//         display: 'flex',
//         overflow: 'hidden'
//     },
//     buttonText: {
//         color: Appearance.getColorScheme() == 'dark' ? dark_colors.buttonText : light_colors.buttonText,
//         textAlign: 'center',
//         fontSize: 16,
//         fontFamily: 'OpenSans-Regular',
//     },
//     img: {
//         width: '80%',
//         height: 120
//     },
//     imgContainer: {
//         width: '100%',
//         // maxHeight: 150,
//         marginBottom: 20,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingHorizontal: 10,
//         marginTop: 33
//     },
//     showPassword: {
//         display: 'flex',
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 10
//     },
//     showPasswordText: {
//         color: Appearance.getColorScheme() == 'dark' ? dark_colors.textColor : light_colors.textColor,
//         marginLeft: 5,
//         fontFamily: 'OpenSans-Regular',
//     },
//     registerContainer: {
//         display: 'flex',
//         flexDirection: 'row',
//         justifyContent: 'center',
//         marginTop: 10
//     },
//     registerText: {
//         color: Appearance.getColorScheme() == 'dark' ? dark_colors.textColor : light_colors.textColor,
//         fontFamily: 'OpenSans-Regular',
//     },
//     registerButton: {

//     },
//     registerButtonText: {
//         color: Appearance.getColorScheme() == 'dark' ? dark_colors.primary : light_colors.primary,
//         fontFamily: 'OpenSans-Regular',
//     },
//     skipForNowContainer: {
//         marginTop: 15,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     skipForNowButton: {

//     },
//     skipForNowText: {
//         color: Appearance.getColorScheme() == 'dark' ? dark_colors.primaryDark : light_colors.primaryDark,
//         textAlign: 'center',
//         fontFamily: 'OpenSans-Regular',
//     }
// })