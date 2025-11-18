import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


const SUPABASE_URL = "https://khexegxtpykpfqdjxvof.supabase.co";   // ganti dengan URL project
const SUPABASE_SERVICE_ROLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZXhlZ3h0cHlrcGZxZGp4dm9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQ2NDA2MywiZXhwIjoyMDc5MDQwMDYzfQ.pOPAtZX-g-mhdJ8khE9KQRluk9mxmuk6iaMdgS_H2z8";          // ganti dengan Service Role

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);


export default supabase;
