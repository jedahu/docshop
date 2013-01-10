define(['lib/micro_emitter', 'util/tick'], function(microEmitter, tick)

{ return function srcParser(commentSyntax, text)
  { var lines = text.split('\n')
      , section = null
      , me = Object.create(microEmitter)
  ; tick.forEach
      ( lines
      , function(line, next)
        { if (line.trimLeft().indexOf(commentSyntax.open) === 0)
          { if (section) me.emit('/code')
          ; me.emit('comment')
          ; section = 'comment'
          }
          else if (line.trimLeft().indexOf(commentSyntax.close) === 0)
          { if (section) me.emit('/comment')
          ; me.emit('code')
          ; section = 'code'
          }
          else if (!section)
          { me.emit('code')
          ; me.emit('line', line)
          ; section = 'code'
          }
          else
          { me.emit('line', line)
          }
        ; next()
        }
      , function(err)
        { if (err) { /* handle error */ }
        ; if (section === 'code') me.emit('/code')
          else me.emit('/comment')
        ; me.emit('end')
        }
      )
  ; return me
  }

});
