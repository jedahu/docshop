; import escapeHtml from '/util/escape_html.js'

; export const textRenderer = () =>
    (text, _label) =>
      '<pre class="comment">' + escapeHtml(text) + '</pre>'
