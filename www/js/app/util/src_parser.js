define(['lib/micro_emitter'], function(microEmitter)

{ var srcParserObj = Object.create
    ( microEmitter
    , { init:
        { value: function(commentSyntax, text)
          { Object.defineProperties
              ( this
              , { _syntax: {value: commentSyntax}
                , _text: {value: text}
                }
              )
          ; return this;
          }
        }

      , parse:
        { value: function()
          { var lines = this._text.split('\n')
              , line = null
              , section = null
              , i = null
          ; for (i = 0; i < lines.length; ++i)
            { line = lines[i]
            ; if (line.trimLeft().indexOf(this._syntax.open) === 0)
              { if (i !== 0) this.emit('/code')
              ; this.emit('comment')
              ; section = 'comment'
              }
              else if (line.trimLeft().indexOf(this._syntax.close) === 0)
              { if (i !== 0) this.emit('/comment')
              ; this.emit('code')
              ; section = 'code'
              }
              else if (i === 0)
              { this.emit('code')
              ; this.emit('line', line)
              ; section = 'code'
              }
              else
              { this.emit('line', line)
              }
            }
          ; if (section === 'code') this.emit('/code')
            else this.emit('/comment')
          ; this.emit('end')
          }
        }
      }
    )

; return function srcParser(commentSyntax, text)
  { return Object.create(srcParserObj).init(commentSyntax, text)
  }

});
