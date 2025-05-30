import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import AuthStack from "./src/navigation/AuthStack"
import AppStack from "./src/navigation/Appstack";
import { getSession } from "./src/services/session";

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
    <NavigationContainer>
      {session ? <AppStack/> : <AuthStack/>}
    </NavigationContainer>
)};
