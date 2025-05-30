// src/screens/HomeScreen.js
import React, { useEffect, useState} from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, SafeAreaView} from 'react-native';
import { clearSession } from '../services/session';
import * as Location from 'expo-location'

const JOB_TYPES = ['Todos', 'Construcción', 'Carpintería', 'Soldadura', 'Salud'];

const mockJobs = [
  { id: '1', tipo: 'Carpintería', titulo: 'Reparar muebles', lat: 19.43, lon: -99.13 },
  { id: '2', tipo: 'Salud', titulo: 'Consulta médica a domicilio', lat: 19.44, lon: -99.15 },
  { id: '3', tipo: 'Soldadura', titulo: 'Soldar portón', lat: 19.45, lon: -99.14 },
];

export default function HomeScreen() {
    const [location, setLocation] = useState(null);
    const [selectedType, setSelectedType] = useState('Todos');
    const [filteredJobs, setFilteredJobs] = useState([])

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            const loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);

            console.log('Ubicacion actual', location)
        })();
    },[]);

    useEffect(() => {
        if(!location) return;

        const calculateDistance = (job) => {
            const dx = job.lat - location.latitude;
            const dy = job.lon - location.longitude;
            return Math.sqrt(dx * dx + dy * dy);       
        };

        const jobs = mockJobs
        .filter((job) => selectedType === 'Todos' || job.tipo === selectedType)
        .map((job) => ({...job, distancia: calculateDistance(job) }))
        .sort((a,b) => a.distancia - b.distancia);

        setFilteredJobs(jobs);

        console.log('Trabajos filtrados', filteredJobs)
    },[selectedType, location])

    const renderJob = ({item}) => {
        return (
            <View style={styles.card}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text>{item.tipo} - Distancia aprox: {item.distancia.toFixed(2)}</Text>
        </View>
        )
    }

    return(
        <View style={styles.container}>
            <View style={styles.filtros}>
                {JOB_TYPES.map((tipo) => (
                    <TouchableOpacity 
                        key={tipo}
                        style={[styles.filtro, selectedType === tipo && styles.filtroActivo]}
                        onPress={() => setSelectedType(tipo)}
                        >
                            <Text>{tipo}</Text>
                        </TouchableOpacity>
                ))}
            </View>

           <SafeAreaView>
             <FlatList
            data={filteredJobs}
            keyExtractor={(item) => item.id}
            renderItem={renderJob}
            contentContainerStyle={styles.lista}
            ListEmptyComponent={<Text style={styles.empty}>No hay trabajos disponibles</Text>}
            />
           </SafeAreaView>

            </View>
    );
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

});