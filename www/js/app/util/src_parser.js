define(['lib/micro_emitter', 'util/tick'], function(microEmitter, tick)

{ return function srcParser(lang, text)
  { var lines = text.split('\n')
      , section = null
      , me = Object.create(microEmitter)
  ; if (!lang)
    { me.emit('comment')
    ; tick.forEach
        ( lines
        , function(line, next)
          { me.emit('line', line)
          ; next()
          }
        , function(err)
          { if (err) { /* handle error */ }
          ; me.emit('/comment')
          ; me.emit('end')
          }
        )
    ; return me
    }
  ; tick.forEach
      ( lines
      , function(line, next)
        { if (line.trimLeft().indexOf(lang.open) === 0)
          { if (section) me.emit('/code')
          ; me.emit('comment')
          ; section = 'comment'
          }
          else if (line.trimLeft().indexOf(lang.close) === 0)
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
