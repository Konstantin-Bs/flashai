import { describe, it, expect } from "vitest"
import { isValidFileExtension, isValidFileSize, MAX_FILE_SIZE } from "./extract"

describe("isValidFileExtension", () => {
  it("accepts all supported file extensions", () => {
    expect(isValidFileExtension(".pdf")).toBe(true)
    expect(isValidFileExtension(".docx")).toBe(true)
    expect(isValidFileExtension(".txt")).toBe(true)
    expect(isValidFileExtension(".md")).toBe(true)
  })

  it("rejects usupported file extension", () => {
    expect(isValidFileExtension(".exe")).toBe(false)
    expect(isValidFileExtension(".jpg")).toBe(false)
    expect(isValidFileExtension(".mp4")).toBe(false)
    expect(isValidFileExtension(".zip")).toBe(false)
  })

  it("is case insensitive", () => {
    expect(isValidFileExtension(".PDF")).toBe(true)
    expect(isValidFileExtension(".DOCX")).toBe(true)
    expect(isValidFileExtension(".TXT")).toBe(true)
    expect(isValidFileExtension(".MD")).toBe(true)
  })

  it("rejects empty string", () => {
    expect(isValidFileExtension("")).toBe(false)
  })
})

describe("isValidFileSize", () => {
  it("accepts files under the limit", () => {
    expect(isValidFileSize(1 * 1024 * 1024)).toBe(true) // 1MB
    expect(isValidFileSize(5 * 1024 * 1024)).toBe(true) // 5MB
  })

  it("accepts files exactly at the limit", () => {
    expect(isValidFileSize(MAX_FILE_SIZE)).toBe(true) // exactly 10MB
  })

  it("rejects files over the limit", () => {
    expect(isValidFileSize(11 * 1024 * 1024)).toBe(false) // 11MB
    expect(isValidFileSize(MAX_FILE_SIZE + 1)).toBe(false) // one byte over
  })

  it("accepts empty files", () => {
    expect(isValidFileSize(0)).toBe(true)
  })
})
