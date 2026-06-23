import React, { useState, useEffect } from "react";
import { View, Text, Alert, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from "react-native";
import { signIn } from "../services/supabase"; 
import { saveSession } from "../services/session";
import Input from "../components/Input";
import Button from "../components/Button";
import Texto from "../components/Text";
import {useNetworkToast} from "../hooks/useNetworkToast";

export default function LoginScreen({ navigation }) {
    useNetworkToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);
    
    
    const handleLogin = async () => {
      try {     

        if (!email || !password) {
            Alert.alert('Campos vacíos', 'Por favor, completa tu email y contraseña.');
            return;
        }

        const { access_token, refresh_token, user } = await signIn(email, password);
        console.log('REFRESHTOKEN:', refresh_token); // 👈 Para confirmar
        await saveSession({ access_token, refresh_token, user });
        if (user) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
}
        //Alert.alert('Éxito', 'Sesión iniciada');
        
      } catch (error) {
        console.log('ERROR al iniciar sesion', error.message);
        Alert.alert('Error', error.message);
      }
    };

    return(
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                {!isKeyboardVisible && (
                    <View style={{alignItems: 'center',}}>
                        <Image source={require('../../assets/Treggo.png')} style={{width: 500, height: 150, marginTop: -200}}/>
                    </View>
                )}
            <Texto type="title">Iniciar Sesión</Texto>
            <Texto type="body">Correo Electronico</Texto>
            <Input
                
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={setEmail}
                keyboardType="email-address"
                value={email} />
            <Texto type="body">Contraseña</Texto>
            <Input
                
                placeholder="contraseña"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={setPassword}
                value={password}
            />

            <Button title="Entrar"  onPress={handleLogin}/>

            <Texto style={styles.link} onPress={() =>navigation.replace('Register')}>¿No tienes cuenta? Registrate.</Texto>
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
        textAlign:'center'
    }
});