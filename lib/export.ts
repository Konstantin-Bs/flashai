/**
 * formats flashcards into a string separated by tab
 * @returns questions and answers seperated by tab
 */
export function formatAsTXT(
  cards: { question: string; answer: string }[]
): string {
  return cards.map((card) => `${card.question}\t${card.answer}`).join("\n")
}

export function formatAsJson(
  name: string,
  cards: { question: string; answer: string }[]
) {
  return {
    name,
    cards: cards.map((card) => ({
      question: card.question,
      answer: card.answer,
    })),
  }
}

export function buildExportData(
  email: string,
  createdAt: string,
  decks: {
    name: string
    created_at?: string
    cards: { question: string; answer: string; created_at?: string }[]
  }[]
) {
  return {
    exported_at: new Date().toISOString(),
    account: {
      email,
      created_at: createdAt,
    },
    decks: decks.map((deck) => ({
      name: deck.name,
      created_at: deck.created_at,
      cards: deck.cards.map((card) => ({
        question: card.question,
        answer: card.answer,
        created_at: card.created_at,
      })),
    })),
  }
}
