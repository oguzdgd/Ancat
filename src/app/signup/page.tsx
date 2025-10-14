import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import SignupForm from './SignUpForm'


export default async function SignupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return <SignupForm />
}