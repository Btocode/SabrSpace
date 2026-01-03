import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('⚠️ Supabase environment variables not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
    // Return a dummy client to prevent crashes - will fail gracefully when used
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key')
  }

  return createBrowserClient(url, key)
}

// Export a singleton instance for backward compatibility
export const supabase = createClient()
