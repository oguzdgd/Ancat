import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // kullanıcı zaten giriş yapmış → dashboard’a gönder
    redirect("/dashboard");
  }

  // kullanıcı yok → home sayfası göster
  return (
    <main>
      <h1>Hoş geldiniz 👋</h1>
      <p>Lütfen giriş yapın veya kayıt olun.</p>
      <a href="/login">Login</a>
      <a href="/signup">Signup</a>
    </main>
  );
}
