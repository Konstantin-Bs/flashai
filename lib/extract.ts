import mammoth from "mammoth"

// using require() instead of import because pdf-parse-fork
// doesn't work well with ES module imports in Next.js
const pdfParse = require("pdf-parse-fork")

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
