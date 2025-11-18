// js/supabase.js
import { createClient } from "https://esm.sh/@supabase/supabase-js";

export const supabase = createClient(
    "https://YOUR-PROJECT.supabase.co",
    "YOUR-ANON-KEY"
);
