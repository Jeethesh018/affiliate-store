import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ayzmhyfvkjvubvijpiqt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5em1oeWZ2a2p2dWJ2aWpwaXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NzYyODYsImV4cCI6MjA4NzM1MjI4Nn0.Ll-gekY9yJlnHUpH0KYIofDDR9f5ajM3Ok8gZWQLrTo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)