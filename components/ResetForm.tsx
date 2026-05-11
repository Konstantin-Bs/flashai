"use client"

import { useState } from "react"
import { resetPassword } from "@/lib/auth"

interface Props {
    onSuccess: () => void
    onClose: () => void
}

export default function ResetForm({ onClose, onSuccess }: Props) {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleReset() {
        if (!email.trim()) {
            setError("Please enter your email")
            return
        }
        setLoading(true)
        setError("")
        
        const { error } = await resetPassword(email) 

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }
        setLoading(false)
        onSuccess()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* backdrop */}
            <div className="absolute inset-0 backdrop-blur-xs bg-black/25" />

            {/* panel */}
            <div 
                className="relative z-10 -translate-y-13 h-auto rounded-xl w-80 border-2 border-black dark:border-white/30 bg-white dark:bg-slate-950 p-3 shadow-2xl"
            >
                <div className="flex items-center justify-between">
                    <h1 className="text-2x1 font-bold mb-4">Reset Password</h1>
                    <button 
                        onClick={onClose}
                        className="text-xl mb-6 cursor-pointer hover:opacity-50"
                    >
                        ✕
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="border border-black dark:border-white/30 rounded-md p-2 w-full"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        onClick={handleReset}
                        disabled={loading}
                        className="rounded-md p-2 font-semibold disabled:opacity-50 text-white bg-blue-800/85 hover:bg-blue-800 cursor-pointer"
                    >
                        {loading ? "Sending reset link..." : "Send Reset Link"}
                    </button>
                </div>
            </div>
        </div>
    )
}