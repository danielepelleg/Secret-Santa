import React, {useContext, useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import {firebase} from '../config/firebase';
import {AuthContext} from './AuthProvider';

import { LogBox } from 'react-native';

import AuthStack from './AuthStack';
import AppStack from './AppStack';

const Routes = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  if (initializing) return null;

  // Ignore Warning caused by React Native when using Firebase
  LogBox.ignoreLogs(['Setting a timer']);
  
  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

export default Routes;
