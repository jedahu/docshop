; import browse from '/browse.js'
; import parseMeta from 'parse_meta.js'

; const assert = chai.assert

; describe('parseMeta', () =>
    { it('should return {} when no metadata is found at ^', () =>
        { assert.deepEqual({}, parseMeta(''))
        ; assert.deepEqual
            ( {}
            , parseMeta
                ( '\n'
                    + '/* !meta\n'
                    + 'foo: bar\n'
                    + '...\n'
                    + '*/\n'
                )
            )
        })
    ; it('should guess comment syntax', () =>
        { assert.deepEqual
            ( { foo: 'bar'
              , lang:
                  { open: '/*'
                  , middle: ''
                  , close: '*/'
                  , name: undefined
                  }
              }
            , parseMeta
                ( '/* !meta\n'
                    + 'foo: bar\n'
                    + '...\n'
                    + '*/\n'
                )
            )
        ; assert.deepEqual
            ( { date: 'Today'
              , lang:
                  { open: '#.'
                  , middle: '#'
                  , close: '#.'
                  , name: 'shell'
                  }
              }
            , parseMeta
                ( '#. !meta\n'
                    + '# date: Today\n'
                    + '# lang: shell\n'
                    + '# ...\n'
                    + '#.\n'
                )
            )
        })
    })
