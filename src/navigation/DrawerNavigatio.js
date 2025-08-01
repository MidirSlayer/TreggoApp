import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainTabs from "./MainTabs";
import RecargarSaldoScreen from "../screens/RecargarSaldoScreen";
import { Ionicons } from '@expo/vector-icons'
import PerfilEditorScreen from "../screens/PerfilEditorScreen";
import CustomDrawer from "./CustomDrawer";
import { colors } from "../theme";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator () {
    return (
        <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: true,
                drawerActiveTintColor: colors.primary,
                drawerLabelStyle: { fontSize:16}
            }}
        >
            <Drawer.Screen
                name="Trabajos"
                component={MainTabs}
                options={{
                    drawerLabel: 'Inicio',
                    drawerIcon: ({color, size}) => (
                        <Ionicons name='home-outline' size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Recargar saldo"
                component={RecargarSaldoScreen}
                options={{
                drawerIcon: ({ color, size }) => (
                    <Ionicons name="wallet-outline" size={size} color={color} />
                ),
                }}
            />
            <Drawer.Screen
                name="Perfil"
                component={PerfilEditorScreen}
                options={{
                    drawerLabel: 'Perfil',
                    drawerIcon: ({color, size}) => (
                        <Ionicons name='create-outline' size={size} color={color} />
                    )
                }}
            />
        </Drawer.Navigator>
        
    )
}