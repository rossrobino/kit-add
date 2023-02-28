import { createClient } from "@supabase/auth-helpers-sveltekit";
import type { Database } from "./types"; // for generated types
import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";

export const db = createClient<Database>(
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
);
