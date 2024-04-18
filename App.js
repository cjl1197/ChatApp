import React, { useState, useEffect, useContext} from 'react';
import Navigator from './components/routes/navigator'
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalContextProvider from './globalContext';

export default function App() {

  return (
    <GlobalContextProvider>
      <NavigationContainer>
        <Navigator/>
      </NavigationContainer>
    </GlobalContextProvider>    
  );
}

