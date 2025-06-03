import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import PlaceholderScreen from "../screens/PlaceholderScreen";
import PostJobScreen from "../screens/PostJobScreen";
import { Ionicons } from '@expo/vector-icons'
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs () {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({color, size}) => {
                    let iconName;

                    if(route.name === 'Inicio') {
                        iconName = 'home-outline';
                    } else if (route.name === 'Publicar') {
                        iconName = 'add-circle-outline'
                    } else if (route.name === 'Perfil') {
                        iconName = 'person-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                },

                tabBarActiveTintColor: '#007aff',
                tabBarInactiveTintColor: 'gray'
            })}
            >
            <Tab.Screen name="Inicio" component={HomeScreen} />
            <Tab.Screen name= "Publicar" component={PostJobScreen} />
            <Tab.Screen name="Buscar" component={PlaceholderScreen} />
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    )
}