/* !meta
title: Built-In Directives
author: Jeremy Hughes <jedahu@gmail.com>
tests: /test/browse/service/src_parser/directive.js
*/
/*
Built-in directives are prefixed by "!" and all consist of a tag and argument
text separated by whitespace. For example: `!id fibonacci (n) => n`. The
argument text is parsed by a function in this module of the same
name as the tag. Each function takes that single string argument and returns a
string of HTML.

(Two directives are handled specially by the [parser](src_parser.js) `!meta` and
`!code`.)
*/
; import escapeHtml from '/util/escape_html.js'

/* !name directive.name (str) => html
Transforms a string of the form `name free-form-type-information`, into a div
containing that string and with an id of "name:`name`".
*/

; export module directive
    { export const name = (str) =>
        { const [_, name, info] = /^(\S+)(?:\s+(.+))?$/.exec(str) || []
        ; const infoSpan = info
            ? ' <span class="ds:info">'
              + escapeHtml(info)
              + '</span>'
            : ''
        ; return '<div class="ds:name" id="name:'
            + escapeHtml(name)
            + '">'
            + escapeHtml(name)
            + infoSpan
            + '</div>'
        }

    ; export const meta = (i) =>
        { for (; i < lines.length; ++i)
            { if (isCommentClose(lines[i])) break
            ; metaStr += lines[i] + '\n'
            }
        ; me.metaData = jsyaml.load(metaStr)
        ; return ++i
        }
    ; const consumeCodeComment = (label, i) =>
        { const [_, lang] = /^(\w+)/.exec(str) || []
        ; const langClass = lang ? 'lang-' + lang : ''
        ; me.emit
            ( 'html'
            , '<pre class="ds:comment-code prettyprint">'
              + '<code class="'
              + langClass
              + '">'
            )
        ; for (; i < lines.length; ++i)
            { if (isCommentClose(lines[i])) break
            ; me.emit('html', escapeHtml(lines[i] + '\n'))
            }
        ; return ++i
        }
    }
