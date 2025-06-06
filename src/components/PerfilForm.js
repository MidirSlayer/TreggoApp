import React, { useState, useEffect} from "react";
import { View, TextInput, Button, Text, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';

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
                {avatar ? (
                    <Image source={{uri: avatar}} style={{width: 100, height: 100, borderRadius: 50}} />

                ) : ( <View style={{width: 100, height: 100, backgroundColor: '#ccc', borderRadius: 50, justifyContent: 'center', alignItems: 'center'}}>
                   <Text>Foto</Text> 
                </View>)
            }
            </TouchableOpacity>

            <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={{marginVertical: 8}} />
            <TextInput placeholder="Telefono" value={telefono} onChangeText={setTelefono} style={{marginVertical: 8}} />
            <TextInput placeholder="Ciudad" value={ciudad} onChangeText={setCiudad} style={{marginVertical: 8}}/>
            <Button title="Guardar" onPress={guardar}/>
        </View>
    );
}