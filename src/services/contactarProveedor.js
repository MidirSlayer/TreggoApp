import { supabaseAnonKey, supabaseUrl } from "./supabase";
import { getSession } from "./session";

export async function contactarProveedor({ proveedoId, clienteId, trabajoId, comision = 0.25 }) {
  const session = await getSession();

  if (!session) {
    return { ok: false, mensaje: 'Usuario no autenticado' };
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/contactar_proveedor`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        proveedor: proveedoId,
        cliente: clienteId,
        trabajo: trabajoId.toString(),
        comision: comision,
      }),
    });

    const result = await res.json();
    console.log('✅ Resultado Supabase:', result);

    // Devolver el objeto tal cual lo devuelve Supabase
    return result;

  } catch (error) {
    console.error('❌ Error al contactar:', error);
    return { ok: false, mensaje: 'Error inesperado al contactar' };
  }
}
