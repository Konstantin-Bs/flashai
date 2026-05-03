"use client"

import { useState, useEffect, use } from "react"
import { Flashcard, Deck } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import GenerateForm from "@/components/GenerateForm"

export default function DeckDetailPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = use(params)
  const {user, loading} = useAuth()
  const router = useRouter()
  const [cards, setCards] = useState<Flashcard[]>([])
  const [deckName, setDeckName] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState("")

  async function fetchDeck() {
      const { data, error } = await supabase
        .from("decks")
        .select(`id, name, cards(id, question, answer)`)
        .eq("id", id)

      if (error || !data) {
        router.push("/decks")
        return
      }

      setCards(data[0].cards)
      setDeckName(data[0].name)
      setEditedName(data[0].name)
    }

  useEffect(() => {

    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && user) {
      fetchDeck()
    }

  }, [user, loading])

  async function handleDeleteCard(cardId: string | undefined) {
    if (!cardId) return
    const { error } = await supabase
      .from("cards")
      .delete()
      .eq("id", cardId) 
    if (error) {
      alert("Something went wrong. Please try again.")
      return
    }
    setCards(prev => prev.filter(card => card.id !== cardId))
  }

  function handleIsEditingName() {
    setIsEditingName(true)
  }

  async function handleEditName() {
    if (editedName !== "") {
      const { error } = await supabase
        .from("decks")
        .update({ name: editedName })
        .eq("id", id)
      if (error) {
        alert("Something went wrong. Please try again.")
        return
      }
      setDeckName(editedName)
      setIsEditingName(false)
    } else {
      alert("Name can't be empty.")
    }
  }

  async function handleSuccess() {
    fetchDeck()
    setShowForm(false)
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
          <GenerateForm deckId={id} onSuccess={handleSuccess} />
        </div>
      )
    }

  return (
  <div>
    {!isEditingName && (
      <div>
        <h1>{deckName}</h1>
        <button onClick={handleIsEditingName}>
          editname
        </button>
      </div>
    )}
    {isEditingName && (
      <div>
        <input
          value={editedName}
          onChange={e => setEditedName(e.target.value)}
        />
        <button onClick={handleEditName}>
          editname
        </button>
      </div>
    )}
    <p>{cards.length} cards</p>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Question</th>
          <th>Answer</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {cards.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center text-gray-400 py-8">
              No cards yet
            </td>
          </tr>
        ) : (
        cards.map((card, index) => (
          <tr key={card.id}>
            <td>{index + 1}</td>
            <td>{card.question}</td>
            <td>{card.answer}</td>
            <td>
              <button
                onClick={() => handleDeleteCard(card.id)}
                className="w-full border border-red-300 text-red-500 rounded p-2 text-sm font-medium hover:bg-red-50"
              >
                Delete Card
              </button>
            </td>
          </tr>
        )))}
      </tbody>
    </table>
    <button onClick={() => setShowForm(true)}>
      Add Cards
    </button>
  </div>
)
}