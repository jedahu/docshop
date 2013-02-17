/* !meta
title: Source Parser
author: Jeremy Hughes <jedahu@gmail.com>
tests: /test/util/src_parser.js
...
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
    (lang, text) => Object.create(parser).init(tick, lang, text)

; srcParserService.$inject = ['tick']

; const isBlank = (str) => !!/^(?:\s*\n)*$/.exec(str)

; const trimLines = (str) =>
    str
      .replace(/^(?:\s*\n)*/, '')
      .replace(/(?:\s*\n)*$/, '')

/*
All of the heavy lifting happens in the `parser` object which exposes a
`parse()` method to the service.
*/
; const parser =
    { init(tick, lang, text)
        { this.lines = text.split('\n').reverse()
        ; this.events = Object.create(microEmitter)
        ; this.lang = lang
        ; this.tick = tick
        ; this.metaData = {}
        ; return this
        }

    , parse()
        { return this.lang ? this.parseCode() : this.parseText()
        }
/*
# Code Blocks

Code blocks are HTML escaped and emitted line by line as `html` events. Because
of this, consumers of parser events must be able to handle HTML strings.
*/
    , openCodeBlock(lang)
        { lang = lang || this.lang.name
        ; const className = lang ? 'comment' : ''
        ; return `\n\n<pre class='ds:code ${className} prettyprint'>`
            + `<code class='lang-${lang}'>`
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
            { this.events.emit('html', this.openCodeBlock())
            ; this.events.emit('html', escapeHtml(line))
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

    , emitCommentDirective(label)
        { const [_, tag, str] = /^!(\S+)\s*(.*)$/.exec(label) || []
        ; const dir = directive[(tag || '').toLowerCase()]
        ; if (tag && dir) this.events.emit('html', dir(str))
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
                { try
                    { return next(metaStr + this.indentMiddle(line, indent))
                    }
                  catch(e)
                    { return err(e)
                    }
                }
            )
            .then(([metaStr]) =>
              { angular.extend(this.metaData, jsyaml.load(metaStr))
              })
        }

/*
### !code

A `!code` comment block is parsed as source code and emitted in `html` events.
The directive takes a single language argument.
*/
    , consumeCodeComment(indent, codeLang)
        { let line
        ; this.events.emit('html', this.openCodeBlock(codeLang))
        ; return this.tick.recurseWhile
            ( () => this.lines.length > 0
                && (line = this.lines.pop() + '\n')
                && !this.isCommentClose(line)
            , (next) =>
                { next(this.events.emit
                    ( 'html'
                    , escapeHtml(this.indentMiddle(line, indent))
                    ))
                }
            )
            .then(() =>
              { this.events.emit('html', this.closeCodeBlock)
              })
        }

/*
# Text Files
*/
    , parseText()
        { this.events.emit('comment.open')
        ; this.tick.forEach
            ( this.lines
            , (line, next) =>
                { this.events.emit('comment.line', {text: line + '\n'})
                ; next()
                }
            , (err) =>
                { if (err) { /* FIXME handle error */ }
                ; this.events.emit('comment.close')
                ; this.events.emit('end')
                }
            )
        }

/*
# Source Files
*/
    , parseCodeLoop(next, err, prev, label, indent, text)
        { const append = (type, str) => next(type, lable, indent, text + str)
        ; let line = this.lines.pop() + '\n'
        ; if
            ( this.isCommentOpen(line)
            && ( this.lang.open !== this.lang.close
               || prev === 'html'
               || !prev
               )
            )
            { if (prev === 'html' && !isBlank(text))
                { this.events.emit
                    ( 'html'
                    , this.openCodeBlock()
                        + trimLines(text)
                        + this.closeCodeBlock
                    )
                }
            ; indent = line.search(/\S/)
            ; label = line.slice
                ( indent
                + this.lang.open.length
                + 1
                )
                .trim()
                || null
            ; let match;
            ; if (/^!(?:meta|META)\b/.exec(label))
                { return this.consumeMetaComment(indent)
                    .then(() => next('html', null, null, ''), err)
                }
            ; if (match = /^!(?:code|CODE)(?:\s+(\w+))?/.exec(label))
                { return this.consumeCodeComment(indent, match[1])
                    .then(() => next('html', null, null, ''), err)
                }
            ; this.emitCommentDirective(label)
            ; return next('comment.open', label, indent, '')
            }
        ; if (this.isCommentClose(line))
            { if (!isBlank(text))
                { this.events.emit('comment', trimLines(text), label)
                }
            ; return next('html', null, null, '')
            }
        ; if (prev === 'comment.open' || prev === 'comment.line')
            { return next
                ( 'comment.line'
                , label
                , indent
                , text + this.indentMiddle(line, indent)
                )
            }
        ; if (prev === 'html')
            { return next('html', null, null, text + escapeHtml(line))
            }
        ; return next('html', null, null, escapeHtml(line))
        }

    , parseCode()
        { return this.tick.recurseWhile
            ( () => this.lines.length > 0
            , this.parseCodeLoop.bind(this)
            )
            .then(([prev, label, indent, text]) =>
              { if (prev === 'html' && !isBlank(text))
                  { this.events.emit
                      ( 'html'
                      , this.openCodeBlock()
                          + trimLines(text)
                          + this.closeCodeBlock
                      )
                  }
                else if (!isBlank(text))
                  { this.events.emit('comment', trimLines(text), label)
                  }
              ; this.events.emit('end')
              })
        }
    }

; export module _test
    { export srcParserService
    ; export parser
    }
