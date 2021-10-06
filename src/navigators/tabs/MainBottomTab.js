import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../views/HomeScreen';
import AccountScreen from '../../views/AccountScreen';
import SearchScreen from '../../views/SearchScreen';
import CustomNavigationBar from '../../components/Navbar';
import MIcon from 'react-native-vector-icons/MaterialIcons'
import { colorObj, light_colors } from '../../globals/colors';
import ProfileStack from '../stacks/ProfileStack';
import Settings from '../../views/Settings';
import Icon from 'react-native-vector-icons/Ionicons';
import SettingStack from '../stacks/SettingStack';
import Courses from '../../views/Courses';
import Learnings from '../../views/Learnings';


const Tab = createBottomTabNavigator();

export default function MainBottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        
        tabBarActiveTintColor: colorObj.primarColor,
        headerShown:false,        
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          elevation: 0,
          borderTopColor: light_colors.lightGrey,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: 'Montserrat-Regular',
        }
        
      }}

    >
      <Tab.Screen
        name="Home"

        component={HomeScreen}

        options={{
          title:"Teachers",
          tabBarIcon: ({ color, size }) => (
            <Icon name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Courses"
        component={Courses}
        options={{
          title:'Courses',
          tabBarIcon: ({ color, size }) => (
            <Icon name="play-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Courses}
        activeColor="#fff"
        inactiveColor="#000"

        options={{
          title:'Enquiry',

          tabBarIcon: ({ color, size }) => (
            
            <Icon name="clipboard-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Learnings"
        component={Learnings}
        activeColor="#fff"
        inactiveColor="#000"

        options={{
          title:'Learning',

          tabBarIcon: ({ color, size }) => (
            <Icon name="newspaper-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={Learnings}
        activeColor="#fff"
        inactiveColor="#000"

        options={{
          title:'Profile',

          tabBarIcon: ({ color, size }) => (
            <Icon name="newspaper-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
