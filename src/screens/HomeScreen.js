// src/screens/HomeScreen.js
import React, { useEffect, useState, useLayoutEffect} from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator} from 'react-native';
import { clearSession, getSession } from '../services/session';
import * as Location from 'expo-location'
import { obtenerTrabajos, obtenerTiposTrabajo} from '../services/supabase';
import { obtenerPerfil } from '../services/perfil';
import { colors, spacing, fonts, borderRadius } from '../theme';
import Texto from '../components/Text';
import TrabajoCard from '../components/TrabajoCard';
import {useNetworkToast} from '../hooks/useNetworkToast';
import SelectCategoria from '../components/SelectCategoria';


export default function HomeScreen({navigation}) {
    useNetworkToast();
    const [todosLosTrabajos, setTodosLosTrabajos] = useState([]);
    const [trabajos, setTrabajos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [tipoActivo, setTipoActivo] = useState(null);
    const [subtipoActivo, setSubtipoActivo] = useState(null)
    const [usuarioId, setUsuarioId] = useState(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Trabajos disponibles"
        })
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
               // if (tipoActivo) { trabajosFiltrados = trabajosFiltrados.filter((t) => t.tipo === tipoActivo)}

              const trabajosConDistancia = await Promise.all(
                trabajosFiltrados.map(async (t) => {
                    const distancia = calcularDistancia(
                    loc.coords.latitude,
                    loc.coords.longitude,
                    t.lat,
                    t.lon
                    );

                    const perfil = await obtenerPerfil(t.user_id);
                    const avatar_url = perfil?.avatar_url ?? null;

                    return { ...t, distancia, avatar_url }; 
                })
                );


                trabajosConDistancia.sort((a, b) => a.distancia - b.distancia);
                setTodosLosTrabajos(trabajosConDistancia);
                setTrabajos(trabajosConDistancia); // ← este es el que se filtrará

            } catch (e) {
                setError('Error al cargar Trabajos');
                console.log(e);
            } finally {
                setCargando(false);
            }
        }

        cargarTrabajos(); 
    }, []);

        useEffect(() => {

        console.log('Tipo activo (nombre):', tipoActivo?.nombre);
        console.log('Subtipo activo (nombre):', subtipoActivo?.nombre);
        console.log('Tipos únicos en trabajos:', [...new Set(todosLosTrabajos.map(t => t.tipo))]);
        if (!todosLosTrabajos || todosLosTrabajos.length === 0) return;

            let filtrados = [...todosLosTrabajos]

        if (tipoActivo?.nombre)  {
             filtrados = filtrados.filter(t => t.tipo.toLowerCase() === tipoActivo.nombre.toLowerCase());
             console.log( 'filtrados',tipoActivo.nombre)
        }

        if (subtipoActivo?.nombre) {
            filtrados= filtrados.filter(t => t.subtipo?.toLowerCase() === subtipoActivo.nombre.toLowerCase())
        }
        setTrabajos(filtrados)
        }, [tipoActivo, subtipoActivo, todosLosTrabajos]);

    
     if (cargando) return <ActivityIndicator style={{flex: 1}} />
     if(error) return <Texto>Error</Texto>
    
    return(
        <SafeAreaView style={{flex: 1}}>
        <SelectCategoria
            onChange={({categoria, subcategoria}) => {
                //console.log('categoria', categoria, 'sub', subcategoria)
                setTipoActivo(categoria);
                setSubtipoActivo(subcategoria || null)
            }}
        />

        <FlatList
            data={trabajos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (<TrabajoCard trabajo={item} onPress={(t) => navigation.navigate('DetalleTrabajo', {trabajo: t}) } />)}
        />
        </SafeAreaView>
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
  titulo: {
    ...fonts.title,
  },
  subtitulo: {
    ...fonts.muted,
  },
empty: {
  textoAlign: 'center',
  marginTop: 50,
  fontSize: 16,
  color: '#888',
},
});