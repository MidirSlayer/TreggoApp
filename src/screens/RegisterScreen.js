import React, { useState} from "react";
import { View, Alert, StyleSheet, Image } from "react-native";
import { singUp } from "../services/supabase";
import Input from "../components/Input";
import Button from "../components/Button";
import Texto from "../components/Text";
import PerfilForm from "../components/PerfilForm";
import {crearPerfil } from "../services/perfil";
import { subirImagenRegistro } from "../services/storage";
import Toast from "react-native-toast-message";
 
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

            { modeCreator ? (
                <PerfilForm
                onSubmit={async (datos) => {
                
                let urlFinal = datos.avatar_url

                if (datos.avatar_url?.startsWith('file')) {
                    urlFinal = await subirImagenRegistro(datos.avatar_url, id, access_token);          
                }

                const datosFinales = {...datos, avatar_url: urlFinal};

                console.log('datos recibidos', datosFinales)

                await crearPerfil(id, datosFinales);
                Toast.show({
                    type: 'success',
                    text1: 'Perfil creado',
                    position: 'top',
                });
                navigation.replace('Login')
                }}
            />
            ) : (
                <View>
                    <Texto style={styles.title}>Crear Cuenta</Texto>
            <Texto type="body">Correo Electronico</Texto>
            <Input
                placeholder="Email"
                autoCapitalize="none"
                 keyboardType="email-address"
                onChangeText={setEmail}
                value={email}
            />
            <Texto type="body">Contraseña</Texto>
            <Input 
                placeholder="Contraseña"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={setPassword}
                value={password}
            />
            <Texto type="body">Confirmar contraseña</Texto>
             <Input 
                placeholder=" Confirmar Contraseña"
                secureTextEntry
                autoCapitalize="none"
               
                onChangeText={setConfirm}
                value={confirm}
            />

            <Button title=" Registrarse" onPress={handleRegister} />
            <Texto style={ styles.link} onPress={() => navigation.replace('Login')} >¿Ya tienes cuenta? Inicia Sesion</Texto>
                </View>
            )}

            
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