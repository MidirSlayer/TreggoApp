import { supabaseUrl } from "./supabase";
import { getSession } from "./session";

export async function subirImagenPerfil (uri, userId) {

    console.log('url:', uri)
    const nombreArchivo =`${userId}-${Date.now()}.jpg`;
    const bucket = 'avatars';

    const response = await fetch(uri);
    const blob = await response.blob();

    const session = await getSession()
    const token = session.token;
    
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${nombreArchivo}`;

    const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'image/jpg',
            'Authorization':`Bearer ${token}`
        }, 
        body: blob
    });

   if (!res.ok) {
    const error = await res.text();
    console.error('❌ Error al subir imagen:', error);
    throw new Error('Error al subir imagen');
  }

  // ✅ URL pública
  const url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${nombreArchivo}`;
  console.log('✅ Imagen subida correctamente:', url);
  return url; 
}

export async function subirImagenRegistro (uri, userId, access_token){
    console.log('Datos recibidos', {uri, userId, access_token})
    const nombreArchivo =`${userId}-${Date.now()}.jpg`;
    const bucket = 'avatars';

    const response = await fetch(uri);
    const blob = await response.blob();

    const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${nombreArchivo}`;

    const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'image/jpg',
            'Authorization':`Bearer ${access_token}`
        }, 
        body: blob
    });

    if (!res.ok) {
        const error = await res.text();
        console.error('❌ Error al subir imagen:', error);
        throw new Error('Error al subir imagen');
    }

    const url = `${supabaseUrl}/storage/v1/object/public/${bucket}/${nombreArchivo}`;
    console.log('✅ Imagen subida correctamente:', url);
    return url; 
}