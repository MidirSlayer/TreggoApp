import { getSession } from "./session";

const supabaseUrl = 'https://sfbzcsxtuifipultcwpf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmYnpjc3h0dWlmaXB1bHRjd3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTM2MzUsImV4cCI6MjA2Mzg2OTYzNX0.PGUKSh2zIYItcsqf9EPQoXvUXUvX_Jha3CG85ZnWUU8';

//funcion de registro
export async function singUp(email, password) {
   const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: {
        apikey: supabaseAnonKey,
        'Content-Type' : 'application/json',
    },
    body: JSON.stringify({email, password}),
   });
   
   const data = await res.json();
   if(!res) throw new Error(data.error?.message || 'Error al registrar');
   return data;
}

// Funcion de inicio de sesion
export async function signIn(email, password) {
  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  console.log('🧪 Login response:', data); // útil para debug

  if (!res.ok) {
    throw new Error(data.error?.description || 'Error al iniciar sesión');
  }

  return data; // ✅ contiene: access_token, refresh_token, user
}

//funcion para publicar un trabajo
export async function publicarTrabajos (trabajo) {

   const session = await getSession();
    // estos prints son para pruebas por problemas con politicas de RLS
   console.log('🔐 Authorization:', `Bearer ${session.token}`);
   console.log('🆔 user_id enviado:', trabajo.user_id);

  const res = await fetch(`${supabaseUrl}/rest/v1/trabajos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.token}`,
      apikey: supabaseAnonKey,
     'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(trabajo)
  });
  
  const data = await res.json();
  console.log('Respuesta Supabase:', trabajo);
  if (!res.ok) throw new Error(data.message || 'Error al publicar');
  return data[0];
}
//refrescamos el token para la incersion de trabajos
export async function refreshSession(refresh_token) {
  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({refresh_token}),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.descripcion || 'Error al renovar sesion');
}
// funcion para obtener los datos de la lista
export async function obtenerTrabajos () {
  const res = await fetch(`${supabaseUrl}/rest/v1/trabajos?select=*`, {
    headers: {
      apikey: supabaseAnonKey
    }
  })

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener trabajos')
  return data;
}

//funcion de tipos
export async function obtenerTiposTrabajo() {
  const res = await fetch(`${supabaseUrl}/rest/v1/tipos_trabajo?select=*`, {
    headers: {
      apikey: supabaseAnonKey
    }
  })

  const data = await res.json();
  if (!res.ok) throw new Error('Error al obtener tipos');
  return data;
}

export async function obtenerMisTrabajos(user_id) {
  const res = await fetch(`${supabaseUrl}/rest/v1/trabajos?user_id=eq.${user_id}&select=*`, {
    headers: {
      apikey: supabaseAnonKey,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error('Error al obtener tus trabajos')
    return data;
}