import AsyncStorage from "@react-native-async-storage/async-storage";

const  TOKEN_KEY = 'access_token'
const USER_KEY = 'user'

export async function saveSession({ access_token, user}) {
    await AsyncStorage.setItem(TOKEN_KEY, access_token)
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    
}

export async function getSession() {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const userJson = await AsyncStorage.getItem(USER_KEY);

    if(!token || !userJson) return null;
    return { token, user: JSON.parse(userJson)};
}

export async function clearSession() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
}
