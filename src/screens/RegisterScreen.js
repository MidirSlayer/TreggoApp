import React, { useState} from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { singUp } from "../services/supabase";
import PerfilForm from "../components/PerfilForm";
import { actualizarPerfil, crearPerfil } from "../services/perfil";
import { subirImagenRegistro } from "../services/storage";
 
export default function RegisterScreen({ navigation }) {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [modeCreator, setModeCreator] = useState(false);
    const [id, setId] = useState()
    const [access_token, setAcces_token] = useState()
    const [confirm, setConfirm] = useState('');

    const handleRegister = async () => {
        try {
            if (!email || !password || !confirm) {
                Alert.alert('Campos incompletos', 'Por favor, completa todos los campos.');
                return;
                }

                if (!email.includes('@') || !email.includes('.')) {
                Alert.alert('Email inválido', 'Ingresa un email válido.');
                return;
                }

                if (password !== confirm) {
                Alert.alert('Contraseñas no coinciden', 'Verifica que ambas contraseñas sean iguales.');
                return;
                }

                if (password.length < 6) {
                Alert.alert('Contraseña débil', 'Debe tener al menos 6 caracteres.');
                return;
                }

            const user = await singUp(email, password);
            console.log (user.user.id)
            console.log('Registrado', user);
            setAcces_token(user.access_token)
            setId(user.user.id)
            setModeCreator(true)
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }

    if (modeCreator) { 
        return (
            <View style={{flex: 1, justifyContent: 'space-around'}}>
            <PerfilForm
                onSubmit={async (datos) => {

                      const url = await subirImagenRegistro (datos.avatar_url, id, access_token)
                        console.log('✅ Imagen subida desde registro');
                    
                    const datosFinales = { ...datos, avatar_url: url };

                    await crearPerfil(id, datosFinales);
                    Alert.alert('Perfil creado');
                    setModeCreator(false);
                    navigation.replace('Login');
                }}
            />
            </View>
        )
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

             <TextInput 
                placeholder=" Confirmar Contraseña"
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
               
                onChangeText={setConfirm}
                value={confirm}
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