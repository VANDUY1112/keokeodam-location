import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ieqlbzxbhypussjotyyo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_C92Z88UjBX6FntiSbd7q6w_9Y5Hkm1D';

export const supabase = createClient(supabaseUrl, supabaseKey);
