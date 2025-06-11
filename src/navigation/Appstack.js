import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import MainTabs from "./MainTabs";
import RegisterScreen from "../screens/RegisterScreen";
import DetalleTrabajoScreen from "../screens/DetalleTrabajoScreen";
import RecargarSaldoScreen from "../screens/RecargarSaldoScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Main" component={MainTabs} />
        
        <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{title: 'Login'}}
        />

        <Stack.Screen name="Register" component={RegisterScreen} />

        <Stack.Screen name="DetalleTrabajo" component={DetalleTrabajoScreen} />

        <Stack.Screen name="RecargarSaldo" component={RecargarSaldoScreen} />
        </Stack.Navigator>
    );
}