; import browse from '/browse.js'
; import _test from 'parse_render_src.js'
; import ngIt from '/test/util.js'
; import {exceptionHandlerMockService, setEhCallback}
    from 'exception_handler_mock.js'

; const assert = chai.assert
; const testModule = angular.module('TestModule', ['BrowseModule'])
    .factory('$exceptionHandler', exceptionHandlerMockService)
; const $injector = angular.injector(['ng', 'TestModule'])
; const $it = ngIt($injector)

; let parseRenderSrc
; let $rootScope

; beforeEach(() =>
    { parseRenderSrc = $injector.get('parseRenderSrc')
    ; $rootScope = $injector.get('$rootScope')
    ; setEhCallback(null)
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
    ; describe('parseRenderSrc', () =>
        { $it('should fire result event', (done) =>
            { parseRenderSrc
                ( { name: 'foo'
                  , path: 'foo.js'
                  , markup: 'text'
                  , lang: {open: '/*', middle: '', close: '*/', name: 'js'}
                  }
                , '"A single line of code."'
                , {}
                )
            ; $rootScope.$on('renderer-result', (_evt, file, result) =>
                { done()
                })
            })
        ; $it('should fire error events', (done) =>
            { setEhCallback((err, cause) =>
                { if (err.name === 'parser-error') done()
                })
            ; $rootScope.$apply(() => parseRenderSrc
                ( { name: 'foo'
                  , path: 'foo.js'
                  , markup: 'text'
                  , lang: {open: '/*', middle: '', close: '*/', name: 'js'}
                  }
                , ['Not', 'a', 'string']
                , {}
                ))
            })
        })
    })
