const supabaseUrl = 'https://sfbzcsxtuifipultcwpf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmYnpjc3h0dWlmaXB1bHRjd3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyOTM2MzUsImV4cCI6MjA2Mzg2OTYzNX0.PGUKSh2zIYItcsqf9EPQoXvUXUvX_Jha3CG85ZnWUU8';

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
  if (!res.ok) throw new Error(data.error?.message || 'Error al iniciar sesión');
  return data;
}