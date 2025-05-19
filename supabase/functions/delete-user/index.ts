// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// @ts-ignore
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

console.log("Hello from Functions!")

serve(async (req: Request) => {
  console.log('Poziv funkcije delete-user');
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    console.log('Nema Authorization headera');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { user_id } = await req.json();
  console.log('user_id iz zahteva:', user_id);
  if (!user_id) {
    console.log('Nedostaje user_id');
    return new Response(JSON.stringify({ error: 'Missing user_id' }), { status: 400 });
  }

  // @ts-ignore
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!serviceKey) {
    console.log('Nema SUPABASE_SERVICE_ROLE_KEY');
    return new Response(JSON.stringify({ error: 'Missing service role key' }), { status: 400 });
  }

  const res = await fetch(
    `https://mfsudxzmopfwivhwclpc.supabase.co/auth/v1/admin/users/${user_id}`,
    {
      method: 'DELETE',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (res.ok) {
    console.log('Uspešno obrisan korisnik');
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    const error = await res.text();
    console.log('Greška iz Supabase Admin API:', error);
    return new Response(JSON.stringify({ error }), { status: 400 });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/delete-user' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
