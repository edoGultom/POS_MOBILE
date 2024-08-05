import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import AdminBottomNavigator from '../component/AdminBottomNavigator';
import UserBottomNavigator from '../component/UserBottomNavigator';
import { Admin, AdminHistory, AdminMenu, AdminStock, Orders, PosMenu, PosOrder, Profile, SignIn, SignUp, SplashScreen, SuccessOrder, SuccessSignUp } from '../screens';
import AdminDetailStock from '../screens/AdminDetailStock';
import AdminIngridients from '../screens/AdminIngridients';
import AdminMenuIngridients from '../screens/AdminMenuIngridients';
import AdminOrder from '../screens/AdminOrder';
import AdminReport from '../screens/AdminReport';
import AdminTable from '../screens/AdminTable';
import ChefHome from '../screens/ChefHome';
import PosTable from '../screens/PosTable';
import SuccessPaymentCash from '../screens/SuccessPaymentCash';
import { useRole } from '../utils/roles';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainAppUser = () => {
    return (
        <Tab.Navigator
            tabBar={props => <UserBottomNavigator {...props} />}
        >
            <Tab.Screen name="PosTable" component={PosTable} options={{ headerShown: false }} />
            <Tab.Screen name="PosMenu" component={PosMenu} options={{ headerShown: false }} />
            {/* <Tab.Screen name="Order" component={Order} options={{ headerShown: false, tabBarVisible: false }} /> */}
            <Tab.Screen name="Orders" component={Orders} options={{ headerShown: false }} />
            <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
        </Tab.Navigator>
    )
}
// const MainAppChef = () => {
//     return (
//         <Tab.Navigator
//             tabBar={props => <UserBottomNavigator {...props} />}
//         >
//             <Tab.Screen name="ChefHome" component={Home} options={{ headerShown: false }} />
//         </Tab.Navigator>
//     )
// }
const MainAppAdmin = () => {
    return (
        <Tab.Navigator
            tabBar={props => <AdminBottomNavigator {...props} />}
        // screenOptions={{
        //     header: (props) => <Text>sdsdsds</Text>,
        // }}
        >
            <Tab.Screen name="PosTable" component={PosTable} options={{ headerShown: false }} />
            <Tab.Screen name="PosMenu" component={PosMenu} options={{ headerShown: false }} />
            <Tab.Screen name="Orders" component={Orders} options={{ headerShown: false }} />
        </Tab.Navigator>
    )
}
const RoleBasedNavigator = () => {
    const { roles } = useRole();
    // console.log(roles, 'roles')
    return (
        <Stack.Navigator
            initialRouteName="SplashScreen"
        // screenOptions={{
        //     header: (props) => <CustomHeader title={props.scene.route.name} />,
        // }}
        >

            <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SuccessSignUp"
                component={SuccessSignUp}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SuccessOrder"
                component={SuccessOrder}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SuccessPaymentCash"
                component={SuccessPaymentCash}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Admin"
                component={Admin}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AdminMenu"
                component={AdminMenu}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AdminTable"
                component={AdminTable}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AdminIngridients"
                component={AdminIngridients}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AdminMenuIngridients"
                component={AdminMenuIngridients}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="AdminReport"
                component={AdminReport}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AdminStock"
                component={AdminStock}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AdminDetailStock"
                component={AdminDetailStock}
                options={{ headerShown: false, }}
            />
            <Stack.Screen
                name="AdminHistory"
                component={AdminHistory}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AdminOrder"
                component={AdminOrder}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PosMenu"
                component={PosMenu}
                options={{ headerShown: false, }}
            />
            <Stack.Screen
                name="PosOrder"
                component={PosOrder}
                options={{ headerShown: false, }}
            />
            <Stack.Screen name="MainAppAdmin" component={MainAppAdmin} options={{ headerShown: false }} />
            {/* <Stack.Screen name="MainAppChef" component={MainAppChef} options={{ headerShown: false }} /> */}
            <Stack.Screen name="MainAppUser" component={MainAppUser} options={{ headerShown: false }} />

            <Stack.Screen
                name="ChefHome"
                component={ChefHome}
                options={{ headerShown: false, }}
            />
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