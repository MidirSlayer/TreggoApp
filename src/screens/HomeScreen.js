// src/screens/HomeScreen.js
import React, { useEffect, useState, useLayoutEffect} from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator} from 'react-native';
import { clearSession, getSession } from '../services/session';
import * as Location from 'expo-location'
import { obtenerTrabajos, obtenerTiposTrabajo} from '../services/supabase';
import { Ionicons } from '@expo/vector-icons'


export default function HomeScreen({navigation}) {
    const [trabajos, setTrabajos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [tipos, setTipos] = useState([])
    const [tipoActivo, setTipoActivo] = useState(null);
    const [usuarioId, setUsuarioId] = useState(null);

    useEffect(() => {
        async function cargarTipos() {
            try {
                const data = await obtenerTiposTrabajo();
                setTipos(data.map((t) => t.nombre));
            } catch (e){
                console.error('Error al consegir tipos', e);
            }
        }

        cargarTipos();
    }, []);

    async function cerrarSesion() {
        await clearSession();
        navigation.reset({
            index: 0,
            routes: [{name: 'Login'}]
        });
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={cerrarSesion} style={{marginRight: 16}}>
                    <Ionicons name="log-out-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
            )
        });
    }, [navigation])

    useEffect(() => {
        async function cargarTrabajos() {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted' ) {
                    setError('permisis de ubicacion denegados');
                    return
                }

                const session = await getSession();
                const miUserId = session?.user?.id;
                setUsuarioId(miUserId);


                const  loc = await Location.getCurrentPositionAsync({});
                const trabajos = await obtenerTrabajos();
                console.log('Trabajos obtenidos:', trabajos);

                let trabajosFiltrados = trabajos.filter((t) => t.user_id !== miUserId);
                if (tipoActivo) { trabajosFiltrados = trabajosFiltrados.filter((t) => t.tipo === tipoActivo)}

                const trabajosConDistancia = trabajosFiltrados.map((t) => {
                    const distancia = calcularDistancia(
                        loc.coords.latitude,
                        loc.coords.longitude,
                        t.lat,
                        t.lon
                    );
                    return {...t, distancia };
                });

                trabajosConDistancia.sort((a, b) => a.distancia - b.distancia);
                setTrabajos(trabajosConDistancia);
            } catch (e) {
                setError('Error al cargar Trabajos');
                console.log(e);
            } finally {
                setCargando(false);
            }
        }

        cargarTrabajos();
    },[]);
    
     if (cargando) return <ActivityIndicator style={{flex: 1}} />
     if(error) return <Text>Error</Text>
    
    return(
        <>
        <View style={styles.filtros}>
            {tipos.map((tipo) => (
                <TouchableOpacity
                    key={tipo}
                    style={[styles.filtro, tipoActivo === tipo && styles.filtroActivo]}
                    onPress={() => setTipoActivo((prev) => (prev === tipo ? null : tipo))}
                >
                    <Text >{tipo}</Text>
                </TouchableOpacity>
            ))}
        </View>
         <FlatList
            data={trabajos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <View style={styles.card}>
                <Text style={styles.titulo}>{item.titulo}</Text>
                <Text>{item.tipo} - Distancia: {item.distancia.toFixed(2)} km</Text>
            </View>
        )}

        />
        </>
    );
}

 function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; //el radio de la tierra
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) **2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
 }

 function toRad(grados) {
    return (grados * Math.PI) / 180;
 }


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  filtros: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, gap: 8 },
  filtro: { backgroundColor: '#eee', padding: 8, borderRadius: 8 },
  filtroActivo: { backgroundColor: '#cceeff' },
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  titulo: { fontSize: 18, fontWeight: 'bold' },
  lista: {
  paddingBottom: 100,
},

empty: {
  textAlign: 'center',
  marginTop: 50,
  fontSize: 16,
  color: '#888',
},
card: {
    backgroundColor: '#f0f0f0',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 16,
  },

});