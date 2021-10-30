import React, { useState, useEffect, createContext } from 'react';
import {
  SafeAreaView,
  useColorScheme,
  Text, StyleSheet
} from 'react-native';

import RootStack from './src/navigators/stacks/RootStack'

import { DefaultTheme, Provider as PaperProvider, Modal, Portal } from 'react-native-paper';
import { light_colors, dark_colors } from './src/globals/colors';


export const successAlertContext = createContext()

const App = () => {

  const currentColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false)

  const [successAlert, setSuccessAlert] = useState(false);
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

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ backgroundColor: 'white', minHeight: '100%' }}>
        <successAlertContext.Provider value={[successAlert, successAlertContext]}>

          <RootStack />
          <Portal>
            <Modal visible={successAlert} onDismiss={() => setSuccessAlert(false)} contentContainerStyle={styles.containerStyle}>

            </Modal>
          </Portal>
        </successAlertContext.Provider>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'white',
    padding: 20
  }
})


export default App;
