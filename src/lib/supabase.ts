import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Sound {
  id: string;
  title: string;
  description: string | null;
  audio_url: string;
  latitude: number;
  longitude: number;
  address: string | null;
  unlock_radius: number;
  created_at: string;
  user_id: string | null;
}
