import React, {useEffect, useState} from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getSession } from "../services/session";
import { obtenerMisTrabajos } from "../services/supabase";

export default function ProfileScreen() {
    const [user,setUser] = useState(null)
    const [trabajos,setTrabajos] = useState([]);

    useEffect(() => {
        async function cargarPerfil() {
            const session = await getSession();
            setUser(session.user);

            const misTrabajos = await obtenerMisTrabajos(session.user.id)
            setTrabajos(misTrabajos)
        }

        cargarPerfil();
    }, []);

    if (!user) return <Text>Cargando...</Text>

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Hola, {user.email}</Text>
            <Text style={styles.subtitulo}>Tus trabajos publicados:</Text>

            <FlatList
                data={trabajos}
                keyExtractor={(item => item.id)}
                renderItem={({item}) => (
                    <View style={styles.card}>
                    <Text style={styles.cardTitulo}>{item.titulo}</Text>
                    <Text>{item.tipo}</Text>
                    <Text>{new Date(item.fecha).toLocaleDateString()}</Text>
                </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No hay publicaciones</Text>}
            />
        </View>
    )
    
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitulo: { fontSize: 16, marginBottom: 12 },
  card: {
    backgroundColor: '#eee',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  cardTitulo: { fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' },
});