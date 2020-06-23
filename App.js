import React from 'react';
import { View, StatusBar } from 'react-native';
import SessionProvider from './appContent/contexts/SessionContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './appContent/pages/Login';
import Home from './appContent/pages/Home';

const Stack = createStackNavigator();
const statusbar = StatusBar.currentHeight

export default function App() {
  return (
    <SessionProvider>
      <View style={{ flex: 1, paddingTop: statusbar }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login"
            screenOptions={{
              headerShown: false
            }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SessionProvider>
  );
}
