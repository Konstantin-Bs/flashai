import { AuthProvider } from "@/lib/auth-context"
import { Footer } from "@/components/Footer"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Flashcard App",
  description: "AI-powered flashcard generator",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  )
}