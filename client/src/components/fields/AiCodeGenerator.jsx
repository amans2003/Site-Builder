import { useState } from 'react'
import { generateCode } from '../../api/ai'

export function AiCodeGenerator({ initialMessages, onGenerated }) {
  const [messages, setMessages] = useState(initialMessages || [])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const priorPrompts = messages.filter((m) => m.role === 'user')

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)
    try {
      const result = await generateCode(prompt, messages)
      const nextMessages = [
        ...messages,
        { role: 'user', content: prompt },
        { role: 'assistant', content: JSON.stringify(result) },
      ]
      setMessages(nextMessages)
      onGenerated(result, nextMessages)
      setPrompt('')
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-4 p-2 rounded border border-dashed border-purple-300 bg-purple-50">
      <label className="block text-xs font-medium text-purple-700 mb-1">Generate with AI</label>

      {priorPrompts.length > 0 && (
        <div className="mb-2 max-h-24 overflow-y-auto flex flex-col gap-1">
          {priorPrompts.map((m, i) => (
            <p key={i} className="text-xs text-purple-900 bg-white/60 rounded px-2 py-1">
              {m.content}
            </p>
          ))}
        </div>
      )}

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={
          priorPrompts.length > 0
            ? 'Ask for a change, e.g. "make the button bigger"'
            : "Describe what you want, e.g. 'a pricing table with 3 tiers'"
        }
        rows={2}
        className="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2"
      />
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : priorPrompts.length > 0 ? 'Continue' : 'Generate'}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
