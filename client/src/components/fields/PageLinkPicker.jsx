const CUSTOM = '__custom__'

export function PageLinkPicker({ value, pages, onChange }) {
  const isKnownPage = pages.some((p) => p.name === value)
  const selectValue = isKnownPage ? value : CUSTOM

  return (
    <div className="flex flex-col gap-1">
      <select
        value={selectValue}
        onChange={(e) => onChange(e.target.value === CUSTOM ? '' : e.target.value)}
        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
      >
        {pages.map((p) => (
          <option key={p.name} value={p.name}>
            {p.name}
          </option>
        ))}
        <option value={CUSTOM}>Custom URL...</option>
      </select>
      {!isKnownPage && (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https:// or #section"
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
        />
      )}
    </div>
  )
}
