"use client"

import { useState, useRef } from "react"
import { Flashcard } from "@/lib/types"

interface Props {
    onCardsGenerated: (cards: Flashcard[], deckName: string) => void
}

export default function GenerateForm({ onCardsGenerated }: Props) {
    const [notes, setNotes] = useState("")
    const [deckName, setDeckName] = useState("")
    const [count, setCount] = useState(3)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [input, setInput] = useState(true)

    const [files, setFiles] = useState<File[]>([])
    const [drag, setDrag] = useState(false)
    const [fileError, setFileError] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function handleGenerate() {
       if (!deckName.trim()) {
        setError("Please enter a deck name")
        return
       }

       if (input && !notes.trim()) {
        setError("Please enter your notes")
        return
       }

       if (!input && files.length === 0) {
        setError("Please add at least one file")
        return
       }

       setLoading(true)
       setError("")

       try {
        let response

        if (input) {
            //text mode
            response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes, count }),
            })
        } else {
            //file mode
            const formData = new FormData()
            files.forEach(file => formData.append("files", file))
            formData.append("count", count.toString())

            response = await fetch("/api/generate", {
                method: "POST",
                body: formData,
            })
        }

        const data = await response.json()

        if (data.error) {
            setError(data.error)
            return
        }

        onCardsGenerated(data.flashcards, deckName)
       } catch (e) {
        setError("Something went wrong, please try again")
       } finally {
        setLoading(false)
       }
    }

    function handleTextInput() {
        setInput(true);
    }

    function handleFileInput() {
        setInput(false);
    }

    function validateAndSetFiles(newFiles: File[]) {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/markdown'
        ]
        const allowedExtensions = ['.pdf', '.docx', '.txt', '.md']
        
        const valid: File[] = []
        const errors: string[] = []

        newFiles.forEach(file => {
            const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
            if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
                errors.push(`${file.name}: unsupported file type`)
                return
            }
            if (file.size > 10 * 1024 * 1024) {
                errors.push(`${file.name}: file too large (max 10MB)`)
                return
            }
            valid.push(file)
        })

        if (errors.length > 0) setFileError(errors.join(', '))
        else setFileError("")

        setFiles(prev => [...prev, ...valid])
    }

    return (
        <div className="flex flex-col gap-4 max-w-2x1 mx-auto p-6">
            <h1 className="text-2x1 font-bold">Generate Flashcards</h1>

            <div>
                <button onClick={handleTextInput}
                        disabled={input}
                        className="bg-blue-500 text-white rounded p-2 font-semibold disabled:opacity-50">
                    Paste Text
                </button>
                <button onClick={handleFileInput}
                        disabled={!input}
                        className="bg-red-500 text-white rounded p-2 font-semibold disabled:opacity-50">
                    Upload File
                </button>
            </div>

            <input
                type="text"
                placeholder="Deck name"
                value={deckName}
                onChange={e => setDeckName(e.target.value)}
                className="border rounded p-2 w-full"
            />

            {input && (
            <div>
            <textarea
                placeholder="Paste your notes here..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={8}
                className="border rounded p-2 w-full resize-none"
            />
            </div>
            )}

            {!input && (
                <div>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); setDrag(true) }}
                        onDragEnter={() => setDrag(true)}
                        onDragLeave={() => setDrag(false)}
                        onDrop={e => {
                            e.preventDefault()
                            setDrag(false)
                            const dropped = Array.from(e.dataTransfer.files)
                            if (dropped.length > 0) validateAndSetFiles(dropped)
                        }}
                        className={`border-2 rounded p-8 w-full text-center cursor-pointer transition-colors ${
                            drag ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'
                            }`}
                    >
                        {files.length > 0 ? (
                            <div className="flex flex-col gap-2 w-full">
                                {files.map((f, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700 truncate">{f.name}</span>
                                    <button
                                    onClick={e => {
                                        e.stopPropagation()
                                        setFiles(prev => prev.filter((_, i) => i !== index))
                                    }}
                                    className="text-xs text-red-400 hover:text-red-600 ml-2 shrink-0"
                                    >
                                    Remove
                                    </button>
                                </div>
                                ))}
                                <p className="text-xs text-gray-400 mt-1">Click or drop to add more files</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                <p className="text-sm">Drag & drop your files here</p>
                                <p className="text-xs">or click to browse</p>
                                <p className="text-xs mt-2">PDF, DOCX, TXT, MD - max 10MB each</p>
                            </div>
                        )}
                        <input 
                            type="file"
                            ref={fileInputRef}
                            multiple
                            className="hidden"
                            accept=".pdf,.docx,.txt,.md"
                            onChange={e => {
                                const selected = Array.from(e.target.files || [])
                                if (selected.length > 0) validateAndSetFiles(selected)
                            }}
                        />
                    </div>
                    {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
                </div>
            )}

            <select
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="border rounded p-2 w-full"
            >
                <option value={3}>3 Cards</option>
                <option value={10}>10 Cards</option>
                <option value={20}>20 Cards</option>
                <option value={30}>30 Cards</option>
            </select>

            {error && <p className="text-red-500">{error}</p>}

            <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-blue-500 text-white rounded p-2 font-semibold disabled:opacity-50"
            >
                {loading ? "Generating..." : "Generate Flashcards"}
            </button>
        </div>
    )
}