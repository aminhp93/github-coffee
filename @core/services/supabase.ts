"use client";

import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase.types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_KEY as string
);

export default supabase;
