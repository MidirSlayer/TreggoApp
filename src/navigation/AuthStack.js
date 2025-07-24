import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DrawerNavigator from "./DrawerNavigatio";
import DetalleTrabajoScreen from "../screens/DetalleTrabajoScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
           <Stack.Screen name="Main" component={DrawerNavigator} />
           <Stack.Screen name='DetalleTrabajo' component={DetalleTrabajoScreen} />
        </Stack.Navigator>
    )
}