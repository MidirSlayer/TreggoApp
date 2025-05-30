import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Home"
                component={HomeScreen}
                options={{title: 'Inicio'}}
            />
        <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{title: 'Login'}}
        />
        </Stack.Navigator>
    );
}