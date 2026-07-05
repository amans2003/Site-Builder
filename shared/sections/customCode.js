import { FIELD_TYPES } from '../fieldTypes.js'

export const type = 'customCode'
export const label = 'Custom Code'

export const defaultProps = {
  html: '<div style="padding:24px;text-align:center">Custom HTML goes here</div>',
  css: '',
  js: '',
}

export const fields = [
  { key: 'html', label: 'HTML', type: FIELD_TYPES.CODE },
  { key: 'css', label: 'CSS', type: FIELD_TYPES.CODE },
  { key: 'js', label: 'JavaScript', type: FIELD_TYPES.CODE },
]

// Used by the export pipeline. This runs at build/export time against the
// site owner's own content, so it is embedded as-is (not sandboxed) — the
// sandboxed-iframe + DOMPurify pass only guards the *live editor* UI, where
// untrusted script execution could compromise the builder itself.
export function renderHTML(props) {
  const p = { ...defaultProps, ...props }
  const styleTag = p.css ? `<style>${p.css}</style>` : ''
  const scriptTag = p.js ? `<script>${p.js}</script>` : ''
  return `
<div class="custom-code-section">
  ${styleTag}
  ${p.html || ''}
  ${scriptTag}
</div>`.trim()
}

export const css = `.custom-code-section { width: 100%; }`
