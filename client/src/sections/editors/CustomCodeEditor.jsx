import { useMemo, useRef, useEffect } from 'react'
import DOMPurify from 'dompurify'

export function CustomCodeEditor({ props }) {
  const { html, css, js } = props
  const iframeRef = useRef(null)

  const sanitizedHtml = useMemo(
    () => DOMPurify.sanitize(html || '', { WHOLE_DOCUMENT: false }),
    [html],
  )

  const srcDoc = useMemo(
    () => `<!doctype html>
<html>
<head><style>body{margin:0;font-family:system-ui,sans-serif;}${css || ''}</style></head>
<body>${sanitizedHtml}<script>${js || ''}<\/script></body>
</html>`,
    [sanitizedHtml, css, js],
  )

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const resize = () => {
      try {
        const height = iframe.contentWindow?.document?.body?.scrollHeight
        if (height) iframe.style.height = `${height}px`
      } catch {
        // cross-origin or not-yet-loaded; ignore
      }
    }
    iframe.addEventListener('load', resize)
    return () => iframe.removeEventListener('load', resize)
  }, [srcDoc])

  return (
    <iframe
      ref={iframeRef}
      title="Custom code block"
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      className="w-full border-0 block"
      style={{ minHeight: 80 }}
    />
  )
}
