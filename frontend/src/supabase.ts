import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.REACT_APP_SUPABASE_ANON_KEY;

const supabaseUrl = "https://bjjtxjpldinswazpftzw.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqanR4anBsZGluc3dhenBmdHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMDQ2MzAsImV4cCI6MjA1MzY4MDYzMH0.Wyi30OVi4Ud7UxtW-R9H8PjxgK3ucVZPS_tJhvQ8XC8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
