import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import PlaceholderScreen from "../screens/PlaceholderScreen";
import PostJobScreen from "../screens/PostJobScreen";
import { Ionicons } from '@expo/vector-icons'
import ProfileScreen from "../screens/ProfileScreen";
import { colors } from "../theme";

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

                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: 'gray',
                headerShown: false
            })}
            >
            <Tab.Screen name="Inicio" component={HomeScreen} />
            <Tab.Screen name= "Publicar" component={PostJobScreen} />
            
            <Tab.Screen name="Perfil" component={ProfileScreen} />
        </Tab.Navigator>
    )
}