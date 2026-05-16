import mammoth from "mammoth"

export const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt", ".md"]
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
]
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10mb

export function isValidFileExtension(extension: string): boolean {
  return ALLOWED_EXTENSIONS.includes(extension.toLowerCase())
}

export function isValidFileSize(sizeInBytes: number): boolean {
  return sizeInBytes <= MAX_FILE_SIZE
}

// using require() instead of import because pdf-parse-fork
// doesn't work well with ES module imports in Next.js
const pdfParse = require("pdf-parse-fork")

/**
 * Extracts plain text from uploaded files.
 * @returns empty string for image-only PDFs.
 */
export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
  extension: string
): Promise<string> {
  if (extension === ".pdf") {
    const data = await pdfParse(buffer)
    return data.text
  }

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }

  if (extension === ".txt" || extension === ".md") {
    return buffer.toString("utf-8")
  }
  throw new Error("Unsupported file type")
}
