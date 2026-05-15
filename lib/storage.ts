import { supabase } from "./supabase"
import { Deck, Flashcard } from "./types"

/**
 * Loads existing decks of given user
 *
 * @returns all of the users existing decks
 */
export async function loadDecks(userId: string): Promise<Deck[]> {
  const { data: decks, error } = await supabase
    .from("decks")
    .select(`id, name, created_at, cards(id, created_at, question, answer)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return decks as Deck[]
}

/**
 * Deletes deck in database
 */
export async function deleteDeck(deckId: string): Promise<void> {
  const { error } = await supabase.from("decks").delete().eq("id", deckId)

  if (error) console.error(error)
}

/**
 * Creates deck in database
 *
 * @returns the id of the created deck
 */
export async function createDeck(
  userId: string,
  name: string
): Promise<string | null> {
  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .insert({ name, user_id: userId })
    .select()
    .single()

  if (deckError || !deck) {
    console.error(deckError)
    return null
  }

  return deck.id
}

/**
 * Adds cards to an existing deck
 *
 * @returns true if successful, false if not
 */
export async function addCardsToDeck(
  deckId: string,
  cards: Flashcard[]
): Promise<boolean> {
  const cardsToInsert = cards.map((card) => ({
    deck_id: deckId,
    question: card.question,
    answer: card.answer,
  }))

  const { error } = await supabase.from("cards").insert(cardsToInsert)

  if (error) {
    console.error(error)
    return false
  }
  return true
}
