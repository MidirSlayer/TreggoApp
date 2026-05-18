import React, {useState, useEffect} from "react";
import { View, StyleSheet, Alert } from "react-native";
import Texto from "../components/Text";
import { colors, spacing } from "../theme";
import { getSession } from "../services/session";
import { supabaseAnonKey, supabaseUrl } from "../services/supabase";
import { asegurarCredito } from "../services/AsegurarCredito";

export default function RecargarSaldoScreen ({navigation}) {
    const [saldo, setSaldo] = useState(null);
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

    return(
        <View style={styles.container}>
            <Texto type="title">Saldo actual</Texto>
            <Texto style={styles.saldo}>${saldo?.toFixed(2) ?? '0.00'}</Texto>

            <View style={styles.soonContainer}>
               <Texto type="title" style={styles.soonText}>🚀 Pronto usable</Texto>
               <Texto style={styles.soonSubtext}>Estamos trabajando para traerte esta función lo antes posible.</Texto>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    flex: 1,
  },
  saldo: {
    fontSize: 32,
    marginBottom: spacing.lg,
  },
  soonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  soonText: {
    fontSize: 24,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  soonSubtext: {
    textAlign: 'center',
    color: colors.subtext,
  }
});