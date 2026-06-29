import { createClient } from "@supabase/supabase-js";
import { platformConfig } from "@/config";

const supabaseUrl = platformConfig.supabase.url;
const supabaseServiceKey = platformConfig.supabase.serviceKey;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
