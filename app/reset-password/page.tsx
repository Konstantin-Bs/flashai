"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setChecking(false)
      } else if (event === "SIGNED_IN") {
        setChecking(false)
      } else if (!session) {
        router.push("/login")
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  if (checking) return null

  async function handleReset() {
    if (!password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)
    setError("")

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/login")
  }

  return (
    <div className="max-w-sm mx-auto top-20 p-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl p-6 font-semibold mb-6 text-center">
            Reset Password
          </h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleReset()
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-black dark:border-white/30 rounded p-2.5 w-full"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-black dark:border-white/30 rounded p-2.5 w-full"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleReset}
            disabled={loading}
            type="submit"
            className="rounded-md p-2.5 font-semibold disabled:opacity-50 text-white bg-blue-800/85 hover:bg-blue-800 cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Resetting
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
