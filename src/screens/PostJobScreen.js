import React, { useState} from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';

const JOB_TYPES = ['Construcción', 'Carpintería', 'Soldadura', 'Salud'];

export default function PostJobScreen () {
    const [tipo, setTipo] = useState(JOB_TYPES[0]);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('')

    const handleSubmit = () => {
        if (!titulo || !descripcion) {
            Alert.alert('Campos requeridos', 'Completa los campos');
            return;
        }

        const job = {
            tipo,
            titulo,
            descripcion,
            fecha: new Date().toISOString()
        };

        console.log('Servicio publicado', job);
        Alert.alert('Exito', 'Tu servicio ha sido publicado')

        setTitulo('')
        setDescripcion('')
        setTipo(JOB_TYPES[0])
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Tipo de trabajo:</Text>
            <Picker 
                selectedValue={tipo}
                onValueChange={setTipo}
                style={styles.input}
            >
                {JOB_TYPES.map((jobType) => (
                    <Picker.Item key={jobType} label={jobType} value={jobType} />
                ))}
            </Picker>

            <Text style={styles.label}>Titulo:</Text>
            <TextInput
                style={styles.input}
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Ej. Arreglo de puerta"
            />

            <Text style={styles.label}>Descripcion:</Text>
            <TextInput 
                style={[styles.input, styles.textArea]}
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
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});