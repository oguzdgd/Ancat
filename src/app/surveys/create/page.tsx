import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import SurveyCreator from './SurveyCreator'

export default async function CreateSurveyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <SurveyCreator userId={user.id} />
}