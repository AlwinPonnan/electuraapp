import React from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Appbar } from 'react-native-paper';
import { light_colors } from '../globals/colors';
import Icon from 'react-native-vector-icons/Ionicons'
import ImageUrls from '../globals/images';

export default function NavBar({ navigation, previous }) {
  // console.log(props)
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image source={ImageUrls.Logo} style={styles.logo} resizeMethod="resize" resizeMode="contain" />
      </View>

      <View style={styles.iconContainer}>


        <Pressable android_ripple={{ color: '#ddd' }} style={styles.iconButton}>
          <Icon name="ios-grid-outline" size={20} style={styles.icon} />
        </Pressable>
        <Pressable android_ripple={{ color: '#ddd' }} style={styles.iconButton}>
          <Icon name="notifications-outline" size={20} style={styles.icon} />
        </Pressable>
        <Pressable android_ripple={{ color: '#ddd' }} style={styles.iconButton}>
          <Icon name="person-outline" size={22} style={styles.icon} />
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
    borderBottomColor: light_colors.lightGrey,
    borderBottomWidth: 1,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15
  },
  logo: {
    height: 50,
    width: 80,
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

