import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mjzkmxshesebvdayvcto.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qemtteHNoZXNlYnZkYXl2Y3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzIzMTMsImV4cCI6MjA2ODAwODMxM30.yKE3xFOSQB67HjOmKzDPIbR-4cV10Zds_pAkeFVFpUQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
