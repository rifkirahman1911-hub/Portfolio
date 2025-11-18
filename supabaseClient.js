import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


const SUPABASE_URL = "https://khexegxtpykpfqdjxvof.supabase.co";   // ganti dengan URL project
const PUBLIC_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZXhlZ3h0cHlrcGZxZGp4dm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjQwNjMsImV4cCI6MjA3OTA0MDA2M30.hXG4uJXCY55fFcc0ySLsapt2G3KW7WLXNV3zWoFyZEQ";          // ganti dengan Public anon key

const supabase = createClient(https://khexegxtpykpfqdjxvof.supabase.co, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoZXhlZ3h0cHlrcGZxZGp4dm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NjQwNjMsImV4cCI6MjA3OTA0MDA2M30.hXG4uJXCY55fFcc0ySLsapt2G3KW7WLXNV3zWoFyZEQ);

export default supabase;