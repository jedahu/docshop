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
# Angular Service

The parser is meant to be used as an AngularJs service. It depends on the
[tick](tick.js) service.
*/
/* !name srcParserService (tick-dependency) => ((lang, text) => parser)
The service factory returns the actual parser service, which is a function which
takes a language definition, some source text, and returns a parser for that
text.
*/
; export const srcParserService = (tick) =>
    (lang, text) => Object.create(parser).init(tick, lang, text).parse()

; srcParserService.$inject = ['tick']

/*
All of the heavy lifting happens in the `parser` object which exposes a
`parse()` method to the service.
*/
; const parser =
    { init(tick, lang, text)
        { this.lines = text.split('\n').reverse()
        ; this.me = Object.create(microEmitter)
        ; this.lang = lang
        ; this.tick = tick
        ; return this
        }

    , parse()
        { this.lang ? this.parseCode() : this.parseText()
        ; return this.me
        }
/*
# Code Blocks

Code blocks are HTML escaped and emitted line by line as `html` events. Because
of this, consumers of parser events must be able to handle HTML strings.
*/
    , openCodeBlock()
        { return `\n\n<pre class='ds:code prettyprint'
            ><code class='lang-${this.lang.name}'>`
        }

    , closeCodeBlock: '</code></pre>\n\n'

    , maybeOpenCodeBlock(current)
        { let line
        ; while
            ( this.lines.length > 0
            && (line = this.lines.pop() + '\n')
            && line.trim() === ''
            )
            { // pass
            }
        ; if (this.lines.length === 0 && line.trim() === '')
            { return current
            }
        ; if (!this.isCommentOpen(line))
            { this.me.emit('html', this.openCodeBlock())
            ; this.me.emit('html', escapeHtml(line))
            ; return 'html'
            }
        ; this.lines.push(line)
        ; return current
        }

/*
# Comment Blocks

Comment blocks are delimited by `open`, `middle`, and `close` syntax, each
being the first non-whitespace syntax on a line. They are configurable. For
Javascript they could be `['/\**', ' *', '*\/']`, or equally `['#.', '#',
'#.']`. Note that if the middle syntax is indented relative to the open
syntax, its config string must start with that amount of white space.


## Directives

Each comment block can be labeled with a directive. [Directives beginning with
"!"][builtin] are reserved for docshop use and are parsed by this parser. Other
directives are emitted with their comments and must be utilised by the consumer
of this parser’s events. All directives are case agnostic.

[builtin]: directive.js
*/
    , isCommentOpen(line)
        { return line.trimLeft().indexOf(this.lang.open) === 0
        }

    , isCommentClose(line)
        { return line.trimLeft().indexOf(this.lang.close) === 0
        }

    , indentMiddle(line, baseIndent)
        { return line.slice
            ( baseIndent + this.lang.middle.length
                + (/^\s*$/.exec(this.lang.middle) ? 0 : 1)
            )
            || '\n'
        }

    , emitCommentOpen(label)
        { const [_, tag, str] = /^!(\S+)\s*(.*)$/.exec(label) || []
        ; const dir = directive[(tag || '').toLowerCase()]
        ; if (tag && dir)
            { this.me.emit('html', dir(str))
            ; this.me.emit('comment.open')
            }
          else
            { this.me.emit('comment.open', label)
            }
        }

/*
Two directives are handled specially by this parser: `!meta` and `!code`.


### !meta

A `!meta` comment block is parsed as YAML and added to the file’s meta data. The
following attributes are recognised:

title
: Title to be displayed in documentation.

author
authors
: Single author or list of authors. Format `Author Name <author@email.org>`.
*/
    , consumeMetaComment(indent)
        { let line
        ; return this.tick.recurseWhile
            ( () => this.lines.length > 0
                && (line = this.lines.pop() + '\n')
                && !this.isCommentClose(line)
            , (next, err, metaStr = '') =>
                { next(metaStr + this.indentMiddle(line, indent))
                }
            )
            .then(([metaStr]) =>
              { this.me.metaData = jsyaml.load(metaStr)
              })
        }

/*
### !code

A `!code` comment block is parsed as source code and emitted in `html` events.
The directive takes a single language argument.
*/
    , consumeCodeComment(indent, codeLang)
        { const langClass = codeLang ? 'lang-' + codeLang : ''
        ; let line
        ; this.me.emit
            ( 'html'
            , `\n\n<pre class='ds:comment-code prettyprint'
                ><code class='${langClass}'>`
            )
        ; return this.tick.recurseWhile
            ( () => this.lines.length > 0
                && (line = this.lines.pop() + '\n')
                && !this.isCommentClose(line)
            , (next) =>
                { next(this.me.emit
                    ( 'html'
                    , escapeHtml(this.indentMiddle(line, indent))
                    ))
                }
            )
            .then(() =>
              { this.me.emit('html', '</code></pre>\n\n')
              })
        }

/*
# Text Files
*/
    , parseText()
        { this.me.emit('comment.open')
        ; this.tick.forEach
            ( this.lines
            , (line, next) =>
                { this.me.emit('comment.line', {text: line + '\n'})
                ; next()
                }
            , (err) =>
                { if (err) { /* FIXME handle error */ }
                ; this.me.emit('comment.close')
                ; this.me.emit('end')
                }
            )
        }

/*
# Source Files
*/
    , parseCodeLoop(next, err, prev, label, indent)
        { let line = this.lines.pop() + '\n'
        ; if (this.isCommentOpen(line))
            { if (prev === 'html')
                { this.me.emit('html', this.closeCodeBlock)
                }
            ; const indent = line.search(/\S/)
            ; const label = line.slice
                ( indent
                + this.lang.open.length
                + 1
                )
                .trim()
                || null
            ; let match;
            ; if (/^!(?:meta|META)\b/.exec(label))
                { return this.consumeMetaComment(indent)
                    .then(() => next('comment.close'), err)
                }
            ; if (match = /^!(?:code|CODE)(?:\b|\s+(\w+))/.exec(label))
                { return this.consumeCodeComment(indent, match[1])
                    .then(() => next('comment.close'), err)
                }
            ; this.emitCommentOpen(label)
            ; return next('comment.open', label, indent)
            }
        ; if (this.isCommentClose(line))
            { this.me.emit('comment.close', label)
            ; return next(this.maybeOpenCodeBlock('comment.close'))
            }
        ; if (prev === 'comment.open' || prev === 'comment.line')
            { this.me.emit
                ( 'comment.line'
                , { label: label
                  , text: this.indentMiddle(line, indent)
                  }
                )
            ; return next('comment.line', label, indent)
            }
        ; if (prev === 'html')
            { this.me.emit('html', escapeHtml(line))
            ; return next('html')
            }
        ; return next(this.maybeOpenCodeBlock(prev))
        }

    , parseCode()
        { this.tick.recurseWhile
            ( () => this.lines.length > 0
            , this.parseCodeLoop.bind(this)
            )
            .then(([prev]) =>
              { if (prev === 'html') this.me.emit('html', this.closeCodeBlock)
                else this.me.emit('comment.close', label)
              ; this.me.emit('end')
              })
        }
    }

; export module _test
    { export srcParserService
    ; export parser
    }
