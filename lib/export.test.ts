import { describe, it, expect } from "vitest"
import { formatAsTXT, buildExportData, formatAsJson } from "./export"

describe("formatAsTXT", () => {
  it("formats a single card with tab between question ans answer", () => {
    const cards = [{ question: "What does 1 and 1 equal to?", answer: "2" }]
    const result = formatAsTXT(cards)
    expect(result).toBe("What does 1 and 1 equal to?\t2")
  })

  it("joins multiple cards with new lines", () => {
    const cards = [
      { question: "Q1", answer: "A1" },
      { question: "Q2", answer: "A2" },
    ]
    const result = formatAsTXT(cards)
    expect(result).toBe("Q1\tA1\nQ2\tA2")
  })

  it("returns empty string for empty array", () => {
    const result = formatAsTXT([])
    expect(result).toBe("")
  })

  it("handles special characters in question and answer", () => {
    const cards = [{ question: "What is H2O?", answer: "Water - H₂O" }]
    const result = formatAsTXT(cards)
    expect(result).toBe("What is H2O?\tWater - H₂O")
  })
})

describe("formatAsJson", () => {
  const mockCards = [
    {
      question: "What is mitosis?",
      answer: "Cell division",
    },
    {
      question: "What is photosynthesis?",
      answer: "Light to energy",
    },
    {
      question: "When did WW2 end?",
      answer: "1945",
    },
  ]

  it("includes correct deck name", () => {
    const result = formatAsJson("testName", mockCards)
    expect(result.name).toBe("testName")
  })

  it("includes all cards", () => {
    const result = formatAsJson("testName", mockCards)
    expect(result.cards).toHaveLength(3)
  })

  it("includes correct question and answers in cards", () => {
    const result = formatAsJson("testName", mockCards)
    expect(result.cards[0].question).toBe("What is mitosis?")
    expect(result.cards[0].answer).toBe("Cell division")
  })

  it("returns empty cards array for deck with no cards", () => {
    const result = formatAsJson("testName", [])
    expect(result.cards).toHaveLength(0)
  })
})

describe("buildExportData", () => {
  const mockDecks = [
    {
      name: "Biology",
      created_at: "2026-04-01",
      cards: [
        {
          question: "What is mitosis?",
          answer: "Cell division",
          created_at: "2026-04-02",
        },
        {
          question: "What is photosynthesis?",
          answer: "Light to energy",
          created_at: "2026-04-02",
        },
      ],
    },
    {
      name: "History",
      created_at: "2026-04-05",
      cards: [
        {
          question: "When did WW2 end?",
          answer: "1945",
          created_at: "2026-04-06",
        },
      ],
    },
  ]

  it("includes the correct email in account section", () => {
    const result = buildExportData("test@example.com", "2026-01-01", mockDecks)
    expect(result.account.email).toBe("test@example.com")
  })

  it("includes the correct account creation date", () => {
    const result = buildExportData("test@example.com", "2026-01-01", mockDecks)
    expect(result.account.created_at).toBe("2026-01-01")
  })

  it("includes exported_at timestamp", () => {
    const result = buildExportData("test@example.com", "2026-01-01", mockDecks)
    expect(result.exported_at).toBeDefined() //just checks it exists because newDate().toISOString() changes every ms.
  })

  it("includes all decks", () => {
    const result = buildExportData("test@example.com", "2026-01-01", mockDecks)
    expect(result.decks).toHaveLength(2)
  })

  it("includes correct deck names", () => {
    const result = buildExportData("test@example.com", "2026-01-01", mockDecks)
    expect(result.decks[0].name).toBe("Biology")
    expect(result.decks[1].name).toBe("History")
  })

  it("includes correct cards in each deck", () => {
    const result = buildExportData("test@example.com", "2026-01-01", mockDecks)
    expect(result.decks[0].cards).toHaveLength(2)
    expect(result.decks[1].cards).toHaveLength(1)
  })

  it("includes correct question and answer in cards", () => {
    const result = buildExportData("test@example.com", "2026-01-01", mockDecks)
    expect(result.decks[0].cards[0].question).toBe("What is mitosis?")
    expect(result.decks[0].cards[0].answer).toBe("Cell division")
  })

  it("returns empty decks array when no decks provided", () => {
    const result = buildExportData("test@example.com", "2026-01-01", [])
    expect(result.decks).toHaveLength(0)
  })
})
