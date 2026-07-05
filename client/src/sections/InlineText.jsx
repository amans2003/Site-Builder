
import { useRef, useEffect } from 'react'

export function InlineText({ as: Tag = 'p', value, onChange, className, style }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value
    }
  }, [value])

  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.innerText)}
    />
  )
}
