import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import PatientRegisterScreen from './src/screens/PatientRegisterScreen';
import { initDatabase } from './src/db/database';


const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    initDatabase();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PatientRegister" component={PatientRegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;