// src/hooks/useNetworkToast.js
import { useEffect } from 'react';
import * as Network from 'expo-network';
import Toast from 'react-native-toast-message';

export function useNetworkToast() {
  useEffect(() => {
    const check = async () => {
      const state = await Network.getNetworkStateAsync();
      if (!state.isConnected) {
        Toast.show({
          type: 'error',
          text1: 'Sin conexión a internet',
          text2: 'Revisa tu conexión.',
          position: 'top',
        });
      }
    };

    check();

    const subscription = Network.addNetworkStateListener((state) => {
      if (!state.isConnected) {
        Toast.show({
          type: 'error',
          text1: 'Sin conexión a internet',
          text2: 'Revisa tu conexión.',
          position: 'top',
        });
      }
    });

    return () => {
      subscription && subscription.remove();
    };
  }, []);
}
