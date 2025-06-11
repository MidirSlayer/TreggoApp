import { supabaseAnonKey, supabaseUrl } from "./supabase";
import { getSession } from "./session";

export async function contactarProveedor({proveedoId, clienteId, trabajoId, comision = 0.25}) {
    const session =  await getSession();

    if (!session) {
        return {ok: false, mensaje: 'Usuario no auntenticado'};
    }

    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/rpc/contactar_proveedor`, {
            method: 'POST', 
            headers: {
                apikey: supabaseAnonKey, 
                Authorization: `Bearer ${session.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                proveedor: proveedoId,
                cliente: clienteId,
                trabajo: trabajoId, 
                comision: comision
            })
        });

        const result = await res.text();

        if (result.trim() === 'ok') {
            return { ok: true}
        } else {
            return { ok: false, mensaje: result};
        }
    } catch (error) {
        console.error('❌ Error al contactar:', error)
        return { ok: false, mensaje: 'Error inesperado al contactar'}
    }
}