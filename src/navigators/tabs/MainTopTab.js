import React, { useEffect, useState, useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Requestscreen from '../../views/RequestScreen';
import Chat from '../../views/Chat';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Badge } from 'react-native-paper';
import { colorObj } from '../../globals/colors';
import { getAllChats } from '../../Services/Chat';
import { generateImageUrl } from '../../globals/utils';
import { getAllEnquiryRequests } from '../../Services/Enquiry';

import { globalUpdateContext } from '../../../App';
import GeneralInnerHeader from '../../components/GeneralInnerHeader';

const Tab = createMaterialTopTabNavigator();


export const BadgeComponent = ({ value }) => {
    return (
        <View style={{ backgroundColor: colorObj.primarColor, height: 20, width: 20, borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontFamily: 'Montserrat-Regular', fontSize: 12 }}>{value}</Text>
        </View>
    )
}


export default function MainTopTab(props) {

    const [chatArr, setChatArr] = useState([]);
    const [pendingRequests, setPendingRequests] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [globalUpdate, setGlobalUpdate] = useContext(globalUpdateContext);
    const getChats = async () => {
        try {

            const { data: res } = await getAllChats();
            if (res.success) {
                let tempMessages = res.data.reduce((acc, el) => acc + el.unreadMessages, 0)
                setUnreadMessages(tempMessages)
            }
        } catch (error) {
            console.error(error)
        }
    }
    const getRequests = async () => {
        try {
            const { data: res } = await getAllEnquiryRequests();
            if (res.success) {
                setPendingRequests(res.data.length)
            }
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        getChats()
        getRequests()

    }, [globalUpdate])

    return (
        <View style={[styles.container]}>

            <GeneralInnerHeader  rootProps={props} />

            <Tab.Navigator
                screenOptions={{
                    activeTintColor: "#085A4E",
                    inactiveTintColor: "#000",
                    tabBarLabelStyle: {
                        fontSize: 14,
                        color: "#085A4E",
                        fontFamily: 'Montserrat-SemiBold',
                        textTransform: 'none'
                    },
                    tabBarItemStyle: { width: widthPercentageToDP(50), },
                    tabBarStyle: { backgroundColor: 'white' },
                    tabBarIndicatorStyle: {
                        backgroundColor: "#085A4E",
                        height: 2
                    },
                }}
                >
                <Tab.Screen  name="Chat" component={Chat} options={{ tabBarBadge: () => unreadMessages > 0 ? <BadgeComponent value={unreadMessages} /> : <></> }} />
                <Tab.Screen name="RequestScreen" options={{ title: 'Requests', tabBarBadge: () => pendingRequests > 0 ? <BadgeComponent value={pendingRequests} /> : <></> }} component={Requestscreen} />
            </Tab.Navigator>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    topText: {
        fontSize: 18,
        fontFamily: 'RedHatText-SemiBold',
        //fontWeight:'500',
    },

})
