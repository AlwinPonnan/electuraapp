import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../views/HomeScreen';
import AccountScreen from '../../views/AccountScreen';
import SearchScreen from '../../views/SearchScreen';
import CustomNavigationBar from '../../components/Navbar';
import MIcon from 'react-native-vector-icons/MaterialIcons'
import { light_colors } from '../../globals/colors';


const Tab = createBottomTabNavigator();

export default function MainBottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: light_colors.primary,
        // tabBarInactiveTintColor: light_colors.primary2,
        tabBarHideOnKeyboard: true,
        header: (props) => <CustomNavigationBar {...props} />,
        tabBarStyle: {
          elevation: 0,
          borderTopColor: light_colors.lightGrey,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: 'OpenSans-Regular',
        }
      }}

    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}

        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <MIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <MIcon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        activeColor="#fff"
        inactiveColor="#000"

        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <MIcon name="account-circle" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
