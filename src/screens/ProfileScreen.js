import React, {useEffect, useState, useLayoutEffect, use, act} from "react";
import { View, FlatList, StyleSheet, Alert, TouchableOpacity} from "react-native";
import { getSession } from "../services/session";
import { obtenerMisTrabajos } from "../services/supabase";
import { actualizarPerfil, crearPerfil, obtenerPerfil } from "../services/perfil";
import { Ionicons } from '@expo/vector-icons'
import PerfilForm from "../components/PerfilForm";
import { subirImagenPerfil } from "../services/storage";
import TrabajoCard from "../components/TrabajoCard";
import Texto from "../components/Text";
import Button from "../components/Button";
import { useBackHandler } from '@react-native-community/hooks';


export default function ProfileScreen({navigation}) {
    const [user,setUser] = useState(null)
    const [trabajos,setTrabajos] = useState([]);
    const [modoEditar, setModoEditar] = useState(false);
    const [perfil, setPerfil] = useState(null);


    useEffect(() => {
        async function cargarPerfil() {
            const session = await getSession();
            setUser(session.user);

            const misTrabajos = await obtenerMisTrabajos(session.user.id)
            setTrabajos(misTrabajos)

        }

        cargarPerfil();
    }, []);

    useBackHandler(() => {
        if(modoEditar) {
            setModoEditar(false);
            return true;
        }

        return false;
    });

    async function cargarDatos () {

        const datos = await obtenerPerfil(user.id);
        setPerfil(datos || {});
        setModoEditar(true);
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={cargarDatos} style={{marginRight: 16}}>
                    <Ionicons name="person-add" size={24} color="#007AFF" />
                </TouchableOpacity>
            )
        })
    }, [navigation, user])

    if (!user) return <Texto>Cargando...</Texto>

    if (modoEditar) {
        return (
            <PerfilForm
            initialData={perfil}
            onSubmit={async (datos) => {

                console.log('datos recibidos', datos)
                let urlFinal = datos.avatar_url;

                if (datos.avatar_url?.startsWith('file')) {
                    urlFinal = await subirImagenPerfil(datos.avatar_url, user.id);
                }

                const datosFinales = {...datos, avatar_url: urlFinal};
                const yaTienePerfil = perfil && Object.keys(perfil).length > 0;

                if (yaTienePerfil) {
                    await actualizarPerfil(user.id, datosFinales);
                    Alert.alert('Perfil actializado')
                } else {
                    await crearPerfil(user.id, datosFinales);
                    Alert.alert('perfil creado')
                }

                setModoEditar(false)
            }}
        />
        )
    }

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

            <Button
                title="Recargar saldo"
                onPress={() => navigation.navigate('RecargarSaldo')}
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