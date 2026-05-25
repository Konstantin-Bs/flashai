"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/decks")
      router
    }
  }, [user, loading])

  function handleSignUp() {
    router.push("/register")
  }

  return (
    <div className="flex flex-col items-center justify-center mt-32 gap-12">
      <h1 className="text-7xl max-w-3xl text-center font-semibold">
        Turn your notes into flashcards in seconds
      </h1>
      <p className="font-semibold text-2xl max-w-lg text-center">
        Paste your notes or upload a PDF. AI generates study-ready flashcards
        instantly
      </p>
      <button
        onClick={handleSignUp}
        className="text-2xl text-white rounded-md py-3.5 px-5.5 bg-blue-600/85 hover:bg-blue-600 cursor-pointer"
      >
        Get Started
      </button>
    </div>
  )
}
