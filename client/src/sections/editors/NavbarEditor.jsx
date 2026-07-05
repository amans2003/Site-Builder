import { useState } from 'react'
import { InlineText } from '../InlineText'
import { useEditorStore } from '../../store/editorStore'
import { HamburgerIcon, CloseIcon, ChevronIcon } from '../../components/Icons'

export function NavbarEditor({ props, onChange }) {
  const { logo, menu, profileIcon, bgColor, sticky } = props
  const goToPageByName = useEditorStore((s) => s.goToPageByName)
  const [drawerOpen, setDrawerOpen] = useState(false)

  function handleNavigate(target) {
    setDrawerOpen(false)
    goToPageByName(target)
  }

  return (
    <header
      className={`relative w-full ${sticky ? 'sticky top-0 z-20 shadow' : ''}`}
      style={{ background: bgColor }}
    >
      <div
        className={`flex flex-wrap items-center gap-3 @md:gap-4 px-4 py-3 @md:px-6 @md:py-4 ${
          logo?.position === 'center' ? 'flex-col' : 'justify-between'
        }`}
      >
        <div className="flex items-center">
          {logo?.src ? (
            <img src={logo.src} alt="logo" className="h-9" />
          ) : (
            <InlineText
              as="span"
              className="font-bold text-lg @md:text-xl outline-none"
              value={logo?.text || ''}
              onChange={(v) => onChange('logo.text', v)}
            />
          )}
        </div>

        <ul className="hidden @md:flex gap-3 @md:gap-5 list-none m-0 p-0">
          {(menu || []).map((item, i) => (
            <li key={i}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigate(item.target)
                }}
                className="no-underline text-inherit"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {profileIcon?.enabled && (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0" />
          )}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className="@md:hidden flex items-center justify-center w-9 h-9 rounded hover:bg-black/5"
          >
            <HamburgerIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 bg-gray-900/45 z-[199] transition-opacity duration-200 ${
          drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      <nav
        className={`fixed top-0 right-0 h-full w-[280px] max-w-[82%] bg-white text-gray-900 shadow-2xl z-[200] flex flex-col transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-3 border-b border-gray-100">
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="flex items-center justify-center w-9 h-9 rounded hover:bg-gray-100"
          >
            <CloseIcon className="w-4.5 h-4.5" />
          </button>
        </div>
        <ul className="list-none m-0 py-2 overflow-y-auto">
          {(menu || []).map((item, i) => (
            <li key={i}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigate(item.target)
                }}
                className="flex items-center gap-3 px-5 py-3.5 text-inherit no-underline text-[15px] font-medium hover:bg-gray-50"
              >
                <ChevronIcon className="w-4 h-4 opacity-45 shrink-0" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
