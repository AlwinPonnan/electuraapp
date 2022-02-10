import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  SafeAreaView,
  useColorScheme,
  Text, StyleSheet, Linking
} from 'react-native';

import RootStack from './src/navigators/stacks/RootStack'

import { DefaultTheme, Provider as PaperProvider, Modal, Portal } from 'react-native-paper';
import { light_colors, dark_colors } from './src/globals/colors';
import messaging from '@react-native-firebase/messaging';
var PushNotification = require("react-native-push-notification");
import LottieView from 'lottie-react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import axios from 'axios';
import { loadingContext } from './src/navigators/stacks/RootStack';
export const successAlertContext = createContext()

export const axiosApiInstance = axios.create();

export const chatRefreshContext = createContext()
export const globalUpdateContext = createContext()

const App = () => {

  const currentColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false)

  const [successAlert, setSuccessAlert] = useState(false);
  const [warningAlert, setWarningAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const [alertText, setAlertText] = useState('Success');

  const [loading, setLoading] = useState(false);

  const [chatRefresh, setChatRefresh] = useState(false);

  const [globalUpdate, setGlobalUpdate] = useState(false);

  useEffect(() => {
    setIsDarkMode(currentColorScheme == 'dark')
  }, [currentColorScheme])

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: isDarkMode ? dark_colors.primary : light_colors.primary,
      // accent: isDarkMode ? dark_colors.secondary : light_colors.secondary,
      background: isDarkMode ? dark_colors.backgroundColor : light_colors.backgroundColor,
    },
  };



  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)


    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      // console.log("NOTIFICATION:", notification);
      console.log("NOTIFICATION:", JSON.stringify(notification, null, 2));
      setLoading(true)
      setTimeout(() => {
        setLoading(false);
        // Linking.canOpenURL(notification?.data?.remoteMessage?.data?.redirectTo)
        // Linking.openURL(notification?.data?.remoteMessage?.data?.redirectTo)
        console.log(notification?.data, "$$$$$$$$$$$$$$$$")
        console.log(notification?.data?.remoteMessage?.data?.redirectTo, "$$$$$$$$$$$$$$$$")
        if (notification?.data?.remoteMessage?.data?.redirectTo) {

          Linking.canOpenURL(notification?.data?.remoteMessage?.data?.redirectTo).then(supported => {
            if (supported) {
              return Linking.openURL(`${notification?.data?.remoteMessage?.data?.redirectTo}`);
            }
          })
        }
      }, 2000)


    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log("ACTION:", notification.action);

      // process the action
    },



  });




  const notifyChannel = () => {
    PushNotification.createChannel(
      {
        channelId: "Electura", // (required)
        channelName: "General", // (required)
        channelDescription: "General Channel", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }

  useEffect(() => {
    notifyChannel();
    // Geocoder.init("AIzaSyCtkZzuFSZ94CSPnDArwvPMqxkk58Fzfno")
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage?.data?.remoteMessage?.data?.redirectTo == "demo://app/Chat") {
        setChatRefresh(!chatRefresh)
      }
      if (remoteMessage)
        setGlobalUpdate(!globalUpdate)
      // console.log(remoteMessage)
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: "Electura", // (required) channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
        ticker: "My Notification Ticker", // (optional)
        showWhen: true, // (optional) default: true
        autoCancel: true, // (optional) default: true
        largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
        // largeIconUrl: "https://www.example.tld/picture.jpg", // (optional) default: undefined
        smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
        // bigText: `${remoteMessage.data.title}`, // (optional) default: "message" prop
        bigLargeIcon: "ic_launcher", // (optional) default: undefined
        // bigLargeIconUrl: "https://www.example.tld/bigicon.jpg", // (optional) default: undefined
        // color: "blue", // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 2000, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        tag: "some_tag", // (optional) add tag to message
        group: "group", // (optional) add group to message
        groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        priority: "high", // (optional) set notification priority, default: high
        visibility: "private", // (optional) set notification visibility, default: private
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
        shortcutId: "shortcut-id", // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
        onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false

        when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
        usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
        timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

        messageId: "google:message_id", // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 

        // actions: ["Yes", "No"], // (Android only) See the doc for notification actions to know more
        invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

        /* iOS only properties */
        category: "", // (optional) default: empty string

        /* iOS and Android properties */
        id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
        title: `${remoteMessage.data.title}`, // (optional)
        message: `${remoteMessage.data.content}`, // (required)
        // userInfo: `${remoteMessage.data.redirectTo}`, // (optional) default: {} (using null throws a JSON value '<null>' error)
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        // repeatType: "day", // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
        data: { remoteMessage }
      });
    });

    return unsubscribe;
  }, []);



  useEffect(() => {
    if (successAlert)
      setTimeout(() => setSuccessAlert(false), 2000)
  }, [successAlert])


  useEffect(() => {
    if (warningAlert)
      setTimeout(() => setWarningAlert(false), 2000)
  }, [warningAlert])

  useEffect(() => {
    if (errorAlert)
      setTimeout(() => setErrorAlert(false), 2000)
  }, [errorAlert])


  return (
    <loadingContext.Provider value={[loading, setLoading]}>
      <globalUpdateContext.Provider value={[globalUpdate, setGlobalUpdate]} >

        <chatRefreshContext.Provider value={[chatRefresh, setChatRefresh]}>

          <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <PaperProvider theme={theme}>
              <successAlertContext.Provider value={{ successAlertArr: [successAlert, setSuccessAlert], warningAlertArr: [warningAlert, setWarningAlert], errorAlertArr: [errorAlert, setErrorAlert], alertTextArr: [alertText, setAlertText] }}>


                <RootStack />

                {/* Success Modal */}

                <Portal>
                  <Modal visible={successAlert} onDismiss={() => { setSuccessAlert(false); setAlertText('Success') }} contentContainerStyle={styles.containerStyle}>
                    <LottieView source={require('./assets/images/success.json')} autoSize resizeMode="cover" autoPlay loop={false} style={styles.lottieStyle} />
                    <Text style={styles.alertText}>{alertText}</Text>
                  </Modal>
                </Portal>

                {/* Warning Modal */}

                <Portal>
                  <Modal visible={warningAlert} onDismiss={() => { setWarningAlert(false); setAlertText('Warning') }} contentContainerStyle={styles.containerStyle}>
                    <LottieView source={require('./assets/images/warning.json')} autoSize resizeMode="cover" autoPlay loop={false} style={styles.lottieStyle} />
                    <Text style={styles.alertText}>{alertText}</Text>
                  </Modal>
                </Portal>

                {/* Error Modal */}
                <Portal>
                  <Modal visible={errorAlert} onDismiss={() => { setErrorAlert(false); setAlertText('Error') }} contentContainerStyle={styles.containerStyle}>
                    <LottieView source={require('./assets/images/error.json')} autoSize resizeMode="cover" autoPlay loop={false} style={styles.lottieStyle} />
                    <Text style={styles.alertText}>{alertText}</Text>
                  </Modal>
                </Portal>

              </successAlertContext.Provider>
            </PaperProvider>
          </SafeAreaView>
        </chatRefreshContext.Provider>
      </globalUpdateContext.Provider>

    </loadingContext.Provider>

  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 20,
    width: widthPercentageToDP(80),
    alignSelf: 'center',
    borderRadius: 5,
  },
  lottieStyle: {
    height: 100,
    width: 100,
    alignSelf: 'center'
  },
  alertText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20
  }
})


export default App;
