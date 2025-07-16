import { createClient } from '@supabase/supabase-js';

const isTest = import.meta.env.MODE === 'test';

const SUPABASE_URL = isTest
  ? import.meta.env.VITE_SUPABASE_URL_TEST
  : import.meta.env.VITE_SUPABASE_URL;

const SUPABASE_KEY = isTest
  ? import.meta.env.VITE_SUPABASE_ANON_KEY_TEST
  : import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
