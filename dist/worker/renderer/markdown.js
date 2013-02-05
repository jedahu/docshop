; importScripts('lib/marked.js')

; var lang = ''
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
      { text += '\n```' + lang + '\n'
      }
    )
; receive
    ( '/code'
    , function()
      { text += '```\n\n'
      }
    )
; receive
    ( 'code.line'
    , function(line)
      { text += line
      }
    )
; receive
    ( 'comment.line'
    , function(line)
      { text += line.text
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
