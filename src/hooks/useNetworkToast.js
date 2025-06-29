import { useEffect } from "react";
import * as Network from 'expo-network'
import Toast from "react-native-root-toast";

export default function useNetworkToast() {
    useEffect(() => {
        let interval;

        async function checkConnection() {
            try {
                const status = await Network.getNetworkStateAsync();
                const isConnected = status.isConnected && status.isInternetReachable !== false;

                if (!isConnected) {
                    Toast.show('❌ Sin conexión a internet', {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.BOTTOM,
                        shadow: true, 
                        animation: true,
                        hideOnPress: true,
                        backgroundColor: '#333'
                    });
                }
            } catch (error) {
                console.log('⚠️ Error al verificar red', error)
            }
        }
        interval = setInterval(checkConnection, 5000);

        checkConnection();

        return () => clearInterval(interval)
    }, []);
}