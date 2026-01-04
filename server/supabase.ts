import { createServerClient } from '@supabase/ssr'
import { cookies } from 'express'

export function createServerSupabaseClient(req: any, res: any) {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for server-side operations
    {
      cookies: {
        get(name: string) {
          return req.cookies?.[name]
        },
        set(name: string, value: string, options: any) {
          res.cookie(name, value, options)
        },
        remove(name: string, options: any) {
          res.clearCookie(name, options)
        },
      },
    }
  )
}

// For operations that don't need cookies (like admin operations)
export function createAdminSupabaseClient() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}


