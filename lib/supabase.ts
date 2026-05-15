import { createBrowserClient } from "@supabase/ssr"

//Auth sessions are managed automatically via cookies
//NEXT_PUBLIC env vars are intentionallyexposed in the browser
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
