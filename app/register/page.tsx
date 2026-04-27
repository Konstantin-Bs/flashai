"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUp, signInWithGoogle } from "@/lib/auth"

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

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

    return (
        <div className="max-w-sm mx-auto mt-20 p-6">
            <h1 className="text-2xl font-bold mb-6">Register</h1>

            <div className="flex flex-col gap-4">
                <button
                    onClick={async () => await signInWithGoogle()}
                    className="border rounded p-2 w-full font-medium hover:bg-gray-50"
                >
                    Continue with Google
                </button>

                <div className="flex items-center gap-2">
                    <hr className="flex-1" />
                    <span className="text-sm text-gray-400">or</span>
                    <hr className="flex-1" />
                </div>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="border rounded p-2 w-full"
                /> 
                <input
                    type="password"
                    placeholder="Password (min. 8 characters)"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border rounded p-2 w-full"
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="bg-black text-white rounded p-2 font-medium disabled:opacity-50"
                >
                    {loading ? "Creating account..." : "Register"}
                </button>

                <p className="text-sm text-gray-500 text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="text-black underline">
                        Login
                    </Link>
                </p>
                {success && (
                    <div className="text-center">
                    <p className="text-green-600 text-sm">
                    Check your email to confirm your account.
                    </p>
                    </div>
                )}
            </div>
        </div>
    )
}