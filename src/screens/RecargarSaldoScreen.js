import React, {useState, useEffect} from "react";
import { View, StyleSheet, Alert } from "react-native";
import Texto from "../components/Text";
import Button from "../components/Button";
import Input from "../components/Input";
import { colors, spacing } from "../theme";
import { getSession } from "../services/session";
import { supabaseAnonKey, supabaseUrl } from "../services/supabase";
import { asegurarCredito } from "../services/AsegurarCredito";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import Toast from "react-native-toast-message";


export default function RecargarSaldoScreen ({navigation}) {
    const [saldo, setSaldo] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [userId, setUserId] = useState(null);
    const [cardDetail, setCardDetail] = useState();
    const { confirmPayment } = useStripe();
    const [monto, setMonto] = useState(0);

    useEffect(() => {
        async function cargarSaldo() {
            const session = await getSession();
            if (!session) return;

            setUserId(session.user.id);
            await asegurarCredito();

            const res = await fetch(`${supabaseUrl}/rest/v1/creditos?user_id=eq.${session.user.id}`, {
                headers: {
                    apikey: supabaseAnonKey,
                    Authorization: `Bearer ${session.token}`
                }
            });

            console.log(res)

            const data = await res.json();
            if (data.length > 0) {
                setSaldo(parseFloat(data[0].saldo))
            } else {
                setSaldo(0)
            }
        }
        cargarSaldo();
    }, []);

    async function recargar(monto) {

        if (monto < 0.25) {
            Alert.alert('Por favor ingrese un monto superior 0.25')
            return
        }

        const montoConvert = monto * 100;

        if (!userId) return console.log('nah');
        setCargando(true);


        try {
        
        const resStripe = await fetch('https://treggo2-0.onrender.com/crear-payment-intent', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ amount: montoConvert})
        });

       const json = await resStripe.json();
        console.log('🔐 Respuesta Stripe:', json);

        const clientSecret = json.clientSecret;

        if (!clientSecret) {
            throw new Error('No se recibió clientSecret');
        }
        const {paymentIntent, error} = await confirmPayment(clientSecret, {
            paymentMethodType: 'Card', 
            billingDetails: { email: 'test@example.com'}
        });

        if (error) {
        console.log('Error confirmando pago', error);
        Alert.alert('Pago fallido', error.message);
        } else if (paymentIntent) {
        //Alert.alert('✅ Pago exitoso', `Estado: ${paymentIntent.status}`);
         Toast.show({
          type: 'success',
          text1: '✅ Pago exitoso',
          text2:  `Se han añadido $${monto} a tu saldo`,
          position: 'top',
        });
        
        const montoFixed = monto * 1.00
        console.log(saldo, montoFixed)
        const res = await fetch(`${supabaseUrl}/rest/v1/creditos?user_id=eq.${userId}`, {
            method: 'PATCH', 
            headers: {
                apikey: supabaseAnonKey,
                Authorization: `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
                Prefer: 'return=representation'
            },
            body: JSON.stringify({
                saldo: saldo + montoFixed
            })
        });

        const data = await res.json();
        console.log (data)

        if(res.ok) {
            setSaldo(data[0].saldo);
            //Alert.alert('Exito', `Se han añadido $${monto} a tu saldo`)
        } else {
            Alert.alert('Error', 'No se pudo recargar.')
        }
      }

        } catch (e) {
            console.log('Error', e)
            Alert.alert('Error', 'Hubo un problema al procesar el pago')
        } finally {setCargando(false)}

    }

    return(
        <View style={styles.container}>
           
            <Texto type="title">Saldo actual</Texto>
            <Texto style={styles.saldo}>${saldo?.toFixed(2) ?? '0.00'}</Texto>

            <Texto style={{ marginTop: spacing.lg}}>Recargar saldo:</Texto>
            <Texto type="subtitle">Monto:</Texto>
            <Input
                placeholder="Monto"
                autoCapitalize="none"
                keyboardType="number-pad"
                onChangeText={setMonto}
                value={monto}
            />
             <CardField
        postalCodeEnabled={false}
        placeholder={{ number: '4242 4242 4242 4242' }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
          placeholderColor: colors.subtext
        }}
        style={styles.card}
        onCardChange={setCardDetail}
      />

      <Button title="Recargar" onPress={() => recargar(monto)} disabled={cargando || !cardDetail?.complete} />
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  saldo: {
    fontSize: 32,
    marginBottom: spacing.lg,
  },
  botones: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
    card: { height: 50, marginBottom: 20 },
});