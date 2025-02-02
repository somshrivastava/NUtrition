import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.REACT_APP_SUPABASE_ANON_KEY;

const supabaseUrl = "https://zkyriesqnwrpjbeqamrx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpreXJpZXNxbndycGpiZXFhbXJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMDY0OTMsImV4cCI6MjA1MzY4MjQ5M30.lX0K-ZQfXhOxbcV7jFRlexIXpTKQXlGtP69VoAPfSm0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
