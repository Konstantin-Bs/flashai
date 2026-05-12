export interface Flashcard{
    id?: string
    question: string
    answer: string
    created_at?: string
}

export interface Deck{
    id: string
    name: string
    cards: Flashcard[]
    created_at?: string
}