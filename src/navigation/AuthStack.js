import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DrawerNavigator from "./DrawerNavigatio";
import DetalleTrabajoScreen from "../screens/DetalleTrabajoScreen";
import OffertScreen from "../screens/OfertasScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>
           <Stack.Screen name="Main" component={DrawerNavigator} options={{headerShown: false}}/>
           <Stack.Screen name='DetalleTrabajo' component={DetalleTrabajoScreen} options={{headerTransparent: true}}/>
           <Stack.Screen name="VerOfertas" component={OffertScreen} options={{headerTransparent: true}} />
        </Stack.Navigator>
    )   
}