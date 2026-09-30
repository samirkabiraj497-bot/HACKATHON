const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://hcnybaabvqrjztnlzqdl.supabase.co';
const supabaseKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbnliYWFidnFyanp0bmx6cWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MTY3NDgsImV4cCI6MjEwNjE5Mjc0OH0.uCPq6S1zcPwPI5xplTFKzkolQsOJt5hVKhsW077H5RE';

let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
} catch (err) {
  console.warn('⚠️ Supabase client initialization fallback:', err.message);
  // Resilient mock client ensuring zero runtime crashes
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: new Error('Fallback cache active') }),
      insert: () => Promise.resolve({ data: null, error: new Error('Fallback cache active') }),
      update: () => Promise.resolve({ data: null, error: new Error('Fallback cache active') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Fallback cache active') }),
      upsert: () => Promise.resolve({ data: null, error: new Error('Fallback cache active') }),
    }),
  };
}

module.exports = {
  supabase,
  supabaseUrl,
  supabaseKey,
};
