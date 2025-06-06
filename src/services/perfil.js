import { supabaseUrl, supabaseAnonKey} from './supabase';

export async function crearPerfil(userId, { nombre, telefono, ciudad, avatar_url }) {
  const res = await fetch(`${supabaseUrl}/rest/v1/perfiles`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      id: userId,
      nombre,
      telefono,
      ciudad,
      avatar_url,
    }),
  });

  console.log('📤 Enviando perfil a Supabase:', {
  id: userId,
  nombre,
  telefono,
  ciudad,
  avatar_url
});

  const data = await res.json();
  console.log('📥 Respuesta de Supabase:', data);
  if (!res.ok) throw new Error(data.message || 'Error al crear perfil');
  return data[0];
}

export async function obtenerPerfil(userId) {
  const res = await fetch(`${supabaseUrl}/rest/v1/perfiles?id=eq.${userId}&select=*`, {
    headers: {
      apikey: supabaseAnonKey,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener perfil');
  return data[0] || null;
}

export async function actualizarPerfil(userId, { nombre, telefono, ciudad, avatar_url }) {

  console.log('Creando perfil con:', { nombre, telefono, ciudad, avatar_url });

  const res = await fetch(`${supabaseUrl}/rest/v1/perfiles?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      nombre,
      telefono,
      ciudad,
      avatar_url,
    }),
  });

  console.log('📤 Enviando perfil a Supabase:', {
  id: userId,
  nombre,
  telefono,
  ciudad,
  avatar_url
});
  const data = await res.json();
    console.log('📥 Respuesta de Supabase:', data);
  if (!res.ok) throw new Error(data.message || 'Error al actualizar perfil');
  return data[0] || {};
}
