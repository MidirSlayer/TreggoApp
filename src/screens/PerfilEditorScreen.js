import React, { useState, useEffect} from "react";
import { View,  Alert } from "react-native";
import PerfilForm from '../components/PerfilForm';
import { getSession } from '../services/session';
import { obtenerPerfil, actualizarPerfil, crearPerfil } from '../services/perfil';
import { subirImagenPerfil } from "../services/storage";
import Toast from "react-native-toast-message";

export default function PerfilEditorScreen ({navigation}) {
    const [perfil, setPerfil] = useState({});
    const [userId, setUserId] = useState();

    useEffect(() => {
        async function cargar() {
            const session = await getSession();
            if (!session) return;
      
            const datos = await obtenerPerfil(session.user.id);
            setPerfil(datos || {})
            setUserId(session.user.id)
            console.log(userId)
        }
        cargar();
    }, []);

    if (!userId) return null;

    return (
        <View style={{padding: 16}}>
            <PerfilForm
                initialData={perfil}
                onSubmit={async (datos) => {
                
                    let urlFinal = datos.avatar_url

                if (datos.avatar_url?.startsWith('file')) {
                    urlFinal = await subirImagenPerfil(datos.avatar_url, userId);
                }

                const datosFinales = {...datos, avatar_url: urlFinal};
                const yaTienePerfil = perfil && Object.keys(perfil).length > 0;

                console.log('datos recibidos', datosFinales)

                if (yaTienePerfil) {
                    await actualizarPerfil(userId, datosFinales);
                    Toast.show({
                    type: 'success',
                    text1: 'Perfil Actualizado', 
                    position: 'top',
                    })
                    navigation.replace('Main')

                } else {
                    await crearPerfil(userId, datosFinales);
                    Toast.show({
                    type: 'success',
                    text1: 'Perfil Creado', 
                    position: 'top',
                    })
                navigation.replace('Main')
                }
                }}
            />
        </View>
    );
}