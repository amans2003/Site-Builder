import Editor from '@monaco-editor/react'

const LANGUAGE_BY_KEY = { html: 'html', css: 'css', js: 'javascript' }

export function CodeField({ label, fieldKey, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="border border-gray-300 rounded overflow-hidden">
        <Editor
          height="160px"
          language={LANGUAGE_BY_KEY[fieldKey] || 'plaintext'}
          value={value || ''}
          onChange={(v) => onChange(v ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  )
}
