import { GoogleGenAI } from '@google/genai'

let client = null

export function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    const err = new Error('AI features are not configured on the server (missing GEMINI_API_KEY)')
    err.status = 503
    throw err
  }
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  return client
}

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
