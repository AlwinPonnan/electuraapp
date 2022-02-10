import React, { useState, useEffect,useContext } from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Appbar } from 'react-native-paper';
import { light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import ImageUrls from '../globals/images';
import { DrawerActions, useIsFocused } from '@react-navigation/native';
import { Badge } from 'react-native-paper';
import { getAllNotifications, getCart } from '../Services/User';
import { getAllEnquiryRequests } from '../Services/Enquiry';

import { globalUpdateContext } from '../../App';
export default function NavBar(props) {


  const toggle = () => {
    props.rootProps.navigation.dispatch(DrawerActions.toggleDrawer())
  }

  const [cartObj, setCartObj] = useState({});
  const [requestArr, setRequestArr] = useState([]);
  const [notificationArr, setNotificationArr] = useState([]);
  const focused = useIsFocused()

  const [globalUpdate, setGlobalUpdate] = useContext(globalUpdateContext);
  const getUserCart = async () => {
    try {
      const { data: res } = await getCart();
      if (res.success) {
        // console.log(res.data)
        setCartObj(res.data)
      }
    } catch (error) {
      console.error(error)
    }
  }
  const getRequests = async () => {
    try {
      const { data: res } = await getAllEnquiryRequests();
      if (res.success) {
        setRequestArr(res.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getNotification = async () => {
    try {
      const { data: res } = await getAllNotifications();
      if (res.success) {
        // console.log(JSON.stringify(res.data,null,2))
        setNotificationArr([...res.data.filter(el=>!el.read)])
      }
    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {
    getUserCart()
    getRequests()
    getNotification()
  }, [focused,globalUpdate])

  return (
    <View style={styles.headerContainer}>
      <Pressable style={styles.logoContainer} onPress={() => toggle()}>
        {/* <Icon name="menu-outline" size={20} style={styles.icon} /> */}

        <Image source={require('../../assets/images/menu.png')} style={styles.logo} resizeMethod="resize" resizeMode="contain" />
      </Pressable>

      <View style={styles.iconContainer}>

        <Pressable onPress={() => props.rootProps.navigation.navigate("ShoppingCart")} android_ripple={{ color: '#27303E' }} style={[styles.iconButton, { flexDirection: 'row' }]}>
          <Icon name="cart-outline" color={"#27303E"} size={20} style={styles.icon} />
          {cartObj?.courseArr?.length > 0 &&
            <Badge size={12}>{cartObj?.courseArr?.length}</Badge>
          }
        </Pressable>
        <Pressable onPress={() => props.rootProps.navigation.navigate("SearchScreen")} android_ripple={{ color: '#27303E' }} style={styles.iconButton}>
          <Icon name="search-outline" color={"#27303E"} size={20} style={styles.icon} />
        </Pressable>

        <Pressable onPress={() => props.rootProps.navigation.navigate("MainTopTab")} android_ripple={{ color: '#27303E' }} style={[styles.iconButton, { flexDirection: 'row', alignItems: 'center' }]}>
          <Icon name="chatbubble-ellipses-outline" color={"#27303E"} size={20} style={styles.icon} />
          {requestArr?.length > 0 &&
            <Badge size={12}>{requestArr?.length}</Badge>
          }
        </Pressable>

        <Pressable onPress={() => props.rootProps.navigation.navigate("Notification")} android_ripple={{ color: '#27303E' }}  style={[styles.iconButton, { flexDirection: 'row', alignItems: 'center' }]}>
          <Icon name="notifications-outline" color={"#27303E"} size={20} style={styles.icon} />
          {notificationArr?.length > 0 &&
            <Badge size={12}>{notificationArr?.length}</Badge>
          }
        </Pressable>
      </View>


    </View>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: light_colors.backgroundColor,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 59,
    overflow: 'hidden',
    // borderBottomColor: light_colors.lightGrey,
    // borderBottomWidth: 1,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: 15,
    // backgroundColor:'red',
    width: '20%'
  },
  iconContainer: {
    display: "flex",
    flexDirection: 'row',
  },
  logo: {
    height: 20,
    width: 20,
  },

  iconsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // marginHorizontal: 5
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // height: '100%',
    // backgroundColor:'red',
    paddingHorizontal: 10
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
  }

})

