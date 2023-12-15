import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './routes/homeStack';

export default function App() {
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
