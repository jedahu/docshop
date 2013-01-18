; var send = function(type, data)
      { postMessage(JSON.stringify({type: type, data: data}))
      }
    , sendHtml = function(str)
      { send('html', str)
      }
    , ack = function(type)
      { send('ack', type)
      }
    , renderingComplete = function()
      { ack('ds-rendering-done')
      }
    , receive = function(type, cb)
      { var listener = function(evt)
            { var msg = JSON.parse(evt.data)
            ; if (msg.type === type) cb(msg.data)
            }
      ; addEventListener('message', listener)
      ; return listener
      }
    , receiveOnce = function(type, cb)
      { var listener = receive
          ( type
          , function(data)
            { cb(data)
            ; removeEventListener('message', listener)
            }
          )
      }
    , escapeHtml = function(str)
      { return str
        . replace(/&/, '&#38;')
        . replace(/</, '&#60;')
        . replace(/>/, '&#62;')
        . replace(/"/, '&#34;')
        . replace(/'/, '&#39;')
      }

; XMLHttpRequest = null
; setTimeout = null
; setInterval = null

; receiveOnce
    ( 'ds-renderer-src'
    , function(src)
      { eval('eval = null;' + src)
      }
    )
