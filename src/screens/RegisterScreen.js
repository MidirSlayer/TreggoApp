import React, { useState} from "react";
import { View, Alert, StyleSheet, Image } from "react-native";
import { singUp } from "../services/supabase";
import PerfilForm from "../components/PerfilForm";
import { actualizarPerfil, crearPerfil } from "../services/perfil";
import { subirImagenRegistro } from "../services/storage";
import Input from "../components/Input";
import Button from "../components/Button";
import Texto from "../components/Text";
 
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

    return (
        <View style={styles.container}>
            <View style={{alignItems: 'center',}}>
                <Image source={require('../../assets/Treggo.png')} style={{width: 500, height: 150, marginTop: -200}}/>
            </View>

            <Texto style={styles.title}>Crear Cuenta</Texto>
            <Input
                placeholder="Email"
                autoCapitalize="none"
                 keyboardType="email-address"
                onChangeText={setEmail}
                value={email}
            />
            <Input 
                placeholder="Contraseña"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={setPassword}
                value={password}
            />

             <Input 
                placeholder=" Confirmar Contraseña"
                secureTextEntry
                autoCapitalize="none"
               
                onChangeText={setConfirm}
                value={confirm}
            />

            <Button title=" Registrarse" onPress={handleRegister} />
            <Texto style={ styles.link} onPress={() => navigation.navigate('Login')} >¿Ya tienes cuenta? Inicia Sesion</Texto>
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
  link: { 
    color: 'blue',
     marginTop: 15, 
     textAlign: 'center' 
    },
});