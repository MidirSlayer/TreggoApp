import { supabaseAnonKey, supabaseUrl } from "./supabase";
import { getSession } from "./session";

export async function asegurarCredito () {
    const session = await getSession()
    if (!session) return;

    const userId = session.user.id;

    try {
        const res = await fetch(
            `${supabaseUrl}/rest/v1/creditos?user_id=eq.${userId}`, {
                headers: {
                    apikey: supabaseAnonKey,
                    Authorization: `Bearer ${session.token}`
                }
            }
        )

        const data = await res.json();

        if (data.length === 0) {
            const crear = await fetch(
                `${supabaseUrl}/rest/v1/creditos`, {
                    method: 'POST',
                    headers: {
                        apikey: supabaseAnonKey,
                        Authorization: `Bearer ${session.token}`,
                        'Content-Type' : 'application/json',
                        Prefer: 'return=representation'
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        saldo: 0, 
                    })
                }
            );
            if (!crear.ok) {
                console.warn('⚠️ No se pudo crear entrada de crédito:', await crear.text());
            } else {
                console.log('✅ Crédito inicial creado')
            }
        } else {
             console.log('✅ Crédito ya existe');
        }
    } catch (error)  {
        console.error('❌ Error al asegurar crédito:', error);

    }
}