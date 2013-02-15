/* !meta
title: Source Parser Tests
author: Jeremy Hughes <jedahu@gmail.com>
implementation: /www/js/app/browse/service/src_parser/directive.js
*/
; import directive from '/browse/service/src_parser/directive.js'

; const assert = chai.assert

; describe('src_parser', () =>

/* !test directive.name
*/
    { describe('directive.name', () =>
        { it('should parse name only', () =>
            { assert.equal
                ( '<div class="ds:name" id="name:CONST_VAR">CONST_VAR</div>'
                , directive.name('CONST_VAR')
                )
            })
        ; it('should escape name', () =>
            { assert.equal
                ( '<div class="ds:name" id="name:&#60;&#62;">&#60;&#62;</div>'
                , directive.name('<>')
                )
            })
        ; it('should parse type information', () =>
            { assert.equal
                ( '<div class="ds:name" id="name:prime">'
                  + 'prime <span class="ds:info">integer</span></div>'
                , directive.name('prime integer')
                )
            })
        ; it('should escape type information', () =>
            { assert.equal
                ( '<div class="ds:name" id="name:incr">'
                  + 'incr <span class="ds:info">(int) =&#62; int</span></div>'
                , directive.name('incr (int) => int')
                )
            })
        })

    })
