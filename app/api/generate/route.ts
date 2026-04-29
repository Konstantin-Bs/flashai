import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase-server"
import { extractTextFromFile } from "@/lib/extract"

const flashcardSchema = z.object({
    flashcards: z.array(
        z.object({
            question: z.string(),
            answer: z.string(),
        })
    ),
})

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return Response.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    let notes: string
    let count: number

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
        const body = await request.json()
        notes = body.notes
        count = body.count
    } else {
        const formData = await request.formData()
        const files = formData.getAll('files') as File[]
        count = parseInt(formData.get('count') as string)

        const allowedExtensions = ['.pdf', '.docx', '.txt', '.md']
        const extractedTexts: string[] = []

        for (const file of files) {
            const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()

            if (!allowedExtensions.includes(extension)) {
                return Response.json(
                    { error: `Unsupported file type: ${file.name}` },
                    { status: 400 }
                )
            }

            if (file.size > 10 * 1024 * 1024) {
                return Response.json(
                    { error: `File too large: ${file.name}` },
                    { status: 400 }
                )
            }

            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            const text = await extractTextFromFile(buffer, file.type, extension)

            if (text.trim().length < 50) {
                return Response.json(
                    { error: `Could not extract text from ${file.name}. If it's a scanned PDF, please copy text manually instead.` },
                    { status: 400 }
                )
            }
            extractedTexts.push(text)
        }
        notes = extractedTexts.join('\n\n---\n\n')
    }

    try {
        const result = await generateObject({
            model: google("gemini-2.5-flash"),
            schema: flashcardSchema,
            prompt: `You are a study assistent. Generate exactly ${count} flashcards from the following notes.
            
Rules:
 - Each card must have one clear question and one concise answer
 - Questions should test understanding, not just memorization
 - Avoid yes/no questions
 - Cover the most important concepts in the notes

Notes:
${notes}`,
            maxRetries: 0,
    });

    return Response.json({ flashcards: result.object.flashcards })
    } catch (error) {
        console.error(error)
        return Response.json(
            { error: "Failed to generate flashcards"},
            { status: 500 }
        )
    }
}