import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oedwkiblwwfxzuachovr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lZHdraWJsd3dmeHp1YWNob3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NTg0MDIsImV4cCI6MjA5NDUzNDQwMn0.66-EniEPAdFkcdiMlPtwpdu9vPSwPIYMERDao6cvB80'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

