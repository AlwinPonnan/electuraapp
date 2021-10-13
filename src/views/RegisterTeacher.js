import React from 'react'
import { View, Text } from 'react-native'
import NavBar from '../components/Navbar'

export default function RegisterTeacher(props) {
    return (
        <View>
            <NavBar rootProps={props} />
            <Text> RegisterTeacher</Text>
        </View>
    )
}
