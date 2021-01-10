import React from 'react';
import {NavigationContainer, useTheme} from '@react-navigation/native';

import Camera from './camera';
import VideoCam from './videocam';
import NavStack from './navigationStack';

export default function App() {
  return (
    <NavigationContainer>
      <NavStack />
    </NavigationContainer>
  );
}
