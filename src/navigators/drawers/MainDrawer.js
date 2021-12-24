import React, { useState, useContext, useEffect } from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import EncryptedStorage from 'react-native-encrypted-storage';
import { AuthContext, profileContext, roleContext } from '../stacks/RootStack';

import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity, Linking
    ,Share
} from 'react-native';
import 'react-native-gesture-handler';
import MainBottomTab from '../tabs/MainBottomTab';
import AccountEdit from '../../views/AccountEdit';

import Icon from 'react-native-vector-icons/Ionicons'
import { colorObj } from '../../globals/colors';
import MainTopTab from '../tabs/MainTopTab';
import RegisterTeacher from '../../views/RegisterTeacher';
import { getUser } from '../../Services/User';
import { generateImageUrl } from '../../globals/utils';
import CreateCourse from '../../views/CreateCourse';
import { useIsFocused } from '@react-navigation/core';
import TeacherProfile from '../../views/TeacherProfile';
import Coupons from '../../views/Coupons';
import TeacherCoupons from '../../views/TeacherCoupon';
const Drawer = createDrawerNavigator();


export default function MainDrawer() {

    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const focused = useIsFocused()
    const [profileData, setProfileData] = useContext(profileContext);
    const [isAuthorized, setIsAuthorized] = useContext(AuthContext);
    const [roleName, setRoleName] = useContext(roleContext);

    const onShare = async () => {
        try {
          const result = await Share.share({
            message:
            `Referal code from ${profileData?.name} is ${profileData.referalCode}`,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
      };
    ////////////////////custom user drawer 
    function CustomDrawerContent(props) {

        const handleLogout = async () => {
            await EncryptedStorage.removeItem('AUTH_TOKEN')
            await EncryptedStorage.removeItem('AUTH_REFRESH_TOKEN')
            setRoleName('USER')
            setIsAuthorized(false)
        }

        return (
            <DrawerContentScrollView {...props}>
                <View style={styles.profilePicContainer}>
                    <Image source={profileData.profileImage ? { uri: generateImageUrl(profileData.profileImage) } : require('../../../assets/images/user.png')} style={styles.profilePic} />
                    {
                         profileData.name == "" ?
                        <Text style={styles.userName}>+91-{profileData.phone} </Text>
                        :
                        <Text style={styles.userName}>{profileData.name} </Text>
                    }
                </View>

                <View style={{ marginBottom: 20, display: "flex", flexDirection: "column" }}>

                    <TouchableOpacity style={styles.DrawerItem} onPress={() => props.navigation.navigate("MainBottomTab")}><Icon name="home-outline" size={16} color={colorObj.primarColor} /><Text style={styles.drawerItemTxt}> Home</Text></TouchableOpacity>

                    <TouchableOpacity style={styles.DrawerItem} onPress={() => profileData?.role == "TEACHER" ? props.navigation.navigate('TeacherProfile', { data: profileData?._id }) : props.navigation.navigate('AccountEdit')}><Icon name="settings-outline" size={16} color={colorObj.primarColor} /><Text style={styles.drawerItemTxt}> Account Settings</Text></TouchableOpacity>
                    
                    {
                        roleName == "TEACHER" &&
                        <>
                            <TouchableOpacity style={styles.DrawerItem} onPress={() => props.navigation.navigate('CreateCourse')}><Icon name="desktop-outline" size={16} color={colorObj.primarColor} /><Text style={styles.drawerItemTxt}>Create Your Course</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.DrawerItem} onPress={() => props.navigation.navigate('TeacherCoupons')}><Icon name="barcode-outline" size={16} color={colorObj.primarColor} /><Text style={styles.drawerItemTxt}>Coupons</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.DrawerItem} onPress={() => props.navigation.navigate('TeacherSlots')}><Icon name="calendar-outline" size={16} color={colorObj.primarColor} /><Text style={styles.drawerItemTxt}> Create your Slots</Text></TouchableOpacity>

                        </>
                    }

                    <TouchableOpacity style={styles.DrawerItem}><Icon name="pencil-outline" size={16} color={colorObj.primarColor} /><Text style={styles.drawerItemTxt}> Blogs</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.DrawerItem}><Icon name="information-circle-outline" size={16} color={colorObj.primarColor} /><Text style={styles.drawerItemTxt}> About Us</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.DrawerItem}><Icon name="help-outline" size={16} color={colorObj.primarColor} /><Text style={styles.drawerItemTxt}> Support</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.DrawerItem}><Icon name="help-circle-outline" size={16} color={colorObj.primarColor} /><Text style={styles.drawerItemTxt}> FAQs</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.DrawerItem}><Icon name="document-text-outline" size={16} color={colorObj.primarColor} /><Text style={styles.drawerItemTxt}> Policies</Text></TouchableOpacity>
        
                    <TouchableOpacity style={styles.DrawerItem} onPress={()=> onShare()}><Icon name="link-outline" size={16} color={colorObj.primarColor} /><Text style={styles.drawerItemTxt}>Referal Code is <Text style={{fontFamily: "OpenSans-Bold",}}> {profileData?.referalCode} </Text></Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => { handleLogout() }} style={styles.DrawerItem}><Icon name="log-out-outline" size={16} color={colorObj.primarColor} /><Text style={styles.drawerItemTxt}> Logout</Text></TouchableOpacity>
                </View>

                {
                    roleName === "USER" &&
                    <View style={styles.teacherContainer} >
                        <Text style={styles.teacherHeading}>Become Teacher</Text>
                        <Image source={require('../../../assets/images/teacherVector.png')} />
                        <Text style={[styles.teacherHeading, { fontSize: 12, fontFamily: 'OpenSans-Regular' }]}>List your profile {roleName} on Electura and spread your word</Text>
                        <TouchableOpacity onPress={() => props.navigation.navigate("RegisterTeacher")} style={styles.teachButton}>
                            <Text style={styles.teachText}>Teach</Text>
                        </TouchableOpacity>
                    </View>
                }
            </DrawerContentScrollView>
        );
    }

    const getUserData = async () => {
        try {
            let { data: res, status: statusCode } = await getUser();
            console.log(statusCode)
            if (statusCode == 200 || statusCode == 304) {
                console.log(JSON.stringify(res.data.name, null, 2), "user")
                setProfileData(res.data)
                setRoleName(res.data.role)
            }
        }
        catch (err) {
            console.error(err)
        }
    }
    useEffect(() => {
        if (focused)
            getUserData()
    }, [focused])



   
    return (
        <Drawer.Navigator screenOptions={{ headerShown: false }} drawerContent={props => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name="MainBottomTab" component={MainBottomTab} />
            <Drawer.Screen name="AccountEdit" component={AccountEdit} />
            <Drawer.Screen name="CreateCourse" component={CreateCourse} />
            <Drawer.Screen name="TeacherCoupons" component={TeacherCoupons} />
            <Drawer.Screen name="RegisterTeacher" component={RegisterTeacher} />
        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({
    DrawerItem: {
        marginLeft: 22,
        marginTop: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },

    drawerItemTxt: {
        color: colorObj.primarColor,
        fontFamily: "OpenSans-Regular",
        // textTransform: "capitalize",
        fontSize: 16,
        marginVertical: 5,
        marginLeft: 10
    },
    Name: {
        fontWeight: '900',
        fontSize: 19,
        justifyContent: "center",
        color: colorObj.primarColor,
        marginLeft: 15,
        fontFamily: "OpenSans-SemiBold",

    },
    profilePicContainer: {
        // backgroundColor: "#f2f2f2",
        height: 140,
        // width: 140,
        marginTop: hp(2),
        display: "flex",
        flexDirection: 'row',
        alignItems: "center",
        borderRadius: 150,
        // backgroundColor: 'red',
        paddingHorizontal: 20
    },
    profilePic: {
        borderRadius: 8,
        width: 50,
        height: 50,
    },
    userName: {
        fontSize: 16,
        // marginTop: 16,
        paddingHorizontal: 10,
        color: '#27303E',
        textAlign: "center",
        textTransform: 'capitalize',
        fontFamily: "OpenSans-Bold",
    },
    Logoutbtn: {
        backgroundColor: "#FFCB05",
        marginLeft: 22,
        position: "absolute",
        bottom: 80,
        // paddingHorizontal: 15
        width: 130,
        height: 35,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 2,

    },
    logoutBtnTxt: {
        fontFamily: "OpenSans-Regular",
        textTransform: "capitalize",
        color: "#6b6a6a",
    },
    teacherContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 20
    },
    teacherHeading: {
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 14,
        color: colorObj.primarColor,
        marginVertical: 10,
        textAlign: 'center',
        paddingHorizontal: 20
    },
    teachButton: {
        backgroundColor: colorObj.primarColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 3
    },
    teachText: {
        fontFamily: 'OpenSans-SemiBold',
        color: colorObj.whiteColor
    }
});
