; importScripts('lib/marked.js')

; var lang = null
    , text = ''

; receiveOnce
    ( 'lang'
    , function(str)
      { lang = str
      }
    )
; receive
    ( 'comment'
    , function()
      { // pass
      }
    )
; receive
    ( '/comment'
    , function()
      { // pass
      }
    )
; receive
    ( 'code'
    , function()
      { text += '\n~~~~\n'
      }
    )
; receive
    ( '/code'
    , function()
      { text += '~~~~\n\n'
      }
    )
; receive
    ( 'line'
    , function(line)
      { text += line + '\n'
      }
    )
; receive
    ( 'end'
    , function()
      { sendHtml(marked.parse(text))
      ; send('toc', null)
      ; send('names', null)
      ; ack('end')
      ; close()
      }
    )
