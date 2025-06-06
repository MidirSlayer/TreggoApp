import React, { useState} from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { singUp } from "../services/supabase";
import PerfilForm from "../components/PerfilForm";
import { actualizarPerfil, crearPerfil } from "../services/perfil";
import { subirImagenPerfil } from "../services/storage";
 
export default function RegisterScreen({ navigation }) {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [modeCreator, setModeCreator] = useState(false);
    const [id, setId] = useState()

    const handleRegister = async () => {
        try {
            const user = await singUp(email, password);
            console.log (user.access_token)
            console.log('Registrado', user);
            setId(user.id)
            setModeCreator(true)
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }

    if (modeCreator) { 
        return (
            <PerfilForm
                onSubmit={async(datos) =>{
                    console.log(datos)
                    console.log(id)
                    let urlFinal = datos.avatar_url

                    if(datos.avatar_url?.startsWith('file')) {
                        urlFinal = await subirImagenPerfil(datos.avatar_url, id)
                    }

                    const datosFinales = {...datos, avatar_url: urlFinal}

                    await crearPerfil(id, datosFinales);
                    Alert.alert('perfil creado')

                    setModeCreator(false)
                    navigation.replace('Login')
                }}
            />
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