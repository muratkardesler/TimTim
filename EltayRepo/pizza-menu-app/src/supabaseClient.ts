import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://albsgicerpgafaaodgeh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYnNnaWNlcnBnYWZhYW9kZ2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Njk5NjQsImV4cCI6MjA3NjM0NTk2NH0.gtGvkdsCW6e-TjC8d4kMGl2zJPaooIvnEWbX1qJF834'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

