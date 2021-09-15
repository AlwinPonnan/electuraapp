import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../views/HomeScreen';
import AccountScreen from '../../views/AccountScreen';
import SearchScreen from '../../views/SearchScreen';
import CustomNavigationBar from '../../components/Navbar';
import MIcon from 'react-native-vector-icons/MaterialIcons'
import { light_colors } from '../../globals/colors';
import ProfileStack from '../stacks/ProfileStack';
import Settings from '../../views/Settings';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingStack from '../stacks/SettingStack';


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
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="search-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={ProfileStack}
        activeColor="#fff"
        inactiveColor="#000"

        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingStack"
        component={SettingStack}
        activeColor="#fff"
        inactiveColor="#000"

        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
