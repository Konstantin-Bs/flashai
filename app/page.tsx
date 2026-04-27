"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function Home() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && user) {
            router.push("/home")
            router
        }
    }, [user, loading])

    function handleSignIn() {
        router.push("/login")
    }

    function handleSignUp() {
        router.push("/register")
    }

    return (
        <div>
            <h1>Login/Register here</h1>
            <button
                onClick={handleSignIn}
                className="bg-black text-white rounded p-2 font-medium disabled:opacity-50"
            >
                SignIn
            </button>
            <button
                onClick={handleSignUp}
                className="bg-black text-white rounded p-2 font-medium disabled:opacity-50"
            >
                SignUp
            </button>
        </div>
    )
}