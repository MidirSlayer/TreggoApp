import React, { useState} from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { signIn } from "../services/supabase"; 
import { saveSession } from "../services/session";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    
    const handleLogin = async () => {
      try {     

        if (!email || !password) {
            Alert.alert('Campos vacíos', 'Por favor, completa tu email y contraseña.');
            return;
        }

        const { access_token, refresh_token, user } = await signIn(email, password);
        console.log('REFRESHTOKEN:', refresh_token); // 👈 Para confirmar
        await saveSession({ access_token, refresh_token, user });

        Alert.alert('Éxito', 'Sesión iniciada');
        navigation.replace('Main')
      } catch (error) {
        console.log('ERROR al iniciar sesion', error.message);
        Alert.alert('Error', error.message);
      }
    };

    return(
        <View style={styles.container}>
            <Text style={ styles.title}>Iniciar Sesión</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={setEmail}
                keyboardType="email-address"
                value={email} />
            <TextInput
                style={styles.input}
                placeholder="contraseña"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={setPassword}
                value={password}
            />

            <Button title="Entrar"  onPress={handleLogin}/>

            <Text style={styles.link} onPress={() =>navigation.navigate('Register')}>¿No tienes cuenta? Registrate.</Text>
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
        textAlign:'center'
    }
});