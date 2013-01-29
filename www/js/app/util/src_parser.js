//define
//  ( [ 'lib/micro_emitter'
//    , 'util/tick'
//    , 'lib/js-yaml'
//    ]
//  , function(microEmitter, tick, jsyaml)
; import {forEach, loop} from 'tick.js'
; import microEmitter from 'micro_emitter.js'

; export const srcParser = (lang, text) =>
    { const lines = text.split('\n')
    ; let section = null
    ; let commentLabel = null
    ; const me = Object.create(microEmitter)
    ; let metaStr = ''
    ; const isCommentOpen = (line) =>
        line.trimLeft().indexOf(lang.open) === 0
    ; const isCommentClose = (line) =>
        line.trimLeft().indexOf(lang.close) === 0
    ; const consumeMetaComment = (i) =>
        { for (; i < lines.length; ++i)
            { if (isCommentClose(lines[i])) break
              metaStr += lines[i] + '\n'
            }
        ; me.metaData = jsyaml.load(metaStr)
        ; return ++i
        }
    ; if (!lang)
        { me.emit('comment')
        ; forEach
            ( lines
            , (line, next) =>
                { me.emit('comment.line', {text: line + '\n'})
                ; next()
                }
            , (err) =>
                { if (err) { /* handle error */ }
                ; me.emit('/comment')
                ; me.emit('end')
                }
            )
        ; return me
        }
    ; loop
        ( 0
        , (i) => i < lines.length
        , (i) => i + 1
        , (i, next, err) =>
            { const line = lines[i] + '\n'
            ; const trimmed = line.trimLeft()
            ; const nextI = i + 1
            ; const maybeOpenCodeSection = () =>
                { while ((line = lines[nextI = ++i]).trim() == '')
                    { //pass
                    }
                ; if (!isCommentOpen(line))
                    { me.emit('code')
                    ; section = 'code'
                    }
                ; return nextI
                }
            ; if (isCommentOpen(line))
                { if (section === 'code') me.emit('/code')
                ; commentLabel = trimmed.slice(lang.open.length).trim() || null
                ; if (commentLabel === '!meta')
                    { nextI = consumeMetaComment(++i)
                    ; console.log('meta', metaStr)
                    ; return next(nextI)
                    }
                ; me.emit('comment', commentLabel)
                ; section = 'comment'
                ; return next()
                }
            ; if (isCommentClose(line))
                { me.emit('/comment', commentLabel)
                ; if (!isCommentOpen(lines[i + 1]))
                    { return next(maybeOpenCodeSection())
                    }
                ; return next()
                }
            ; if (section === 'comment')
                { me.emit
                    ( 'comment.line'
                    , { label: commentLabel
                      , text: trimmed.slice(lang.middle.length)
                      }
                    )
                ; return next()
                }
            ; if (section === 'code')
                { me.emit('code.line', line)
                ; return next()
                }
            ; return next(maybeOpenCodeSection())
            }
        , (_i) =>
            { if (section === 'code') me.emit('/code')
              else me.emit('/comment', commentLabel)
            ; me.emit('end')
            }
        , (err) =>
            { // TODO handle error
            }
        )
    ; return me
    }
