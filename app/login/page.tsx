"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn, signInWithGoogle } from "@/lib/auth"
import ResetForm from "@/components/ResetForm"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] =useState(false)
    const [showForm, setShowForm] = useState(false)
    const [success, setSuccess] = useState(false)

    async function handleLogin() {
        if (!email || !password) {
            setError("Please fill in all fields")
            return
        }

        setLoading(true)
        setError("")

        const { error } = await signIn(email, password)

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        router.push("/home")
    }

    async function handleSuccess() {
        setShowForm(false)
        setSuccess(true)
    }

    return (
        <div className="max-w-sm mx-auto top-20 p-6">
            <div>
                <h1 className="text-2xl p-6 font-semibold mb-6 text-center">
                    Sign in to FlashAI
                </h1>
            </div>
            <div>
                <div className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="border border-black dark:border-white/30 rounded p-2.5 w-full"
                    />
                    <div className="text-right">
                        <button 
                            onClick={() => setShowForm(true)}
                            className="text-blue-500 hover:underline text-sm mb-0.5 cursor-pointer"
                        >
                            Forgot Password?
                        </button>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="border border-black dark:border-white/30 rounded p-2.5 w-full"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="rounded-md p-2.5 font-semibold disabled:opacity-50 text-white bg-blue-800/85 hover:bg-blue-800 cursor-pointer"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="flex-1 border-t border-black dark:border-white/30"/>
                        <span className="text-sm">or</span>
                        <div className="flex-1 border-t border-black dark:border-white/30"/>
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
                        No account?{" "}
                        <Link href="/register" className="text-blue-500 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
                {success && (
                    <div className="text-center">
                    <p className="text-green-600 text-sm">
                        Reset link sent! Check your email.
                    </p>
                    </div>
                )}
            </div>
            {showForm && <ResetForm onSuccess={handleSuccess} onClose={() => setShowForm(false)} />}
        </div>
    )
}