import React, { useState, useEffect } from "react";
import { View, Alert, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { singUp } from "../services/supabase";
import Input from "../components/Input";
import Button from "../components/Button";
import Texto from "../components/Text";
import PerfilForm from "../components/PerfilForm";
import { crearPerfil } from "../services/perfil";
import { subirImagenRegistro } from "../services/storage";
import Toast from "react-native-toast-message";

export default function RegisterScreen({ navigation, route }) {
    const { verified, userId, accessToken } = route?.params || {};
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [modeCreator, setModeCreator] = useState(false);
    const [id, setId] = useState()
    const [access_token, setAcces_token] = useState()
    const [confirm, setConfirm] = useState('');

    useEffect(() => {
        if (verified && userId) {
            setId(userId);
            setAcces_token(accessToken);
            setModeCreator(true);
        }
    }, [verified, userId, accessToken]);

    const handleRegister = async () => {
        try {
            if (!emailOrPhone || !password || !confirm) {
                Alert.alert('Campos incompletos', 'Por favor, completa todos los campos.');
                return;
            }

            const isEmail = emailOrPhone.includes('@');
            let cleanedInput = emailOrPhone.trim();

            if (isEmail) {
                if (!cleanedInput.includes('.')) {
                    Alert.alert('Email inválido', 'Ingresa un email válido.');
                    return;
                }
            } else {
                // Eliminar espacios, guiones y paréntesis
                cleanedInput = cleanedInput.replace(/[\s\-\(\)]/g, '');

                if (!cleanedInput.startsWith('+')) {
                    Alert.alert(
                        'Formato de teléfono',
                        'El número de teléfono debe comenzar con "+" seguido del código de país (ej. +54911...).'
                    );
                    return;
                }

                const phoneRegex = /^\+[1-9]\d{1,14}$/;
                if (!phoneRegex.test(cleanedInput)) {
                    Alert.alert('Teléfono inválido', 'Por favor, ingresa un número de teléfono válido.');
                    return;
                }
            }

            if (password !== confirm) {
                Alert.alert('Contraseñas no coinciden', 'Verifica que ambas contraseñas sean iguales.');
                return;
            }

            if (password.length < 6) {
                Alert.alert('Contraseña débil', 'Debe tener al menos 6 caracteres.');
                return;
            }

            const user = await singUp(cleanedInput, password);
            console.log('Registrado exitosamente, enviando a verificación');

            // Navegamos a verificación pasando el parámetro correcto
            if (isEmail) {
                navigation.navigate('EmailVerification', { email: cleanedInput });
            } else {
                navigation.navigate('EmailVerification', { phone: cleanedInput });
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={{ alignItems: 'center', }}>
                    <Image source={require('../../assets/Treggo.png')} style={{ width: 500, height: 150, marginTop: -200 }} />
                </View>

                {modeCreator ? (
                    <PerfilForm
                        onSubmit={async (datos) => {

                            let urlFinal = datos.avatar_url

                            if (datos.avatar_url?.startsWith('file')) {
                                urlFinal = await subirImagenRegistro(datos.avatar_url, id, access_token);
                            }

                            const datosFinales = { ...datos, avatar_url: urlFinal };

                            console.log('datos recibidos', datosFinales)

                            await crearPerfil(id, datosFinales, access_token);
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
                        <Texto type="body">Correo Electronico o numero de telefono</Texto>
                        <Input
                            placeholder="Email o Teléfono (ej. +54911...)"
                            autoCapitalize="none"
                            keyboardType="default"
                            onChangeText={setEmailOrPhone}
                            value={emailOrPhone}
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
                        <Texto style={styles.link} onPress={() => navigation.replace('Login')} >¿Ya tienes cuenta? Inicia Sesion</Texto>
                    </View>
                )}


            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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