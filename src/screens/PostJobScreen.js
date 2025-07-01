import React, { useState, useEffect} from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { publicarTrabajos, obtenerTiposTrabajo} from "../services/supabase";
import { getSession, } from "../services/session";
import Input from "../components/Input";
import Button from "../components/Button";
import Texto from "../components/Text";
import { colors } from "../theme";
import Select from "../components/Select";
import Toast from 'react-native-toast-message'


export default function PostJobScreen () {
    const [tipo, setTipos] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('')
    const [jobTypes, setJobTypes] = useState([])

    useEffect(() => {
  async function cargarTipos() {
    try {
      const data = await obtenerTiposTrabajo();
      setJobTypes(data.map((t) => t.nombre));
    } catch (e) {
      console.error('Error al obtener tipos', e);
    }
  }

  cargarTipos();
}, []);

    const handleSubmit = async() => {
        if (!titulo || !descripcion) {
            Alert.alert('Campos requeridos', 'Completa los campos');
            console.log('Campos', {titulo, tipo, descripcion})
            return;
        }

        if (!tipo) {
            Alert.alert('Selecciona una categoria')
            return;
        }

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted' ) {
                throw new Error('Permiso de ubicacion denegado')
            }

            const session = await getSession();

            if (!session || !session.user?.id) {
                Alert.alert('Error',  'Usuarios no autenticado');
                return;
            }

            const user_id = session.user.id;

            const loc = await Location.getCurrentPositionAsync({})

            const job = {
            tipo,
            titulo,
            descripcion,
            lat: loc.coords.latitude,
            lon: loc.coords.longitude,
            fecha: new Date().toISOString(),
            user_id
            };

            
            const creado = await publicarTrabajos(job);
            console.log('Servicio publicado', job);
            //Alert.alert('Exito', 'Tu servicio ha sido publicado')
            Toast.show({
            type: 'success',
            text1: '¡Publicación exitosa!',
            text2: 'Tu servicio se ha publicado correctamente.',
            position: 'top',
            });

        

            setTitulo('')
            setDescripcion('')
            setTipos('')
        } catch (error) {
            console.log('Error al publicar', error.message);
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Texto type="subtitle">Tipo de trabajo:</Texto>
            <Select 
                selectedValue={tipo}
                onValueChange={setTipos}
                options={jobTypes}
                placeholder="Seleccione una categoria"
                style={{color: colors.text}}
            />

            <Texto type="subtitle">Titulo:</Texto>
            <Input
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Ej. Arreglo de puerta"
            />

            <Texto type="subtitle">Descripcion:</Texto>
            <Input 
                
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Escribe detalles del servicio"
                multiline
                numberOfLines={4}
            />

            <Button title="Publicar servicio" onPress={handleSubmit} />

        </View>
    )
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    textDecorationColor: 'black'
  },
  textoTextoArea: {
    height: 100,
    textoTextoAlignVertical: 'top',
  },
});