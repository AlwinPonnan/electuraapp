import React from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Appbar } from 'react-native-paper';
import { light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import ImageUrls from '../globals/images';
import { DrawerActions } from '@react-navigation/native';

export default function NavBar(props) {


  const toggle = () => {
    props.rootProps.navigation.dispatch(DrawerActions.toggleDrawer())
  }

  return (
    <View style={styles.headerContainer}>
      <Pressable style={styles.logoContainer} onPress={() => toggle()}>
        <Icon name="menu-outline" size={20} style={styles.icon} />

        {/* <Image source={require('../../assets/images/Icon/Hamburger.png')} style={styles.logo} resizeMethod="resize" resizeMode="contain" /> */}
      </Pressable>

      <View style={styles.iconContainer}>

        <Pressable onPress={() => props.rootProps.navigation.navigate("ShoppingCart")} android_ripple={{ color: '#ddd' }} style={styles.iconButton}>
          <Icon name="cart-outline" size={20} style={styles.icon} />
        </Pressable>
        <Pressable onPress={() => props.rootProps.navigation.navigate("SearchScreen")} android_ripple={{ color: '#ddd' }} style={styles.iconButton}>
          <Icon name="search-outline" size={20} style={styles.icon} />
        </Pressable>
        <Pressable onPress={() => props.rootProps.navigation.navigate("MainTopTab")} android_ripple={{ color: '#ddd' }} style={styles.iconButton}>
          <Icon name="chatbubble-ellipses-outline" size={20} style={styles.icon} />
        </Pressable>
        <Pressable onPress={() => props.rootProps.navigation.navigate("Notification")} android_ripple={{ color: '#ddd' }} style={styles.iconButton}>
          <Icon name="notifications-outline" size={22} style={styles.icon} />
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

