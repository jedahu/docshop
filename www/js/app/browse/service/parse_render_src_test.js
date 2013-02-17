; import browse from '/browse.js'
; import _test from 'parse_render_src.js'
; import ngIt from '/test/util.js'

; const assert = chai.assert
; const $injector = angular.injector(['ng', 'BrowseModule'])
; const $it = ngIt($injector)

; beforeEach(() =>
    {
    })

; describe('parse_render_src', () =>
    { describe('processResult', () =>
        { it('should return correct types', () =>
            { const result = _test.processResult('html string', {})
            ; assert.instanceOf(result.html, jQuery.fn.init)
            ; assert.instanceOf(result.names, Array)
            ; assert.instanceOf(result.toc, Array)
            ; assert.instanceOf(result.meta, Object)
            })
        ; it('should pass meta through unless it is null', () =>
            { const m = {foo: 'bar'}
            ; const result = _test.processResult('', m)
            ; assert(m is result.meta)
            ; assert.deepEqual({foo: 'bar'}, result.meta)
            ; const result2 = _test.processResult('', null)
            ; assert.deepEqual({}, result2.meta)
            })
        ; it('should collect names', () =>
            { const result = _test.processResult
                ( '<div id="name:alpha">Alpha</div>\n'
                  + '<section>\n'
                  + '  <p id="name:beta">Beta</p>\n'
                  + '  <p id="name:name:">Name</p>\n'
                  + '</section>\n'
                , {}
                )
            ; assert.deepEqual(['alpha', 'beta', 'name:'], result.names)
            })
        ; it('should collect toc', () =>
            { const result = _test.processResult
                ( '<h1 id="a">A</h1>\n'
                  + '<section>\n'
                  + '  <h1 id="b">B</h1>\n'
                  + '  <h3 id="c">C</h3>\n'
                  + '</section>\n'
                  + '<h1 id="d">D</h1>\n'
                , {}
                )
            ; assert.deepEqual
                ( ['a', 'b', 'c', 'd']
                , result.toc.map((elm) => elm.id)
                )
            })
        })
    ; describe('parseMeta', () =>
        { it('should return {} when no metadata is found at ^', () =>
            { assert.deepEqual({}, _test.parseMeta(''))
            ; assert.deepEqual
                ( {}
                , _test.parseMeta
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
                , _test.parseMeta
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
                , _test.parseMeta
                    ( '#. !meta\n'
                        + '# date: Today\n'
                        + '# lang: shell\n'
                        + '# ...\n'
                        + '#.\n'
                    )
                )
            })
        })
    })
