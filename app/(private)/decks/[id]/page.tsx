"use client"

import { useState, useEffect, use, useRef } from "react"
import { Flashcard } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import GenerateForm from "@/components/GenerateForm"
import { Pencil, Check, Trash2, ArrowLeft, Download, X } from "lucide-react"
import { formatAsTXT, formatAsJson } from "@/lib/export"

export default function DeckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { user, loading } = useAuth()
  const router = useRouter()
  const [cards, setCards] = useState<Flashcard[]>([])
  const [deckName, setDeckName] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const [loadingCards, setLoadingCards] = useState(true)
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [editQuestion, setEditQuestion] = useState("")
  const [editAnswer, setEditAnswer] = useState("")

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
      setLoadingCards(false)
    }
  }, [user, loading])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setShowDropdown])

  async function handleDeleteCard(cardId: string | undefined) {
    if (!cardId) return
    const { error } = await supabase.from("cards").delete().eq("id", cardId)
    if (error) {
      alert("Something went wrong. Please try again.")
      return
    }
    setCards((prev) => prev.filter((card) => card.id !== cardId))
  }

  function startEditing(cardId: string | undefined) {
    if (!cardId) return
    const card = cards.find((c) => c.id === cardId)
    if (!card) return
    setEditingCardId(cardId)
    setEditQuestion(card.question)
    setEditAnswer(card.answer)
  }

  async function handleSaveCard(cardId: string | undefined) {
    if (!cardId) return
    console.log("saving card:", cardId, editQuestion, editAnswer)
    const { error } = await supabase
      .from("cards")
      .update({ question: editQuestion, answer: editAnswer })
      .eq("id", cardId)

    console.log("update error:", error)

    if (error) {
      alert("Something went wrong. Please try again.")
      return
    }
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? { ...card, question: editQuestion, answer: editAnswer }
          : card
      )
    )
    setEditingCardId(null)
  }

  function handleCancel() {
    setEditingCardId(null)
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

  function handleExportJSON() {
    if (!user) return

    const exportData = formatAsJson(deckName, cards)

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${deckName}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleExportTXT() {
    if (!user) return

    const exportData = formatAsTXT(cards)

    const blob = new Blob([exportData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${deckName}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (showForm) {
    return (
      <div>
        <GenerateForm
          deckId={id}
          onSuccess={handleSuccess}
          onClose={() => setShowForm(false)}
        />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {editingCardId && (
        <div
          className="fixed inset-0 bg-black/40 z-10"
          onClick={handleCancel}
        />
      )}
      <div className="flex items-center justify-between pb-3">
        <button
          aria-label="return"
          className="hover:text-gray-400 cursor-pointer"
          onClick={() => router.push("/decks")}
        >
          <ArrowLeft />
        </button>
        {!isEditingName && (
          <div className="flex items-center gap-3.5 pl-2">
            <h1 className="text-xl pl-0.5 cursor-default">{deckName}</h1>
            <button
              onClick={() => setIsEditingName(true)}
              className="rounded-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-slate-900 p-1 cursor-pointer"
              aria-label="Edit deck name"
            >
              <Pencil size={15} />
            </button>
          </div>
        )}
        {isEditingName && (
          <div className="flex items-center gap-3.5 pl-2">
            <input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditName()
              }}
              className="text-xl border rounded-md pl-0.5"
              size={15}
            />
            <button
              onClick={handleEditName}
              className="rounded-sm bg-green-600 hover:bg-green-700 p-1 cursor-pointer"
              aria-label="submit new deck name"
            >
              <Check size={15} />
            </button>
          </div>
        )}
        <div className="flex gap-5">
          <div className="relative">
            <button
              aria-label="download deck"
              onClick={() => setShowDropdown(!showDropdown)}
              className="rounded-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-slate-900 p-1 cursor-pointer"
            >
              <Download size={15} />
            </button>
            {showDropdown && (
              <div
                ref={panelRef}
                className="absolute left-1/2 -translate-x-1/2 mt-3 w-38 rounded-md border border-black dark:border-white/30 bg-white dark:bg-slate-900 shadow-lg z-10"
              >
                <button
                  className="w-full text-left pl-2 py-2 hover:bg-gray-300 dark:hover:bg-slate-800"
                  onClick={() => {
                    handleExportJSON()
                    setShowDropdown(false)
                  }}
                >
                  Export as JSON
                </button>
                <button
                  className="w-full text-left pl-2 py-2 hover:bg-gray-300 dark:hover:bg-slate-800"
                  onClick={() => {
                    handleExportTXT()
                    setShowDropdown(false)
                  }}
                >
                  Export as .txt
                </button>
              </div>
            )}
          </div>
          <p>{cards.length} cards</p>
        </div>
      </div>
      {loadingCards && (
        <div className="animate-pulse">
          <div className="w-full">
            <div className="flex gap-2 mb-2">
              <div className="h-8 w-8 bg-gray-200 dark:bg-slate-800 rounded" />
              <div className="h-8 flex-1 bg-gray-200 dark:bg-slate-800 rounded" />
              <div className="h-8 flex-1 bg-gray-200 dark:bg-slate-800 rounded" />
              <div className="h-8 w-10 bg-gray-200 dark:bg-slate-800 rounded" />
            </div>

            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-2 mb-2">
                <div className="h-10 w-8 bg-gray-100 dark:bg-slate-700 rounded" />
                <div className="h-10 flex-1 bg-gray-100 dark:bg-slate-700 rounded" />
                <div className="h-10 flex-1 bg-gray-100 dark:bg-slate-700 rounded" />
                <div className="h-10 w-10 bg-gray-100 dark:bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      )}
      {cards.length === 0 ? (
        <div className="text-center py-8">No cards yet</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-black dark:border-white/30 p-2">
                #
              </th>
              <th className="border border-black dark:border-white/30 p-2 text-left">
                Question
              </th>
              <th className="border border-black dark:border-white/30 p-2 text-left">
                Answer
              </th>
              <th className="border border-black dark:border-white/30 p-2 w-10"></th>
              <th className="border border-black dark:border-white/30 p-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card, index) => (
              <tr
                key={card.id}
                className={`bg-gray-100 dark:bg-slate-900 ${editingCardId === card.id ? "relative z-20" : ""}`}
              >
                <td className="border border-black dark:border-white/10 p-2 text-center">
                  {index + 1}
                </td>

                {editingCardId === card.id ? (
                  <>
                    <td className="border border-black dark:border-white/10 p-2">
                      <textarea
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement
                          target.style.height = "auto"
                          target.style.height = `${target.scrollHeight}px`
                        }}
                        style={{ height: "auto" }}
                        ref={(el) => {
                          if (el) {
                            el.style.height = "auto"
                            el.style.height = `${el.scrollHeight}px`
                          }
                        }}
                        className="w-full bg-transparent outline-none resize-none overflow-hidden"
                        rows={1}
                      />
                    </td>
                    <td className="border border-black dark:border-white/10 p-2">
                      <textarea
                        value={editAnswer}
                        onChange={(e) => setEditAnswer(e.target.value)}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement
                          target.style.height = "auto"
                          target.style.height = `${target.scrollHeight}px`
                        }}
                        style={{ height: "auto" }}
                        ref={(el) => {
                          if (el) {
                            el.style.height = "auto"
                            el.style.height = `${el.scrollHeight}px`
                          }
                        }}
                        className="w-full bg-transparent outline-none resize-none overflow-hidden"
                        rows={1}
                      />
                    </td>
                    <td className="border border-black dark:border-white/10 p-2">
                      <button
                        aria-label="edit card"
                        onClick={() => handleSaveCard(card.id)}
                        className="border border-transparent rounded p-2 cursor-pointer text-green-500 hover:text-green-700"
                      >
                        <Check />
                      </button>
                    </td>
                    <td className="border border-black dark:border-white/10 p-2">
                      <button
                        aria-label="delete card"
                        onClick={() => handleCancel()}
                        className="border border-transparent rounded p-2 cursor-pointer text-red-500 hover:text-red-700"
                      >
                        <X />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border border-black dark:border-white/10 p-2">
                      <textarea
                        value={card.question}
                        readOnly
                        className="w-full bg-transparent outline-none resize-none overflow-hidden cursor-default"
                        ref={(el) => {
                          if (el) {
                            el.style.height = "auto"
                            el.style.height = `${el.scrollHeight}px`
                          }
                        }}
                        rows={1}
                      />
                    </td>
                    <td className="border border-black dark:border-white/10 p-2">
                      <textarea
                        value={card.answer}
                        readOnly
                        className="w-full bg-transparent outline-none resize-none overflow-hidden cursor-default"
                        ref={(el) => {
                          if (el) {
                            el.style.height = "auto"
                            el.style.height = `${el.scrollHeight}px`
                          }
                        }}
                        rows={1}
                      />
                    </td>
                    <td className="border border-black dark:border-white/10 p-2">
                      <button
                        aria-label="edit card"
                        onClick={() => startEditing(card.id)}
                        className="border border-transparent rounded p-2 cursor-pointer text-blue-500 hover:text-blue-700"
                      >
                        <Pencil />
                      </button>
                    </td>
                    <td className="border border-black dark:border-white/10 p-2">
                      <button
                        aria-label="delete card"
                        onClick={() => handleDeleteCard(card.id)}
                        className="border border-transparent rounded p-2 cursor-pointer text-red-500 hover:text-red-700"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md py-3 px-10 text-2xl font-semibold text-white bg-blue-800/85 hover:bg-blue-800 cursor-pointer"
        >
          Add Cards
        </button>
      </div>
    </div>
  )
}
