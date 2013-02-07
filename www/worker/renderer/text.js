; receive
    ( 'comment.open'
    , function()
      { sendHtml('<pre class="comment" style="background-color: lightblue">')
      }
    )
; receive
    ( 'comment.close'
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
    ( 'html'
    , function(html)
      { sendHtml(html)
      }
    )
; receive
    ( 'end'
    , function()
      { ack('end')
      ; close()
      }
    )
