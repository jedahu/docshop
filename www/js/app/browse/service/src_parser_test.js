; import browse from '/browse.js'
; import nextTickMockService from 'next_tick_mock.js'

; const assert = chai.assert
; const inject = (fn) => fn(angular.injector(['ng', 'BrowseModule']))
; const that = (text, fn) =>
    it(text, (done) =>
      { let fin
      ; const finished = (err) =>
          { fin = true
          ; done(err)
          }
      ; fn(finished)
      ; while (!fin) {$rootScope.$digest()}
      ; $rootScope.$digest()
      })

; let srcParser
; let $rootScope

; const jsLang = {open: '/*', middle: '', close: '*/', name: 'javascript'}

; beforeEach(() =>
    { //browse.factory('nextTick', nextTickMockService)
    //; browse.value('$q', when)
    ; inject(($injector) =>
        { srcParser = $injector.get('srcParser')
        ; $rootScope = $injector.get('$rootScope')
        })
    })

; describe('src_parser', function()
    { this.timeout(100000)
    ; that('should parse meta data', (done) =>
        { const parser = srcParser
            ( jsLang
            , '/* !meta\n'
                + 'title: Meta Test\n'
                + '...\n'
                + '*/\n'
            )
        ; parser.parse().then
            ( () =>
                { assert.deepEqual({title: 'Meta Test'}, parser.metaData)
                ; done()
                }
            , done
            )
        })
    ; that('should parse multiple meta datas', (done) =>
        { const parser = srcParser
            ( jsLang
            , '/* !meta\n'
                + 'title: Meta Test\n'
                + '...\n'
                + '*/\n'
                + '/* !meta\n'
                + 'author: Me\n'
                + 'time: Now\n'
                + '*/\n'
            )
        ; parser.parse().then(() =>
            { assert.deepEqual
                ( { title: 'Meta Test'
                  , author: 'Me'
                  , time: 'Now'
                  }
                , parser.metaData
                )
            })
            .then(done, done)
        })
    ; that('should parse code (and escape it)', (done) =>
        { const parser = srcParser(jsLang, 'a < b')
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
    ; that('should parse comment', (done) =>
        { const parser = srcParser
            ( jsLang
            , '/*\n'
                + 'A single line comment.\n'
                + '*/\n'
            )
        ; const events = []
        ; parser.events.onAll((evt, ...args) => events.push([evt, ...args]))
        ; parser.parse().then(() =>
            { const expect = [['comment', 'A single line comment.']]
            ; assert.equal(expect[0][0], events[0][0])
            ; assert.deepEqual(expect[0][1], events[0][1])
            })
            .then(done, done)
        })
    ; that('should parse code comment', (done) =>
        { const parser = srcParser
            ( jsLang
            , '/* !code python\n'
                + 'a > b\n'
                + '*/\n'
            )
        ; const events = []
        ; parser.events.onAll((evt, ...args) => events.push([evt, ...args]))
        ; parser.parse().then(() =>
            { const expect =
                [ ['html', parser.openCodeBlock('python')]
                , ['html', 'a &#62; b\n']
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
