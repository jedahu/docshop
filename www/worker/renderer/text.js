; var lang = null

; receiveOnce
    ( 'lang'
    , function(str)
      { lang = str
      }
    )
; receive
    ( 'comment'
    , function()
      { sendHtml('<pre class="comment">')
      }
    )
; receive
    ( '/comment'
    , function()
      { sendHtml('</pre>')
      }
    )
; receive
    ( 'code'
    , function()
      { sendHtml
          ( '<pre class="code prettyprint lang-'
              + lang + '">'
          )
      }
    )
; receive
    ( '/code'
    , function()
      { sendHtml('</pre>')
      }
    )
; receive
    ( 'comment.line'
    , function(line)
      { sendHtml(escapeHtml(line.text))
      }
    )
; receive
    ( 'code.line'
    , function(line)
      { sendHtml(escapeHtml(line))
      }
    )
; receive
    ( 'end'
    , function()
      { send('toc', null)
      ; send('names', null)
      ; ack('end')
      ; close()
      }
    )
