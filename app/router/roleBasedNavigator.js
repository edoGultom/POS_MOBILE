import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import BottomNavigator from '../component/BottomNavigator';
import { Admin, AdminMenu, Home, Order, Profile, SignIn, SignUp, SplashScreen, SuccessSignUp } from '../screens';
import { useRole } from '../utils/roles';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
    return (
        <Tab.Navigator
            tabBar={props => <BottomNavigator {...props} />}
        >
            <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Tab.Screen name="Order" component={Order} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        </Tab.Navigator>
    )
}
const RoleBasedNavigator = () => {
    const { roles } = useRole();
    return (
        <Stack.Navigator initialRouteName="Splash">
            {/* <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{ headerShown: false }}
            /> */}
            {/*        
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SuccessSignUp"
                component={SuccessSignUp}
                options={{ headerShown: false }}
            /> */}
            {/* <Stack.Screen
                name="Admin"
                component={Admin}
                options={{ headerShown: false }}
            /> */}
            <Stack.Screen
                name="AdminMenu"
                component={AdminMenu}
                options={{ headerShown: false }}
            />

            <Stack.Screen name="MainApp" component={MainApp} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default RoleBasedNavigator;
const styles = StyleSheet.create({
    tabBarStyle: {
        height: 80,
        position: 'absolute',
        backgroundColor: 'red',
        borderTopWidth: 0,
        elevation: 0,
        borderTopColor: 'transparent',
    },
});