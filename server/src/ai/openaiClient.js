import OpenAI from 'openai'

let client = null

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    const err = new Error('AI features are not configured on the server (missing OPENAI_API_KEY)')
    err.status = 503
    throw err
  }
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return client
}

export const AI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini'
