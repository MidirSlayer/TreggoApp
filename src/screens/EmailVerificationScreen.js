import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TextInput, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { verifyEmailOtp, resendConfirmationEmail, verifyPhoneOtp, resendConfirmationPhone } from "../services/supabase";
import Button from "../components/Button";
import Texto from "../components/Text";
import { colors, spacing, borderRadius } from "../theme";
import Toast from "react-native-toast-message";

export default function EmailVerificationScreen({ route, navigation }) {
    const { email, phone } = route.params || {};
    const identifier = email || phone;
    const isPhone = !!phone;
    
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(60);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (!identifier) {
            Alert.alert('Error', 'No se ha proporcionado información de verificación.');
            navigation.goBack();
        }
    }, [identifier]);

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleCodeChange = (text, index) => {
        // Permitir solo números
        const numericText = text.replace(/[^0-9]/g, '');
        
        if (numericText.length > 1) {
            // Manejar pegado de código
            const newCode = [...code];
            for (let i = 0; i < numericText.length && index + i < 6; i++) {
                newCode[index + i] = numericText[i];
            }
            setCode(newCode);
            
            // Mover el foco al último input llenado
            const nextFocus = Math.min(index + numericText.length, 5);
            inputRefs.current[nextFocus]?.focus();
            return;
        }

        const newCode = [...code];
        newCode[index] = numericText;
        setCode(newCode);

        // Mover al siguiente input automáticamente
        if (numericText !== '' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        // Mover al input anterior al presionar borrar si el actual está vacío
        if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
            
            // También borrar el valor del input anterior
            const newCode = [...code];
            newCode[index - 1] = '';
            setCode(newCode);
        }
    };

    const handleVerify = async () => {
        const fullCode = code.join('');
        if (fullCode.length < 6) {
            Alert.alert('Código incompleto', 'Por favor, ingresa los 6 dígitos del código.');
            return;
        }

        try {
            setLoading(true);
            const data = isPhone
                ? await verifyPhoneOtp(phone, fullCode)
                : await verifyEmailOtp(email, fullCode);
            
            Toast.show({
                type: 'success',
                text1: isPhone ? 'Teléfono verificado' : 'Email verificado',
                text2: 'Ahora puedes completar tu perfil.',
                position: 'top',
            });
            
            // Volver a la pantalla de registro indicando que se verificó correctamente
            // y pasando los datos necesarios para crear el perfil
            navigation.navigate('Register', { 
                verified: true, 
                userId: data.user.id,
                accessToken: data.access_token 
            });
        } catch (error) {
            Alert.alert('Error de verificación', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        
        try {
            setLoading(true);
            if (isPhone) {
                await resendConfirmationPhone(phone);
            } else {
                await resendConfirmationEmail(email);
            }
            setCooldown(60);
            Toast.show({
                type: 'info',
                text1: 'Código reenviado',
                text2: isPhone ? 'Revisa tus mensajes SMS.' : 'Revisa tu bandeja de entrada o spam.',
                position: 'top',
            });
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.imageContainer}>
                    <Image source={require('../../assets/Treggo.png')} style={styles.logo} resizeMode="contain" />
                </View>

                <View style={styles.card}>
                    <Texto style={styles.title}>Verifica tu cuenta</Texto>
                    <Texto style={styles.subtitle}>
                        {isPhone 
                            ? 'Hemos enviado un código SMS de 6 dígitos a:' 
                            : 'Hemos enviado un código de 6 dígitos a:'
                        }
                    </Texto>
                    <Texto style={styles.emailText}>{identifier}</Texto>

                    <View style={styles.codeContainer}>
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={[
                                    styles.codeInput,
                                    digit !== '' ? styles.codeInputActive : null
                                ]}
                                value={digit}
                                onChangeText={(text) => handleCodeChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={6} // Permite pegar el código completo en un campo
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    <Button 
                        title={loading ? "Verificando..." : "Verificar código"} 
                        onPress={handleVerify} 
                        style={styles.verifyButton}
                        disabled={loading}
                    />

                    <View style={styles.resendContainer}>
                        <Texto style={styles.resendText}>¿No recibiste el código?</Texto>
                        {cooldown > 0 ? (
                            <Texto style={styles.cooldownText}>Reenviar en {cooldown}s</Texto>
                        ) : (
                            <Texto style={styles.resendLink} onPress={handleResend}>Reenviar código</Texto>
                        )}
                    </View>
                </View>

                <Texto style={styles.backLink} onPress={() => navigation.navigate('Login')}>
                    Volver al inicio de sesión
                </Texto>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logo: {
        width: 250,
        height: 80,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 15,
        color: colors.subtext,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    emailText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },
    codeInput: {
        width: 45,
        height: 55,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.text,
        backgroundColor: colors.background,
    },
    codeInputActive: {
        borderColor: colors.primary,
        backgroundColor: colors.card,
    },
    verifyButton: {
        marginBottom: spacing.lg,
    },
    resendContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: spacing.xs,
    },
    resendText: {
        color: colors.subtext,
    },
    cooldownText: {
        color: colors.subtext,
        fontWeight: '600',
    },
    resendLink: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    backLink: {
        color: colors.subtext,
        marginTop: spacing.xl,
        textAlign: 'center',
        fontWeight: '600',
    }
});
