"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createDeck } from "@/lib/storage"
import { useAuth } from "@/lib/auth-context"

export default function NameForm() {
    const [deckName, setDeckName] = useState("")
    const [deckLoading, setDeckLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const { user, loading } = useAuth()

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

    /*
        <button onClick={() => router.back()} className="text-sm text-gray-400 mb-4">
                Back
        </button>  //this goes above the h1 but back button already exists outside the form!!
    */
    return (
        <div className="max-w-sm mx-auto mt-20 p-6">
            <h1 className="text-2x1 font-bold mb-6">New Deck</h1>
            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Deck name"
                    value={deckName}
                    onChange={e => setDeckName(e.target.value)}
                    className="border rounded p-2 w-full"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    onClick={handleCreateDeck}
                    disabled={deckLoading}
                    className="bg-black text-white rounded p-2 font-medium disabled:opacity-50"
                >
                    {deckLoading ? "Creating..." : "Create Deck"}
                </button>
            </div>
        </div>
    )
}