import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, SignIn } from '../screens';
import BottomNavigator from '../component/BottomNavigator';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
    return (
        <Tab.Navigator
            tabBar={props => <BottomNavigator {...props} />}
        >
            <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
        </Tab.Navigator>
    )
}

const Router = () => {
    return (
        <Stack.Navigator>
            {/* <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} /> */}

            {/* bottom Navigation */}
            <Stack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default Router;