"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn, signInWithGoogle } from "@/lib/auth"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] =useState(false)

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

    return (
        <div className="max-w-sm mx-auto mt-20 p-6">
            <h1 className="text-2x1 font-bold mb-6">Login</h1>

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
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border rounded p-2 w-full"
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="bg-black text-white rounded p-2 font-medium disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-sm text-gray-500 text-center">
                    No account?{" "}
                    <Link href="/register" className="text-black underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}