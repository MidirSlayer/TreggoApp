import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshSession } from './supabase';
import { decode as atob } from 'base-64';

const TOKEN_KEY = 'access_token';
const USER_KEY = 'user';
const REFRESH_KEY = 'refresh_token';

export async function saveSession({ access_token, refresh_token, user }) {
  if (access_token) await AsyncStorage.setItem(TOKEN_KEY, access_token);
  if (refresh_token) await AsyncStorage.setItem(REFRESH_KEY, refresh_token);
  if (user) await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getSession() {
  let token = await AsyncStorage.getItem(TOKEN_KEY);
  let refresh_token = await AsyncStorage.getItem(REFRESH_KEY);
  let userJson = await AsyncStorage.getItem(USER_KEY);

  if (!token || !refresh_token || !userJson) return null;

  console.log('🔍 Paso 1: Leyendo storage');

  const partes = token.split('.');
  if (partes.length !== 3) {
    console.log('❌ Token mal formado:', token);
    return null;
  }

  const payloadBase64 = partes[1];
  let payload;

  try {
    payload = JSON.parse(atob(payloadBase64));
  } catch (e) {
    console.error('❌ Error al decodificar token:', e);
    return null;
  }

  const exp = payload.exp;
  if (!exp) {
    console.log('❌ El token no tiene campo exp:', payload);
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  console.log('🔍 Paso 2: Token expira en:', new Date(exp * 1000).toLocaleString());

  if (exp < now + 60) {
    console.log('🔁 Token expirado o a punto de expirar. Refrescando...');
     const { data, error } = await refreshSession(refresh_token);
    if (error || !data.access_token || !data.user) {
        console.log('❌ Error al refrescar sesión:', error || 'Faltan datos en la respuesta');
    return null;
}

    await saveSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
    });

    token = data.access_token;
    userJson = JSON.stringify(data.user);

  }

  console.log('✅ Sesión válida cargada');

  return {
    token,
    refresh_token,
    user: JSON.parse(userJson),
  };
}

export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_KEY, USER_KEY]);
}
