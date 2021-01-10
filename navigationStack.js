import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Camera from './camera';
import KeySlider from './keySlider'

const stackScreen = createStackNavigator();

export default function navStack() {
  return (
    <stackScreen.Navigator screenOptions={{headerShown: false}}>
      <stackScreen.Screen name="Camera" component={Camera} />
      <stackScreen.Screen name="KeySlider" component={KeySlider} />
    </stackScreen.Navigator>
  );
}
