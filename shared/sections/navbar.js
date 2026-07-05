import { FIELD_TYPES } from '../fieldTypes.js'
import { escapeHtml, resolveLinkHref } from '../utils/path.js'

export const type = 'navbar'
export const label = 'Navbar'

export const defaultProps = {
  logo: { src: '', position: 'left', text: 'Brand' },
  menu: [
    { label: 'Home', target: 'home' },
    { label: 'About', target: 'home' },
    { label: 'Contact', target: 'home' },
  ],
  profileIcon: { enabled: true, position: 'right' },
  bgColor: '#ffffff',
  sticky: false,
}

export const fields = [
  { key: 'logo.text', label: 'Logo text', type: FIELD_TYPES.TEXT },
  { key: 'logo.src', label: 'Logo image', type: FIELD_TYPES.IMAGE },
  {
    key: 'logo.position',
    label: 'Logo position',
    type: FIELD_TYPES.SELECT,
    options: ['left', 'center'],
  },
  { key: 'menu', label: 'Menu items', type: FIELD_TYPES.LINK_LIST },
  {
    key: 'profileIcon.enabled',
    label: 'Show profile icon',
    type: FIELD_TYPES.BOOLEAN,
  },
  {
    key: 'profileIcon.position',
    label: 'Profile icon position',
    type: FIELD_TYPES.SELECT,
    options: ['left', 'right'],
  },
  { key: 'bgColor', label: 'Background color', type: FIELD_TYPES.COLOR },
  { key: 'sticky', label: 'Sticky / fixed', type: FIELD_TYPES.BOOLEAN },
]

const HAMBURGER_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>`
const CLOSE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>`
const CHEVRON_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`

export function renderHTML(props, { pages } = {}) {
  const p = { ...defaultProps, ...props }
  const menuLinks = (p.menu || []).map((item) => ({
    href: resolveLinkHref(item.target, pages),
    label: escapeHtml(item.label),
  }))

  const desktopMenuItems = menuLinks
    .map((item) => `<li><a href="${escapeHtml(item.href)}">${item.label}</a></li>`)
    .join('')
  const drawerMenuItems = menuLinks
    .map(
      (item) =>
        `<li><a href="${escapeHtml(item.href)}">${CHEVRON_ICON}<span>${item.label}</span></a></li>`,
    )
    .join('')

  const logo = p.logo?.src
    ? `<img src="${escapeHtml(p.logo.src)}" alt="logo" class="navbar-logo-img" />`
    : `<span class="navbar-logo-text">${escapeHtml(p.logo?.text || '')}</span>`
  const profile = p.profileIcon?.enabled
    ? `<div class="navbar-profile navbar-profile--${p.profileIcon.position}">&#9679;</div>`
    : ''

  return `
<header class="navbar navbar--logo-${p.logo?.position || 'left'} ${p.sticky ? 'navbar--sticky' : ''}" style="background:${escapeHtml(p.bgColor || '#fff')}">
  <div class="navbar-inner">
    <div class="navbar-logo">${logo}</div>
    <ul class="navbar-menu">${desktopMenuItems}</ul>
    <div class="navbar-actions">
      ${profile}
      <button type="button" class="navbar-hamburger" aria-label="Open menu" aria-expanded="false" data-navbar-toggle>${HAMBURGER_ICON}</button>
    </div>
  </div>
  <div class="navbar-drawer-backdrop" data-navbar-backdrop></div>
  <nav class="navbar-drawer" data-navbar-drawer aria-hidden="true">
    <div class="navbar-drawer-header">
      <button type="button" class="navbar-drawer-close" aria-label="Close menu" data-navbar-close>${CLOSE_ICON}</button>
    </div>
    <ul class="navbar-drawer-menu">${drawerMenuItems}</ul>
  </nav>
</header>
<script>
(function () {
  var header = document.currentScript.previousElementSibling;
  var toggle = header.querySelector('[data-navbar-toggle]');
  var closeBtn = header.querySelector('[data-navbar-close]');
  var backdrop = header.querySelector('[data-navbar-backdrop]');
  var drawer = header.querySelector('[data-navbar-drawer]');

  function openDrawer() {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });
})();
</script>`.trim()
}

export const css = `
.navbar { width: 100%; position: relative; }
.navbar-inner { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; gap: 16px; }
.navbar--logo-center .navbar-inner { flex-direction: column; }
.navbar--sticky { position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.navbar-logo-text { font-weight: 700; font-size: 20px; }
.navbar-logo-img { height: 36px; }
.navbar-menu { display: flex; gap: 20px; list-style: none; margin: 0; padding: 0; }
.navbar-menu a { text-decoration: none; color: inherit; }
.navbar-actions { display: flex; align-items: center; gap: 12px; }
.navbar-profile { width: 32px; height: 32px; border-radius: 50%; background: #ddd; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

.navbar-hamburger {
  display: none; align-items: center; justify-content: center; width: 40px; height: 40px;
  padding: 8px; border: none; background: none; color: inherit; cursor: pointer; border-radius: 6px;
}
.navbar-hamburger:hover { background: rgba(0,0,0,0.06); }
.navbar-hamburger svg { width: 22px; height: 22px; }

.navbar-drawer-backdrop {
  position: fixed; inset: 0; background: rgba(17,24,39,0.45); opacity: 0; pointer-events: none;
  transition: opacity 0.25s ease; z-index: 199;
}
.navbar-drawer-backdrop.is-open { opacity: 1; pointer-events: auto; }

.navbar-drawer {
  position: fixed; top: 0; right: 0; height: 100%; width: 300px; max-width: 82vw;
  background: #fff; color: #111827; box-shadow: -4px 0 24px rgba(0,0,0,0.18);
  transform: translateX(100%); transition: transform 0.28s ease; z-index: 200;
  display: flex; flex-direction: column;
}
.navbar-drawer.is-open { transform: translateX(0); }
.navbar-drawer-header { display: flex; justify-content: flex-end; padding: 12px; border-bottom: 1px solid #f0f0f0; }
.navbar-drawer-close {
  display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;
  border: none; background: none; color: inherit; cursor: pointer; border-radius: 6px;
}
.navbar-drawer-close:hover { background: #f3f4f6; }
.navbar-drawer-close svg { width: 18px; height: 18px; }
.navbar-drawer-menu { list-style: none; margin: 0; padding: 8px 0; overflow-y: auto; }
.navbar-drawer-menu li a {
  display: flex; align-items: center; gap: 12px; padding: 14px 22px; color: inherit;
  text-decoration: none; font-size: 15px; font-weight: 500;
}
.navbar-drawer-menu li a:hover { background: #f9fafb; }
.navbar-drawer-menu li a svg { width: 16px; height: 16px; opacity: 0.45; flex-shrink: 0; }

@media (max-width: 768px) {
  .navbar-menu { display: none; }
  .navbar-hamburger { display: inline-flex; }
}
`
