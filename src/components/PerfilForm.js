import React, { useState, useEffect} from "react";
import { View, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Input from "./Input";
import Button from "./Button";
import Avatar from "./Avatar";
import Texto from "./Text";

export default function PerfilForm({ initialData = {}, onSubmit}) {
    const [nombre, setNombre] = useState(initialData.nombre || '');
    const [telefono, setTelefono] = useState(initialData.telefono || '');
    const [ciudad, setCiudad] = useState(initialData.ciudad || '');
    const [avatar, setAvatar] = useState(initialData.avatar_url || null);

    async function elegirFoto() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1,1],
            quality: 0.5

        });

        if (!result.canceled && result.assets?.length > 0) {
            setAvatar(result.assets[0].uri);
            console.log('✅ Imagen seleccionada:', result.assets[0].uri);
        } else {
            console.log('❌ Imagen cancelada');
        }

    }

    function guardar () {
        onSubmit({nombre, telefono, ciudad, avatar_url: avatar});
    }

    return ( 
        <View>
            <TouchableOpacity onPress={elegirFoto}>
                   <Avatar uri={avatar} />
            </TouchableOpacity>
            <Texto type="subtitle"> Nombre</Texto>
            <Input placeholder="Nombre" value={nombre} onChangeText={setNombre} style={{marginVertical: 8}} />
            <Texto type="subtitle"> Numero de telefono</Texto>
            <Input placeholder="Telefono" value={telefono} onChangeText={setTelefono} style={{marginVertical: 8}} />
            <Texto type="subtitle"> Ciudad</Texto>
            <Input placeholder="Ciudad" value={ciudad} onChangeText={setCiudad} style={{marginVertical: 8}}/>
            <Button title="Guardar" onPress={guardar}/>
        </View>
    );
}