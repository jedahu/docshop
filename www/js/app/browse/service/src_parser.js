/* !meta
title: Source Parser
author: Jeremy Hughes <jedahu@gmail.com>
tests: /test/util/src_parser.js
*/
/*
# Synopsis

The source parser reads source files a line at a time, tags each line according
to type, and then emits it as an event of that type. With a few exceptions, each
parsed line is emitted in a separate tick.


# Events

The following events (with payloads) are emitted by the parser:

comment.open (directive)
: Open comment block. Payload: comment directive (a string).

comment.line ({directive, text})
: A line of comment. Payload: an object containing the comment directive and
  line text (newline terminated).

comment.close (directive)
: Close comment block. Payload: comment type.

html (string)
: Unescaped HTML. Payload: an HTML string.

end
: End of document. Parsing complete. No payload.


# Source Example

A small Python source file that when parsed will emit all of the above kinds
of events.
*/

/* !code python
''' !meta
title: Fibonacci
author: Jeremy Hughes <jedahu@gmail.com>
'''
'''
Everyone wants to write a Fibonacci function.
'''

''' !id fibonacci (n:int) => int
This function returns the n’th Fibonacci number.
'''
def fibonacci(n):
  return 1 if n < 2 else fibonacci(n - 2) + fibonacci(n - 1)

''' coda
Well, that was easy!
'''
*/
; import microEmitter from '/util/micro_emitter.js'
; import escapeHtml from '/util/escape_html.js'
; import directive from 'src_parser/directive.js'

/*
# Code Blocks

Code blocks are HTML escaped and emitted line by line as `html` events. Because
of this, consumers of parser events must be able to handle HTML strings.
*/

; const openCodeBlock = (lang) =>
    '\n\n<pre class="ds:code prettyprint">'
    + '<code class="lang-'
    + lang
    + '">'

; const closeCodeBlock = '</code></pre>\n\n'

/*
# Comment Blocks

Comment blocks are delimited by `open`, `middle`, and `close` strings, each
being the first non-whitespace strings on a line. These strings are
configurable. For Javascript they could be `['/\**', ' *', '*\/']`, or equally
`['#.', '#', '#.']`. Note that if the middle string is indented relative to the open string, it must start with that amount of white space.

Each comment block can be labeled with a directive. [Directives beginning with
"!"][builtin] are reserved for docshop use and are parsed by this parser. Other
directives are emitted with their comments and must be utilised by the consumer
of this parser’s events. All directives are case agnostic.

[builtin]: directive.js
*/

; export const srcParser = (tick, lang, text) =>
    { const lines = text.split('\n').reverse()
    ; const me = Object.create(microEmitter)
    ; const isCommentOpen = (line) =>
        line.trimLeft().indexOf(lang.open) === 0
    ; const isCommentClose = (line) =>
        line.trimLeft().indexOf(lang.close) === 0
    ; const indentMiddle = (line, base) =>
        line.slice
          ( base + lang.middle.length
              + (/^\s*$/.exec(lang.middle) ? 0 : 1)
          )
          || '\n'
    ; const consumeMetaComment = (indent) =>
        { let line
        ; return tick.doWhileTick
            ( () => lines.length > 0
                && (line = lines.pop() + '\n')
                && !isCommentClose(line)
            , (next, err, metaStr = '') =>
                { next(metaStr + indentMiddle(line, indent))
                }
            )
            .then(([metaStr]) =>
              { me.metaData = jsyaml.load(metaStr)
              })
        }
    ; const consumeCodeComment = (indent, commentLang) =>
        { const langClass = commentLang ? 'lang-' + commentLang : ''
        ; let line
        ; me.emit
            ( 'html'
            , '\n\n<pre class="ds:comment-code prettyprint">'
              + '<code class="'
              + langClass
              + '">'
            )
        ; return tick.doWhileTick
            ( () => lines.length > 0
                && (line = lines.pop() + '\n')
                && !isCommentClose(line)
            , (next) =>
                { next(me.emit
                    ( 'html'
                    , escapeHtml(indentMiddle(line, indent))
                    ))
                }
            )
            .then(() =>
              { me.emit('html', '</code></pre>\n\n')
              })
        }
    ; const emitCommentOpen = (label) =>
        { const [_, tag, str] = /^!(\S+)\s*(.*)$/.exec(label) || []
        ; const dir = directive[(tag || '').toLowerCase()]
        ; if (tag && dir)
            { me.emit('html', dir(str))
            ; me.emit('comment.open')
            }
          else
            { me.emit('comment.open', label)
            }
        }
    ; if (!lang)
        { me.emit('comment.open')
        ; tick.forEach
            ( lines
            , (line, next) =>
                { me.emit('comment.line', {text: line + '\n'})
                ; next()
                }
            , (err) =>
                { if (err) { /* handle error */ }
                ; me.emit('comment.close')
                ; me.emit('end')
                }
            )
        ; return me
        }
    ; tick.doWhileTick
        ( () => lines.length > 0
        , (next, err, prev, label, indent) =>
            { let line = lines.pop() + '\n'
            ; const maybeOpenCodeSection = (current) =>
                { while
                    ( lines.length > 0
                    && (line = lines.pop() + '\n')
                    && line.trim() === ''
                    )
                    { //pass
                    }
                ; if (lines.length === 0 && line.trim() === '')
                    { return current
                    }
                ; if (!isCommentOpen(line))
                    { me.emit('html', openCodeBlock(lang.name))
                    ; me.emit('html', escapeHtml(line))
                    ; return 'html'
                    }
                ; lines.push(line)
                ; return current
                }
            ; if (isCommentOpen(line))
                { if (prev === 'html') me.emit('html', closeCodeBlock)
                ; const indent = line.search(/\S/)
                ; const label = line.slice(indent + lang.open.length + 1).trim()
                    || null
                ; let match;
                ; if (/^!meta\b/.exec(label))
                    { return consumeMetaComment(indent)
                        .then(() => next('comment.close'), err)
                    }
                ; if (match = /^!code(?:\b|\s+(\w+))/.exec(label))
                    { return consumeCodeComment(indent, match[1])
                        .then(() => next('comment.close'), err)
                    }
                ; emitCommentOpen(label)
                ; return next('comment.open', label, indent)
                }
            ; if (isCommentClose(line))
                { me.emit('comment.close', label)
                ; return next(maybeOpenCodeSection('comment.close'))
                }
            ; if (prev === 'comment.open' || prev === 'comment.line')
                { me.emit
                    ( 'comment.line'
                    , { label: label
                      , text: indentMiddle(line, indent)
                      }
                    )
                ; return next('comment.line', label, indent)
                }
            ; if (prev === 'html')
                { me.emit('html', escapeHtml(line))
                ; return next('html')
                }
            ; return next(maybeOpenCodeSection(prev))
            }
        )
        .then(([prev]) =>
          { if (prev === 'html') me.emit('html', closeCodeBlock)
            else me.emit('comment.close', label)
          ; me.emit('end')
          })
    ; return me
    }

; export const srcParserService = (tick) =>
    (lang, text) => srcParser(tick, lang, text)

; srcParserService.$inject = ['tick']
