import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshSession } from "./supabase";

const supabaseUrl = 'https://sfbzcsxtuifipultcwpf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmYnpjc3h0dWlmaXB1bHRjd3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTM2MzUsImV4cCI6MjA2Mzg2OTYzNX0.PGUKSh2zIYItcsqf9EPQoXvUXUvX_Jha3CG85ZnWUU8';

const  TOKEN_KEY = 'access_token'
const USER_KEY = 'user'
const REFRESH_KEY = 'refresh_token'

export async function saveSession({ access_token, user, refresh_token}) {
    if (access_token) await AsyncStorage.setItem(TOKEN_KEY, access_token)
    if (user)await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    if (refresh_token) await AsyncStorage.setItem(REFRESH_KEY, refresh_token);
}

export async function getSession() {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const refresh_token = await AsyncStorage.getItem(REFRESH_KEY);
    const userJson = await AsyncStorage.getItem(USER_KEY);

    if(!token || !refresh_token || !userJson) return null;
    
    const session = { token, refresh_token, user: JSON.parse(userJson)};

    const testRes = await fetch(`${supabaseUrl}/res/v1/debug_uid`, {
        method: 'POST',
        headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });

    if (testRes.status === 401) {
        try {
            console.log('⚠️ Token expirado. Intentando renovar...');
            const newSession = await refreshSession(refresh_token);
            await saveSession(newSession);
            return {
                token: newSession.access_token,
                refresh_token: newSession.refresh_token,
                user: newSession.user
            };
        } catch (error) {
            console.log('Error al renovar token', error.message);
            return null;
        }
    }

    return session;
}

export async function clearSession() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
}
