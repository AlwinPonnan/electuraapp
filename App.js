import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  useColorScheme,
} from 'react-native';

import RootStack from './navigators/stacks/RootStack'

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { light_colors, dark_colors } from './globals/colors';



const App = () => {

  const currentColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false)

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
        <RootStack />
      </SafeAreaView>
    </PaperProvider>
  );
};


export default App;
