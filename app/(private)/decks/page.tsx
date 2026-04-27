"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import GenerateForm from "@/components/GenerateForm"
import { loadDecks, saveDeck, deleteDeck } from "@/lib/storage"
import { Deck, Flashcard } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import ProfilePanel from "@/components/ProfilePanel"

export default function Home() {
  const [showProfile, setShowProfile] = useState(false)
  const { user, loading } = useAuth()

  const router = useRouter()
  const [decks, setDecks] = useState<Deck[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loadingDecks, setLoadingDecks] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      router
    }

    if (!loading && user) {
      setLoadingDecks(true)
      loadDecks(user.id).then(data => {
        setDecks(data)
        setLoadingDecks(false)
      })
    }
  }, [user, loading])

  async function handleCardsGenerated(cards: Flashcard[], deckName: string) {
    if (!user) return
      await saveDeck(user.id, deckName, cards)
      const updated = await loadDecks(user.id)
      setDecks(updated)
      setShowForm(false)
  }

  async function handleDelete(id: string) {
    await deleteDeck(id)
    if (user) {
      const updated = await loadDecks(user.id)
      setDecks(updated)
    }
  }

  function handleStudy(id: string) {
    localStorage.setItem("studyingDeckId", id)
    router.push("/study")
  }

  if (showForm) {
    return (
      <div className="max-w-2x1 mx-auto mt-10">
        <button
          onClick={() => setShowForm(false)}
          className="text-sm text-gray-400 hover:text-gray-600 ml-6 mb-4"
        >
           ← Back
        </button>
        <GenerateForm onCardsGenerated={handleCardsGenerated} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Decks</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowProfile(true)}
            className="w-9 h-9 rounded-full bg-black text-white text-sm font-medium flex items-center justify-center"
          >
            {user?.email?.[0].toUpperCase()}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white rounded-xl p-3 px-6 font-semibold hover:bg-gray-800 transition-colors"
          >
            + New Deck
          </button>
        </div>
      </div>
      {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}

      {loadingDecks && (
        <p className="text-gray-400 text-center mt-20">Loading decks...</p>
      )}

      {!loadingDecks && decks.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-lg">No decks yet</p>
          <p className="text-sm mt-2">Create your first deck to get started</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {decks.map(deck => (
          <div
            key={deck.id}
            className="border-2 rounded-xl p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div>
              <h2 className="font-semibold text-lg">{deck.name}</h2>
              <p className="text-sm text-gray-400">{deck.cards.length} cards</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deck.id)}
                className="text-sm text-red-400 hover:text-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => handleStudy(deck.id)}
                className="bg-black text-white rounded-lg p-2 px-4 text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Study
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}