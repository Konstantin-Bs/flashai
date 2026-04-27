import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase-server"

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

    const { notes, count } = await request.json()

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