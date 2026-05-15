"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { createDeck } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

interface Props {
    onClose: () => void
}

export default function NameForm({ onClose }: Props) {
    const [deckName, setDeckName] = useState("")
    const [deckLoading, setDeckLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const { user, loading } = useAuth()

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose()
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [])

    async function handleCreateDeck() {
        if (!deckName.trim()) {
            setError("Please enter a deck name")
            return
        }
        setDeckLoading(true)
        if (!user) return
        const deckId = await createDeck(user.id, deckName)
        if (deckId) {
            router.push(`/decks/${deckId}`)
        } else {
            setError("Something went wrong. Please try again.")
            setDeckLoading(false)
        }
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
                    <h1 className="text-2x1 font-bold mb-4">New Deck</h1>
                    <button 
                        aria-label="exit"
                        onClick={onClose}
                        className="text-xl mb-6 cursor-pointer hover:opacity-50"
                    >
                        ✕
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Deck name"
                        value={deckName}
                        onChange={e => setDeckName(e.target.value)}
                        onKeyDown={e => {if (e.key === "Enter") handleCreateDeck()}}
                        className="border border-black dark:border-white/30 rounded-md p-2 w-full"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        onClick={handleCreateDeck}
                        disabled={deckLoading}
                        className="rounded-md p-2 font-semibold disabled:opacity-50 text-white bg-blue-800/85 hover:bg-blue-800 cursor-pointer"
                    >
                        {deckLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 size={16} className="animate-spin"/>
                            Creating
                        </div>
                        ) : (
                            "Create Deck"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}