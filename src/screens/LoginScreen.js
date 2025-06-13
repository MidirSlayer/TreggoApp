import React, { useState} from "react";
import { View, Text, Alert, StyleSheet, Image} from "react-native";
import { signIn } from "../services/supabase"; 
import { saveSession } from "../services/session";
import Input from "../components/Input";
import Button from "../components/Button";
import Texto from "../components/Text";

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

        //Alert.alert('Éxito', 'Sesión iniciada');
        navigation.replace('Main')
      } catch (error) {
        console.log('ERROR al iniciar sesion', error.message);
        Alert.alert('Error', error.message);
      }
    };

    return(
        <View style={styles.container}>
            <View style={{alignItems: 'center',}}>
                <Image source={require('../../assets/Treggo.png')} style={{width: 500, height: 150, marginTop: -200}}/>
            </View>
            <Texto type="title">Iniciar Sesión</Texto>
            <Input
                
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={setEmail}
                keyboardType="email-address"
                value={email} />
            <Input
                
                placeholder="contraseña"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={setPassword}
                value={password}
            />

            <Button title="Entrar"  onPress={handleLogin}/>

            <Texto style={styles.link} onPress={() =>navigation.navigate('Register')}>¿No tienes cuenta? Registrate.</Texto>
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
        textAlign:'center'
    }
});