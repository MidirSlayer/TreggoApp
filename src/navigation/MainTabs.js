import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import PlaceholderScreen from "../screens/PlaceholderScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs () {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Inicio" component={HomeScreen} />
            <Tab.Screen name= "Publicar" component={PlaceholderScreen} />
            <Tab.Screen name="Buscar" component={PlaceholderScreen} />
            <Tab.Screen name="Perfil" component={PlaceholderScreen} />
        </Tab.Navigator>
    )
}