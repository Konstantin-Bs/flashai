"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function ChangePassword() {
  const { user, loading } = useAuth()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const router = useRouter()
  const [error, setError] = useState("")
  const [changeLoading, setChangeLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000)
      return () => clearTimeout(timer)
    }
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  })

  async function handleChange() {
    if (!currentPassword || !newPassword) {
      setError("Please fill in all fields")
      return
    }
    if (currentPassword === newPassword) {
      setError("Current and new passwords can't match")
      return
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters")
      return
    }

    if (!user) return null

    setChangeLoading(true)
    setError("")

    // supabase.auth.signInWithPassword reauthenticates the user
    // to verify current password before the update.
    // Supabase doesn't have a dedicated check password function
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    })

    if (signInError) {
      setError("Current password incorect")
      setChangeLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      setError(updateError.message)
      setChangeLoading(false)
      return
    }

    setChangeLoading(false)
    setSuccess(true)
    setCurrentPassword("")
    setNewPassword("")
  }

  return (
    <div className="max-w-sm top-20 p-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl p-6 font-semibold mb-6 text-center">
            Change Password:
          </h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleChange()
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border border-black dark:border-white/30 rounded p-2.5 w-full"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-black dark:border-white/30 rounded p-2.5 w-full"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleChange}
            disabled={changeLoading}
            type="submit"
            className="rounded-md p-2.5 font-semibold disabled:opacity-50 text-white bg-blue-800/85 hover:bg-blue-800 cursor-pointer"
          >
            {changeLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Changing
              </div>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
        {success && (
          <div className="text-center">
            <p className="text-green-600 text-sm">
              Password Successfully changed.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
