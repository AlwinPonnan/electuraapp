import React from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Appbar } from 'react-native-paper';
import { light_colors } from '../globals/colors';
import MIcon from 'react-native-vector-icons/Ionicons'
import ImageUrls from '../globals/images';

export default function NavBar({ navigation }) {
  console.log(navigation.toggleDrawer)


  const toggle = () => {
    navigation.toggleDrawer()
  }

  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Image source={ImageUrls.Logo} style={styles.logo} resizeMethod="resize" resizeMode="contain" />
      </View>

      <View style={styles.iconContainer} >

        <Pressable android_ripple={{ color: '#ddd' }} style={styles.iconButton}>
          <MIcon name="notifications-outline" size={18} style={styles.icon} />
        </Pressable>
        <Pressable onPress={() => toggle()}
          android_ripple={{ color: '#ddd' }} style={styles.iconButton}>
          <MIcon name="menu-outline" size={22} style={styles.icon} />
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
  iconContainer: {
    display: "flex",
    flexDirection: 'row',
  },
  logo: {
    height: 50,
    width: 100,
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
    height: '100%',
    // backgroundColor:'red',
    paddingHorizontal: 15
  },
  icon: {
  }

})

