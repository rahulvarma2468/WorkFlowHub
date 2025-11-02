import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// A simple check to see if the URL is valid before creating the client
const isValidSupabaseConfig = supabaseUrl && supabaseUrl.startsWith('http');

let supabase: SupabaseClient;

if (isValidSupabaseConfig && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "Supabase credentials are not configured or are invalid. The application will run with mock auth functions. Please check your .env file."
  );

  // Create a mock client that prevents the app from crashing and returns errors on auth attempts.
  const authError = {
    name: 'AuthApiError',
    message: 'Supabase client is not configured. Please add your credentials to the .env file.',
  };

  supabase = {
    auth: {
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: authError }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: authError }),
    },
    // Add mocks for other services if they are used elsewhere
    from: () => ({
      select: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    }),
  } as unknown as SupabaseClient;
}

export { supabase };
