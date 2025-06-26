import React, {useState, useEffect} from "react";
import { View, StyleSheet, Alert } from "react-native";
import Texto from "../components/Text";
import Button from "../components/Button";
import { spacing } from "../theme";
import { getSession } from "../services/session";
import { supabaseAnonKey, supabaseUrl } from "../services/supabase";
import { asegurarCredito } from "../services/AsegurarCredito";
import { CardField, useStripe } from "@stripe/stripe-react-native";

export default function RecargarSaldoScreen ({navigation}) {
    const [saldo, setSaldo] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [userId, setUserId] = useState(null);
    const [cardDetail, setCardDetail] = useState();
    const { confirmPayment } = useStripe();

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
        if (!userId) return console.log('nah');
        setCargando(true);
        try {
        
        const resStripe = await fetch('http://192.168.0.4:3000/crear-payment-intent', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ amount: 500})
        });

        const { clientSecret } = await resStripe.json();

        const {paymentIntent, error} = await confirmPayment(clientSecret, {
            paymentMethodType: 'Card', 
            billingDetails: { email: 'test@example.com'}
        });

        if (error) {
        console.log('Error confirmando pago', error);
        Alert.alert('Pago fallido', error.message);
        } else if (paymentIntent) {
        Alert.alert('✅ Pago exitoso', `Estado: ${paymentIntent.status}`);
        
        const res = await fetch(`${supabaseUrl}/rest/v1/creditos?user_id=eq.${userId}`, {
            method: 'PATCH', 
            headers: {
                apikey: supabaseAnonKey,
                Authorization: `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
                Prefer: 'return=representation'
            },
            body: JSON.stringify({
                saldo: saldo + monto,
            })
        });

        const data = await res.json();

        if(res.ok) {
            setSaldo(data[0].saldo);
            Alert.alert('Exito', `Se han añadido $${monto.toFixed(2)} a tu saldo`)
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
             <CardField
        postalCodeEnabled={false}
        placeholder={{ number: '4242 4242 4242 4242' }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={styles.card}
        onCardChange={setCardDetail}
      />

      <Button title="Recargar $5" onPress={() => recargar(5.00)} disabled={cargando || !cardDetail?.complete} />
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