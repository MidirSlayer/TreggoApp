import { supabaseAnonKey, supabaseUrl } from "./supabase";
import { getSession } from "./session";

export async function enviarOferta({ proveedor_id, trabajo_id, precio, descripcion,tiempo_estimado}) {
  const session = await getSession();

  if (!session) {
    return { ok: false, mensaje: 'Usuario no autenticado' };
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/ofertas`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        proveedor_id: proveedor_id,
        trabajo_id: trabajo_id,
        precio,
        tiempo_estimado,
        descripcion,
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

export async function verOfertas (trabajo_id){
  
    console.log('Id recibido', trabajo_id)
    const res = await fetch(`${supabaseUrl}/rest/v1/ofertas?trabajo_id=eq.${trabajo_id}&select=*`, {
      headers: {
        apikey: supabaseAnonKey,
      }
    })

    const data = await res.json();
    console.log ('Datos obtenidos', data)
    if (!res.ok) throw new Error(data.message) || 'Error al obtener lista';
    return data ;
}