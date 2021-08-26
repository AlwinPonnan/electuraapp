import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Appearance, Pressable, Image, ScrollView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

import { TextInput, Headline, Button, Text, Subheading, Checkbox } from 'react-native-paper'
import { dark_colors, light_colors } from '../globals/colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/core';

export default function LoginScreen() {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.imgContainer}>
                    <Image source={require('../assets/Logo.png')} style={styles.img} resizeMode="contain" />
                </View>
                <Text style={styles.headerText} >Log In</Text>
                <TextInput label="Email" mode="outlined" style={styles.textInput} />
                <TextInput label="Password" mode="outlined" style={styles.textInput} secureTextEntry={!showPassword} />
                <Pressable style={styles.showPassword} onPress={() => { setShowPassword(!showPassword); }} android_ripple={{ color: '#ddd' }} >
                    <Checkbox
                        status={showPassword ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setShowPassword(!showPassword);
                        }}
                        color={
                            Appearance.getColorScheme() == 'dark' ? dark_colors.primary : light_colors.primary
                        }
                    />
                    <Text style={styles.showPasswordText} >Show Password</Text>
                </Pressable>
                <Pressable style={styles.button} >
                    <LinearGradient colors={[light_colors.primary, light_colors.primary2,]} start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} useAngle={true} angle={45} style={{ padding: 12 }} >
                        <Text style={styles.buttonText}>
                            Submit
                        </Text>
                    </LinearGradient>
                </Pressable>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText} >Don't have an Account? </Text><Pressable style={styles.registerButton} android_ripple={{ color: '#ddd' }} onPress={()=>navigation.navigate('Register')}  ><Text style={styles.registerButtonText}>Register.</Text></Pressable>
                </View>

                <View style={styles.skipForNowContainer}>
                    <Pressable style={styles.skipForNowButton} android_ripple={{ color: '#ddd' }} onPress={()=>navigation.navigate('MainBottomTab')} ><Text style={styles.skipForNowText}>Skip For Now</Text></Pressable>
                </View>
            </ScrollView>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: '100%',
        backgroundColor: Appearance.getColorScheme() == 'dark' ? dark_colors.backgroundColor : light_colors.backgroundColor,
        padding: 15,
        display: 'flex',
        // justifyContent: 'center'
    },
    headerText: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 24,
        textAlign: 'center',
        color: Appearance.getColorScheme() == 'dark' ? dark_colors.textColor : light_colors.textColor,
        fontFamily:'OpenSans-Bold',
    },
    textInput: {
        marginTop: 10,
        fontFamily:'OpenSans-Regular',
    },
    buttonStyles: {

    },
    button: {
        borderRadius: 5,
        marginVertical: 10,
        display: 'flex',
        overflow: 'hidden'
    },
    buttonText: {
        color: Appearance.getColorScheme() == 'dark' ? dark_colors.buttonText : light_colors.buttonText,
        textAlign: 'center',
        fontSize: 16,
        fontFamily:'OpenSans-Regular',
    },
    img: {
        width: '100%',
        height: '100%'
    },
    imgContainer: {
        width: '100%',
        maxHeight: 150,
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginTop: 33
    },
    showPassword: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    showPasswordText: {
        color: Appearance.getColorScheme() == 'dark' ? dark_colors.textColor : light_colors.textColor,
        marginLeft: 5,
        fontFamily:'OpenSans-Regular',
    },
    registerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    registerText: {
        color: Appearance.getColorScheme() == 'dark' ? dark_colors.textColor : light_colors.textColor,
        fontFamily:'OpenSans-Regular',
    },
    registerButton: {

    },
    registerButtonText: {
        color: Appearance.getColorScheme() == 'dark' ? dark_colors.primary : light_colors.primary,
        fontFamily:'OpenSans-Regular',
    },
    skipForNowContainer:{
        marginTop:15,
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    skipForNowButton:{
        
    },
    skipForNowText:{
        color: Appearance.getColorScheme() == 'dark' ? dark_colors.primaryDark : light_colors.primaryDark,
        textAlign:'center',
        fontFamily:'OpenSans-Regular',
    }
})