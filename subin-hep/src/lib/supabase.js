import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 로컬 테스트용 로그 (브라우저 콘솔 F12에서 확인 가능)
if (!supabaseUrl) console.error("URL이 비어있습니다! .env.local 파일을 확인하세요.")

export const supabase = createClient(supabaseUrl, supabaseAnonKey)