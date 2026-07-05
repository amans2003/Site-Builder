import { FIELD_TYPES } from '../fieldTypes.js'
import { escapeHtml } from '../utils/path.js'

export const type = 'contactForm'
export const label = 'Contact Form'

export const defaultProps = {
  heading: 'Get in Touch',
  subtitle: "We'd love to hear from you.",
  collectPhone: true,
  submitLabel: 'Send Message',
  successMessage: "Thanks! We'll get back to you soon.",
  bgColor: '#ffffff',
  textColor: '#111827',
}

export const fields = [
  { key: 'heading', label: 'Heading', type: FIELD_TYPES.TEXT },
  { key: 'subtitle', label: 'Subtitle', type: FIELD_TYPES.TEXTAREA },
  { key: 'collectPhone', label: 'Ask for phone number', type: FIELD_TYPES.BOOLEAN },
  { key: 'submitLabel', label: 'Button label', type: FIELD_TYPES.TEXT },
  { key: 'successMessage', label: 'Message after submit', type: FIELD_TYPES.TEXT },
  { key: 'bgColor', label: 'Background color', type: FIELD_TYPES.COLOR },
  { key: 'textColor', label: 'Text color', type: FIELD_TYPES.COLOR },
]

const CHECK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 13 9 17 19 7"/></svg>`

// Submissions post to our backend's public endpoint even though the exported site is
// otherwise a static bundle with no server of its own — the same pattern as using a
// third-party form backend (e.g. Formspree) from a static site.
export function renderHTML(props, { projectId, apiBaseUrl } = {}) {
  const p = { ...defaultProps, ...props }
  const action = projectId && apiBaseUrl ? `${apiBaseUrl}/api/public/submissions/${projectId}` : '#'

  return `
<section class="contact-form-section" style="background:${escapeHtml(p.bgColor)}; color:${escapeHtml(p.textColor)}">
  <div class="contact-form-inner">
    <div class="contact-form-header" data-contact-header>
      <h2 class="contact-form-heading" data-editable="heading">${escapeHtml(p.heading)}</h2>
      <p class="contact-form-subtitle" data-editable="subtitle">${escapeHtml(p.subtitle)}</p>
    </div>
    <div class="contact-form-success" data-contact-success hidden>
      <div class="contact-form-success-icon">${CHECK_ICON}</div>
      <p class="contact-form-success-text">${escapeHtml(p.successMessage)}</p>
    </div>
    <form class="contact-form" method="POST" action="${escapeHtml(action)}" data-contact-form>
      <input type="hidden" name="_redirect" data-contact-redirect />
      <input type="text" name="name" placeholder="Your name" required />
      <input type="email" name="email" placeholder="Your email" required />
      ${p.collectPhone ? '<input type="tel" name="phone" placeholder="Your phone number (optional)" />' : ''}
      <textarea name="message" placeholder="Your message" rows="4" required></textarea>
      <button type="submit">${escapeHtml(p.submitLabel)}</button>
    </form>
  </div>
  <script>
    (function () {
      var section = document.currentScript.previousElementSibling;
      // Browsers only send the request Origin (no path) as the Referer header for a
      // cross-origin POST like this one, so the server can't reconstruct which page to
      // send the visitor back to from Referer alone — pass it explicitly instead.
      var redirectField = section.querySelector('[data-contact-redirect]');
      if (redirectField) redirectField.value = window.location.href;

      var params = new URLSearchParams(window.location.search);
      if (params.get('submitted') === 'true') {
        section.querySelector('[data-contact-header]').hidden = true;
        section.querySelector('[data-contact-form]').hidden = true;
        section.querySelector('[data-contact-success]').hidden = false;
      }
    })();
  </script>
</section>`.trim()
}

export const css = `
.contact-form-section { width: 100%; padding: 64px 24px; }
.contact-form-inner { max-width: 480px; margin: 0 auto; text-align: center; }
.contact-form-header { margin-bottom: 24px; }
.contact-form-heading { font-size: 28px; font-weight: 600; margin: 0 0 8px; }
.contact-form-subtitle { font-size: 15px; opacity: 0.8; margin: 0; }
.contact-form-success { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 12px 0; }
.contact-form-success-icon {
  width: 56px; height: 56px; border-radius: 50%; background: #dcfce7; color: #16a34a;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  animation: contact-form-success-pop 0.35s ease;
}
.contact-form-success-icon svg { width: 28px; height: 28px; }
.contact-form-success-text { font-size: 16px; font-weight: 500; margin: 0; }
@keyframes contact-form-success-pop {
  from { transform: scale(0.6); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.contact-form { display: flex; flex-direction: column; gap: 12px; text-align: left; }
.contact-form-header[hidden], .contact-form[hidden], .contact-form-success[hidden] { display: none; }
.contact-form input, .contact-form textarea {
  font: inherit; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 6px; width: 100%; box-sizing: border-box;
}
.contact-form button {
  font: inherit; font-weight: 600; padding: 10px 20px; border: none; border-radius: 6px;
  background: #111827; color: #fff; cursor: pointer;
}
`
