// SplashScreen.js
import React from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Treggoico.png')} // Asegúrate de que esta ruta sea correcta
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#fff" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#006d6d', // fondo principal de Treggo
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
  },
  loader: {
    marginTop: 30,
  },
});
