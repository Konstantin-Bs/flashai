"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUp, signInWithGoogle, resendConfirmationEmail } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [resend, setResend] = useState(false)

  useEffect(() => {
    if (resend) {
      const timer = setTimeout(() => setResend(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [resend])

  async function handleRegister() {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)
    setError("")

    const { error } = await signUp(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    setSuccess(true)
  }

  async function handleResend() {
    // resendConfirmationEmail so email is verified!
    const { error } = await resendConfirmationEmail(email)

    if (error) {
      if (error.message?.includes("rate")) {
        setError("Please wait a moment before requesting another email.")
      } else {
        setError(error.message)
      }
      return
    }
    setResend(true)
  }

  return (
    <div className="max-w-sm mx-auto top-20 p-6">
      <div>
        <h1 className="text-2xl p-6 font-semibold mb-6 text-center">
          Sign up to FlashAI
        </h1>
      </div>
      <div>
        <div className="flex flex-col gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleRegister()
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={success}
              className="border border-black dark:border-white/30 rounded p-2.5 w-full"
            />
            <input
              type="password"
              placeholder="Password (min. 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={success}
              className="border border-black dark:border-white/30 rounded p-2.5 w-full"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleRegister}
              disabled={loading || success}
              type="submit"
              className="rounded-md p-2.5 font-semibold disabled:opacity-50 text-white bg-blue-800/85 hover:bg-blue-800 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Creating account
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="flex items-center gap-2">
            <div className="flex-1 border-t border-black dark:border-white/30" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 border-t border-black dark:border-white/30" />
          </div>

          <button
            onClick={async () => await signInWithGoogle()}
            className="rounded-md p-2.5 w-full font-semibold border border-black dark:border-white/25 bg-gray-200/85 dark:bg-gray-700/85 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer"
          >
            Continue with Google
          </button>
        </div>
        <div className="p-5">
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
        {success && (
          <div className="text-center flex flex-col gap-5">
            <p className="text-green-600 text-sm">
              Check your email to confirm your account.
            </p>
            <div className="flex gap-4 justify-center">
              <p>Email not received?</p>
              <button
                onClick={handleResend}
                disabled={resend}
                className="rounded-md px-1 border border-black dark:border-white/30 bg-gray-400 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-800 cursor-pointer"
              >
                Resend
              </button>
            </div>
            {resend && <p className="text-green-600 text-sm">Resend Email.</p>}
          </div>
        )}
      </div>
    </div>
  )
}
