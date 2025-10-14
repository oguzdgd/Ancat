

import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";
// @ts-ignore: allow side-effect import of global CSS in Next.js app router
import './globals.css';
import { createClient } from '@/utils/supabase/server'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <html lang="en" suppressHydrationWarning>

      <body>
        <ThemeProvider  attribute="class" enableColorScheme={true}>
          <div className="app-layout">
             <Navbar user={user} />
            <main className="page-container">
              <div className="content-area">

                {children}

              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
