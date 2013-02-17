; import browse from '/browse.js'
; import nextTickMockService from 'next_tick_mock.js'
; import ngIt from '/test/util.js'

; const assert = chai.assert
; const $injector = angular.injector(['ng', 'BrowseModule'])
; const inject = (fn) => fn($injector)

; let srcParser
; let $rootScope
; const $it = ngIt($injector)

; const pyLang = {open: '"""', middle: '', close: '"""', name: 'python'}
; const jsLang = {open: '/*', middle: ' *', close: '*/', name: 'javascript'}

; beforeEach(() =>
    { inject(($injector) =>
        { srcParser = $injector.get('srcParser')
        ; $rootScope = $injector.get('$rootScope')
        })
    })

; describe('src_parser', function()
    { this.timeout(100000)
    ; $it('should parse meta data', (done) =>
        { const parser = srcParser
            ( pyLang
            , '""" !meta\n'
                + 'title: Meta Test\n'
                + '...\n'
                + '"""\n'
            )
        ; parser.parse().then
            ( () =>
                { assert.deepEqual({title: 'Meta Test'}, parser.metaData)
                ; done()
                }
            , done
            )
        })
    ; $it('should parse meta data (with middle)', (done) =>
        { const parser = srcParser
            ( jsLang
            , '/* !meta\n'
                + ' * title: Meta Test\n'
                + ' * ...\n'
                + ' */\n'
            )
        ; parser.parse().then
            ( () =>
                { assert.deepEqual({title: 'Meta Test'}, parser.metaData)
                ; done()
                }
            , done
            )
        })
    ; $it('should parse multiple meta datas', (done) =>
        { const parser = srcParser
            ( pyLang
            , '""" !meta\n'
                + 'title: Meta Test\n'
                + '...\n'
                + '"""\n'
                + '""" !meta\n'
                + 'author: Me\n'
                + 'time: Now\n'
                + '"""\n'
                + '  """ !meta\n'
                + '  color: Red\n'
                + '  """\n'
            )
        ; parser.parse().then(() =>
            { assert.deepEqual
                ( { title: 'Meta Test'
                  , author: 'Me'
                  , time: 'Now'
                  , color: 'Red'
                  }
                , parser.metaData
                )
            })
            .then(done, done)
        })
    ; $it('should parse multiple meta datas (with middle)', (done) =>
        { const parser = srcParser
            ( jsLang
            , '/* !meta\n'
                + ' * title: Meta Test\n'
                + ' * ...\n'
                + ' */\n'
                + '/* !meta\n'
                + ' * author: Me\n'
                + ' * time: Now\n'
                + ' */\n'
                + '  /* !meta\n'
                + '   * color: Red\n'
                + '   */\n'
            )
        ; parser.parse().then(() =>
            { assert.deepEqual
                ( { title: 'Meta Test'
                  , author: 'Me'
                  , time: 'Now'
                  , color: 'Red'
                  }
                , parser.metaData
                )
            })
            .then(done, done)
        })
    ; $it('should parse code (and escape it)', (done) =>
        { const parser = srcParser(pyLang, 'a < b')
        ; const events = []
        ; parser.events.onAll((evt, arg) => events.push([evt, arg]))
        ; parser.parse().then(() =>
            { const expect =
                [ [ 'html'
                  , parser.openCodeBlock()
                      + 'a &#60; b'
                      + parser.closeCodeBlock
                  ]
                , ['end', null]
                ]
            ; for (let i in events)
                { assert.equal(expect[i][0], events[i][0])
                ; assert.equal(expect[i][1], events[i][1])
                }
            })
            .then(done, done)
        })
    ; $it('should parse comment', (done) =>
        { const parser = srcParser
            ( pyLang
            , '"""\n'
                + 'A single line comment.\n'
                + '"""\n'
                + '  """\n'
                + '  An indented comment.\n'
                + '  """\n'
            )
        ; const events = []
        ; parser.events.onAll((evt, ...args) => events.push([evt, ...args]))
        ; parser.parse().then(() =>
            { const expect =
                [ ['comment', 'A single line comment.']
                , ['comment', 'An indented comment.']
                ]
            ; assert.equal(expect[0][0], events[0][0])
            ; assert.deepEqual(expect[0][1], events[0][1])
            })
            .then(done, done)
        })
    ; $it('should parse comment (with middle)', (done) =>
        { const parser = srcParser
            ( jsLang
            , '/*\n'
                + ' * A single line comment.\n'
                + ' */\n'
                + '  /*\n'
                + '   * An indented comment.\n'
                + '   */\n'
            )
        ; const events = []
        ; parser.events.onAll((evt, ...args) => events.push([evt, ...args]))
        ; parser.parse().then(() =>
            { const expect =
                [ ['comment', 'A single line comment.']
                , ['comment', 'An indented comment.']
                ]
            ; assert.equal(expect[0][0], events[0][0])
            ; assert.deepEqual(expect[0][1], events[0][1])
            })
            .then(done, done)
        })
    ; $it('should parse code comment', (done) =>
        { const parser = srcParser
            ( pyLang
            , '""" !code python\n'
                + 'a > b\n'
                + '"""\n'
                + '  """ !code\n'
                + '  c > d\n'
                + '  """\n'
            )
        ; const events = []
        ; parser.events.onAll((evt, ...args) => events.push([evt, ...args]))
        ; parser.parse().then(() =>
            { const expect =
                [ ['html', parser.openCodeBlock('python')]
                , ['html', 'a &#62; b\n']
                , ['html', parser.closeCodeBlock]
                , ['html', parser.openCodeBlock('python')]
                , ['html', 'c &#62; d\n']
                , ['html', parser.closeCodeBlock]
                ]
            ; for (let i in expect)
                { assert.equal(expect[i][0], events[i][0])
                ; assert.equal(expect[i][1], events[i][1])
                }
            })
            .then(done, done)
        })
    ; $it('should parse code comment (with middle)', (done) =>
        { const parser = srcParser
            ( jsLang
            , '/* !code python\n'
                + ' * a > b\n'
                + ' */\n'
                + '  /* !code\n'
                + '   * c > d\n'
                + '   */\n'
            )
        ; const events = []
        ; parser.events.onAll((evt, ...args) => events.push([evt, ...args]))
        ; parser.parse().then(() =>
            { const expect =
                [ ['html', parser.openCodeBlock('python')]
                , ['html', 'a &#62; b\n']
                , ['html', parser.closeCodeBlock]
                , ['html', parser.openCodeBlock('javascript')]
                , ['html', 'c &#62; d\n']
                , ['html', parser.closeCodeBlock]
                ]
            ; for (let i in expect)
                { assert.equal(expect[i][0], events[i][0])
                ; assert.equal(expect[i][1], events[i][1])
                }
            })
            .then(done, done)
        })
    })
