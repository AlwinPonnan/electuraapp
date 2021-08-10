import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavBar from '../../components/Navbar'
import LoginScreen from '../../views/LoginScreen';
import HomeScreen from '../../views/HomeScreen';
import RegisterScreen from '../../views/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function RootStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login"
                screenOptions={{
                    header: (props) => <NavBar {...props} />,
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, cardStyles: { backgroundColor: '#ffffff' } }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
