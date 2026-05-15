"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { loadDecks } from "@/lib/storage"
import { Loader2 } from "lucide-react"

export default function ExportData() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  })

  async function handleExport() {
    if (!user) return

    setExportLoading(true)

    const decks = await loadDecks(user.id)

    const exportData = {
      exported_at: new Date().toISOString(),
      account: {
        email: user.email,
        created_at: user.created_at,
      },
      decks: decks.map((deck) => ({
        name: deck.name,
        created_at: deck.created_at,
        card: deck.cards.map((card) => ({
          question: card.question,
          answer: card.answer,
          created_at: card.created_at,
        })),
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "flashai-data.json"
    a.click()
    URL.revokeObjectURL(url)

    setExportLoading(false)
  }

  return (
    <div className="max-w-sm top-20 p-6 flex flex-col gap-4">
      <h1 className="text-2xl p-6 font-semibold mb-3 text-center">
        Export saved data:
      </h1>

      <Download size={100} strokeWidth={1.5} className="w-full mb-4.5" />

      <button
        onClick={handleExport}
        disabled={exportLoading}
        className="rounded-md py-2.5 px-10 font-semibold disabled:opacity-50 text-white bg-blue-800/85 hover:bg-blue-800 cursor-pointer"
      >
        {exportLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Exporting Data
          </div>
        ) : (
          "Export Data"
        )}
      </button>
    </div>
  )
}
