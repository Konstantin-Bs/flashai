"use client"

import { useState } from "react"
import { Flashcard } from "@/lib/types"

interface Props {
  card: Flashcard
  index: number
  total: number
  onGotIt: () => void
  onStillLearning: () => void
}

export default function FlashCard({
  card,
  index,
  total,
  onGotIt,
  onStillLearning,
}: Props) {
  const [flipped, setFlipped] = useState(false)

  function handleGotIt() {
    setFlipped(false)
    onGotIt()
  }

  function handleStillLearning() {
    setFlipped(false)
    onStillLearning()
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 max-w-2x1 mx-auto">
      <p className="text-sm dark:text-gray-400">
        {index + 1} / {total}
      </p>

      <div
        onClick={() => setFlipped(!flipped)}
        className="w-full min-h-48 border-2 rounded-md rounded-x1 p-8 cursor pointer flex items-center justify-center text-center text-lg font-medium dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-50 transition-colors"
      >
        {flipped ? card.answer : card.question}
      </div>

      <p className="text-sm text-gray-400">
        {flipped ? "Answer" : "Click to reveal answer"}
      </p>

      {flipped && (
        <div className="flex gap-4 w-lg">
          <button
            onClick={handleStillLearning}
            className="flex-1 rounded-md p-2 py-3 bg-red-600 hover:bg-red-700"
          >
            Still Learning
          </button>
          <button
            onClick={handleGotIt}
            className="flex-1 rounded-md p-2 py-3 bg-green-600 hover:bg-green-700"
          >
            Got It
          </button>
        </div>
      )}
    </div>
  )
}
