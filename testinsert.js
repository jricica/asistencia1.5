import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mjzkmxshesebvdayvcto.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qemtteHNoZXNlYnZkYXl2Y3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MzIzMTMsImV4cCI6MjA2ODAwODMxM30.yKE3xFOSQB67HjOmKzDPIbR-4cV10Zds_pAkeFVFpUQ'
);

async function testInsert() {
  const { data, error } = await supabase
    .from('users')
    .insert({
      name: 'Prueba',
      email: 'prueba@example.com',
      password: '123456',
      recoveryWord: 'gato',
      role: 'student'
    })
    .select()
    .single();

  if (error) {
    console.error('⛔ Error al insertar:', error);
  } else {
    console.log('✅ Usuario insertado:', data);
  }
}

testInsert();
