; export const markdownRenderer = () =>
    (text, _label) => markdown.toHTML(text, 'Maruku')
