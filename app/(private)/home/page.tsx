"use client"

import { useAuth } from "@/lib/auth-context"
import ProfilePanel from "@/components/ProfilePanel"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [showProfile, setShowProfile] = useState(false)

    useEffect(() => {
        if (!loading && !user) {
      router.push("/")
      router
        }
    }, [user, loading])

    function handleDecks() {
        router.push("/decks")
    }

    return(
        <div>
        <div className="flex items-center justify-between mb-8">
            <button
                onClick={handleDecks}
                className="bg-black text-white rounded p-2 font-medium disabled:opacity-50"
            >
                My Decks
            </button>
            <button
            onClick={() => setShowProfile(true)}
            className="w-9 h-9 rounded-full bg-black text-white text-sm font-medium flex items-center justify-center"
            >
            {user?.email?.[0].toUpperCase()}
            </button>
        </div>
        {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}
        </div>
    )
}