import React, {useState, useEffect} from "react";
import { View, StyleSheet, Alert } from "react-native";
import Texto from "../components/Text";
import Button from "../components/Button";
import { spacing } from "../theme";
import { getSession } from "../services/session";
import { supabaseAnonKey, supabaseUrl } from "../services/supabase";
import { asegurarCredito } from "../services/AsegurarCredito";

export default function RecargarSaldoScreen ({navigation}) {
    const [saldo, setSaldo] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [userId, setUserId] = useState(null);

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

        setCargando(false);
    }

    return(
        <View style={styles.container}>
            <Texto type="title">Saldo actual</Texto>
            <Texto style={styles.saldo}>${saldo?.toFixed(2) ?? '0.00'}</Texto>

            <Texto style={{ marginTop: spacing.lg}}>Recargar saldo:</Texto>
            <View style={styles.botones}>
                <Button title='+0.25' onPress={() => recargar(0.25)} disabled={cargando} />
                <Button title='+1.00' onPress={() => recargar(1)} disabled={cargando} />
                <Button title='+2.00' onPress={() => recargar(2)} disabled={cargando} />
            </View>
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
});