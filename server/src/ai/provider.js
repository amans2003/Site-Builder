import { getOpenAIClient, AI_MODEL as OPENAI_MODEL } from './openaiClient.js'
import { getGeminiClient, GEMINI_MODEL } from './geminiClient.js'

function resolveProvider() {
  const configured = (process.env.AI_PROVIDER || '').toLowerCase()
  if (configured === 'openai' || configured === 'gemini') return configured
  // Auto-detect: prefer Gemini (free tier) if configured, otherwise fall back to OpenAI.
  if (process.env.GEMINI_API_KEY) return 'gemini'
  if (process.env.OPENAI_API_KEY) return 'openai'
  return 'gemini'
}

async function askGemini(systemPrompt, userPrompt, history) {
  const client = getGeminiClient()
  const priorTurns = (history || []).map((turn) => ({
    role: turn.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: turn.content }],
  }))

  const response = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents: [...priorTurns, { role: 'user', parts: [{ text: userPrompt }] }],
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
    },
  })

  try {
    return JSON.parse(response.text)
  } catch {
    return null
  }
}

async function askOpenAI(systemPrompt, userPrompt, history) {
  const openai = getOpenAIClient()
  const priorTurns = (history || []).map((turn) => ({ role: turn.role, content: turn.content }))

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      ...priorTurns,
      { role: 'user', content: userPrompt },
    ],
  })

  try {
    return JSON.parse(completion.choices[0]?.message?.content)
  } catch {
    return null
  }
}

export async function askForJSON(systemPrompt, userPrompt, history) {
  const provider = resolveProvider()
  return provider === 'openai'
    ? askOpenAI(systemPrompt, userPrompt, history)
    : askGemini(systemPrompt, userPrompt, history)
}
