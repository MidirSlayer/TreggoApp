import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
           <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
    )
}