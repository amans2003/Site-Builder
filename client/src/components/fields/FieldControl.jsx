import { FIELD_TYPES } from 'shared'
import { FieldWrapper } from './FieldWrapper'
import { ImageField } from './ImageField'
import { ListField } from './ListField'
import { LinkListField } from './LinkListField'
import { PageLinkPicker } from './PageLinkPicker'
import { CodeField } from './CodeField'
import { RepeaterField } from './RepeaterField'

export function FieldControl({ field, value, onChange, pages }) {
  switch (field.type) {
    case FIELD_TYPES.TEXT:
      return (
        <FieldWrapper label={field.label}>
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </FieldWrapper>
      )
    case FIELD_TYPES.TEXTAREA:
      return (
        <FieldWrapper label={field.label}>
          <textarea
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </FieldWrapper>
      )
    case FIELD_TYPES.COLOR:
      return (
        <FieldWrapper label={field.label}>
          <input
            type="color"
            value={value ?? '#ffffff'}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-8 border border-gray-300 rounded"
          />
        </FieldWrapper>
      )
    case FIELD_TYPES.BOOLEAN:
      return (
        <FieldWrapper label={field.label} inline>
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4"
          />
        </FieldWrapper>
      )
    case FIELD_TYPES.SELECT:
      return (
        <FieldWrapper label={field.label}>
          <select
            value={value ?? field.options[0]}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          >
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </FieldWrapper>
      )
    case FIELD_TYPES.IMAGE:
      return <ImageField label={field.label} value={value} onChange={onChange} />
    case FIELD_TYPES.LIST:
      return <ListField label={field.label} value={value} onChange={onChange} />
    case FIELD_TYPES.LINK_LIST:
      return <LinkListField label={field.label} value={value} pages={pages} onChange={onChange} />
    case FIELD_TYPES.PAGE_LINK:
      return (
        <FieldWrapper label={field.label}>
          <PageLinkPicker value={value} pages={pages} onChange={onChange} />
        </FieldWrapper>
      )
    case FIELD_TYPES.CODE:
      return <CodeField label={field.label} fieldKey={field.key} value={value} onChange={onChange} />
    case FIELD_TYPES.REPEATER:
      return <RepeaterField field={field} value={value} onChange={onChange} pages={pages} />
    default:
      return null
  }
}
