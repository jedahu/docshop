; var text = ''

; importScripts('lib/evilstreak-markdown.js')

; receive('comment.open', function(_label)
    { text = ''
    })

; receive('comment.line', function(line)
    { text += line.text
    })

; receive('comment.close', function(_label)
    { sendHtml(markdown.toHTML(text, 'Maruku'))
    })

; receive('html', function(html)
    { sendHtml(html)
    })

; receive('end', function()
    { ack('end')
    ; close()
    })
