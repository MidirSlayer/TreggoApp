// src/screens/HomeScreen.js
import React, { useEffect, useState, useLayoutEffect} from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator} from 'react-native';
import { clearSession, getSession } from '../services/session';
import * as Location from 'expo-location'
import { obtenerTrabajos, obtenerTiposTrabajo} from '../services/supabase';
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing, fonts, borderRadius } from '../theme';
import Texto from '../components/Text';
import Filtros from '../components/Filtros';
import TrabajoCard from '../components/TrabajoCard';


export default function HomeScreen({navigation}) {
    const [todosLosTrabajos, setTodosLosTrabajos] = useState([]);
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

               setTipoActivo('Todos')

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
        cargarTipos();
    }, []);

        useEffect(() => {
        if (!todosLosTrabajos || todosLosTrabajos.length === 0) return;

        if (tipoActivo === 'Todos') {
            setTrabajos(todosLosTrabajos);
        } else {
            const filtrados = todosLosTrabajos.filter((t) => tipoActivo === 'Todos' ? true : t.tipo === tipoActivo);
            setTrabajos(filtrados);
        }
        }, [tipoActivo, todosLosTrabajos]);

    
     if (cargando) return <ActivityIndicator style={{flex: 1}} />
     if(error) return <Texto>Error</Texto>
    
    return(
        <>
        <Filtros
            tipos={tipos}
            activo={tipoActivo}
            onSelect={(tipo) => setTipoActivo(tipo)}
        />

        <FlatList
            data={trabajos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (<TrabajoCard trabajo={item} onPress={(t) => navigation.navigate('DetalleTrabajo', {trabajo: t}) } />)}
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