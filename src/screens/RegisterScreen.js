import React, { useState} from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { singUp } from "../services/supabase";

export default function RegisterScreen({ navigation }) {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const handleRegister = async () => {
        try {
            const user = await singUp(email, password);
            console.log('Registrado', user);
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <TextInput
                placeholder="Email"
                style={styles.input}
                autoCapitalize="none"
                 keyboardType="email-address"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput 
                placeholder="Contraseña"
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
               
                onChangeText={setPassword}
                value={password}
            />

            <Button title=" Registrarse" onPress={handleRegister} />
            <Text style={ styles.link} onPress={() => navigation.navigate('Login')} >¿Ya tienes cuenta? Inicia Sesion</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20 
    },
  title: { 
    fontSize: 24, 
    marginBottom: 20, 
    textAlign: 'center' 
    },
  input: { 
    borderWidth: 1,
     padding: 10, 
     marginBottom: 15, 
     borderRadius: 5 
    },
  link: { 
    color: 'blue',
     marginTop: 15, 
     textAlign: 'center' 
    },
});