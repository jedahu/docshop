define(['lib/micro_emitter', 'util/tick'], function(microEmitter, tick)

{ return function srcParser(lang, text)
  { var lines = text.split('\n')
      , section = null
      , commentLabel = null
      , me = Object.create(microEmitter)
      , metaStr = ''
      , isCommentOpen = function(line)
        { return line.trimLeft().indexOf(lang.open) === 0
        }
      , isCommentClose = function(line)
        { return line.trimLeft().indexOf(lang.close) === 0
        }
      , consumeMetaComment = function(i)
        { for (; i < lines.length; ++i)
          { if (isCommentClose(lines[i]))
            { break
            }
            metaStr += lines[i] + '\n'
          }
        ; me.metaData = JSON.parse(metaStr)
        ; return ++i
        }
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
  ; tick.for
      ( 0
      , function(i) { return i < lines.length }
      , function(i) { return ++i }
      , function(i, next, err)
        { var line = lines[i] + '\n'
            , trimmed = line.trimLeft()
            , nextI
        ; if (isCommentOpen(line))
          { if (section === 'code') me.emit('/code')
          ; commentLabel = trimmed.slice(lang.open.length).trim() || null
          ; if (commentLabel === '!meta')
            { nextI = consumeMetaComment(++i)
            }
          ; me.emit('comment', commentLabel)
          ; section = 'comment'
          }
          else if (isCommentClose(line))
          { me.emit('/comment', commentLabel)
          ; if (!isCommentOpen(lines[i + 1]))
            { me.emit('code')
            ; section = 'code'
            }
          }
          else if (section === 'comment')
          { me.emit
              ( 'comment.line'
              , { label: commentLabel
                , text: trimmed.slice(lang.middle.length)
                }
              )
          }
          else if (section === 'code')
          { me.emit('code.line', line)
          }
          else
          { me.emit('code')
          ; me.emit('code.line', line)
          ; section = 'code'
          }
        ; next(nextI)
        }
      , function(_i)
        { if (section === 'code') me.emit('/code')
          else me.emit('/comment', commentLabel)
        ; me.emit('end')
        }
      , function(err)
        { // TODO handle error
        }
      )
  ; return me
  }

});
