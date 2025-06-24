import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import AuthStack from "./src/navigation/AuthStack"
import AppStack from "./src/navigation/Appstack";
import { getSession } from "./src/services/session";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function App() {

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    (async () => {
      const savedSession = await getSession();
      setSession(savedSession);
      setLoading(false)
    })();
  },[]);

    if (loading) return null
  return (
    <StripeProvider publishableKey="pk_test_51RbVfj4gAfXcTJ82QkUVrvsOcxRWH1yMAnkpMQfGxr3lYTn2P6POZagqJAry2XFniyYc3pjLrfwWV2zJB7GwxRfN00C8Mwa7CY" >
    <NavigationContainer>
      {session ? <AppStack/> : <AuthStack/>}
    </NavigationContainer>
    </StripeProvider>
)};
