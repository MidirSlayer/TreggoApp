import React, {useEffect, useState} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, FlatList, StyleSheet} from "react-native";
import { getSession } from "../services/session";
import { obtenerMisTrabajos } from "../services/supabase";
import TrabajoCard from "../components/TrabajoCard";
import Texto from "../components/Text";

export default function ProfileScreen({navigation}) {
    const [user,setUser] = useState(null)
    const [trabajos,setTrabajos] = useState([]);
    const [modoEditar, setModoEditar] = useState(false);
    const [perfil, setPerfil] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
        async function cargarPerfil() {
            const session = await getSession();
            setUser(session.user);

            const misTrabajos = await obtenerMisTrabajos(session.user.id)
            setTrabajos(misTrabajos)

        }
        cargarPerfil();
    }, [])
    )
    

    if (!user) return <Texto>Cargando...</Texto>

    return (
        <View style={styles.container}>

            <Texto type="title">Hola, {user.email}</Texto>
            <Texto type="subtitle">Tus trabajos publicados:</Texto>

            <FlatList
                data={trabajos}
                keyExtractor={(item => item.id)}
                renderItem={({item}) => (
                    <TrabajoCard trabajo={item} />
                )}
                ListEmptyComponent={<Texto type="muted">No hay publicaciones</Texto>}
            />
        </View>
    )
    
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitulo: { fontSize: 16, marginBottom: 12 },
  cardTitulo: { fontWeight: 'bold' },
  empty: { textoTextoAlign: 'center', marginTop: 50, color: '#999' },
});