import type { Database } from "#src/types.ts";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
