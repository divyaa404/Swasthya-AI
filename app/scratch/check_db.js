const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mmdhzvbjbnamepfiryra.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZGh6dmJqYm5hbWVwZmlyeXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMDc5NjYsImV4cCI6MjA5Njg4Mzk2Nn0.eGrsAyADnIp951edaSe6gHw2TdxfaFljw19vKoXmWW4'
);

async function run() {
  console.log("=== Querying patients table ===");
  const { data, error } = await supabase.from('patients').select('*').limit(1);
  if (error) {
    console.error("Query Error:", error);
  } else {
    console.log("Query success! Row sample:", data);
  }
}

run();
