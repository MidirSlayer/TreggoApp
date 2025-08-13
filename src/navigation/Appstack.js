import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OffertScreen from "../screens/OfertasScreen";
import LoginScreen from "../screens/LoginScreen";
import DrawerNavigator from "./DrawerNavigatio";
import RegisterScreen from "../screens/RegisterScreen";
import DetalleTrabajoScreen from "../screens/DetalleTrabajoScreen";
import RecargarSaldoScreen from "../screens/RecargarSaldoScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator >
        <Stack.Screen name="Main" component={DrawerNavigator} options={{headerShown: false}} />
        <Stack.Screen name="Login" component={LoginScreen} options={{title: 'Login', headerShown: false}}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>
        <Stack.Screen name="DetalleTrabajo" component={DetalleTrabajoScreen} options={{headerTransparent: true}}/>
        <Stack.Screen name="RecargarSaldo" component={RecargarSaldoScreen} />
        <Stack.Screen name="VerOfertas" component={OffertScreen} options={{headerTransparent: true}} />
        </Stack.Navigator>
    );
}