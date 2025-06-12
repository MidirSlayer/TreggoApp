// src/navigation/CustomDrawer.js
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { clearSession } from '../services/session';

export default function CustomDrawer(props) {
  async function cerrarSesion() {
    Alert.alert('Cerrar sesión', '¿Deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí',
        style: 'destructive',
        onPress: async () => {
          await clearSession();
          props.navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <DrawerItemList {...props} />

      <View style={styles.footer}>
        <DrawerItem
          label="Cerrar sesión"
          onPress={cerrarSesion}
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});
