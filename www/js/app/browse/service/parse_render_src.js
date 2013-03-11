; import HTMLOutline from '/util/HTMLOutliner.js'
; import htmlVar from '/util/html_var.js'

; export const parseRenderSrcService =
    ($q, $http, $rootScope, $timeout, $injector, srcParser) =>
      (file, text, meta) =>
        parseRenderSrc
          ( $q, $http, $rootScope, $timeout, $injector, srcParser
          , file, text, meta
          )

; const processResult = (html, meta) =>
    { const wrapper = angular.element('<div>')
    ; let idCount = 0
    ; wrapper.html(html)
    ; HTMLOutline(wrapper[0])
    ; const elems = wrapper.find('pre > code')
    ; for (let i = 0; i < elems.length; ++i)
        { const elem = elems[i]
        ; if (elem.innerHTML.match(/^(?:\s*\n)*$/))
            { elem.remove()
            ; continue
            }
        ; elem.innerHTML = elem.innerHTML
            .replace(/^(?:\s*\n)*/, '')
            .replace(/(?:\n\s*)*$/, '')
        }
    ; const names = [].map.call
        ( wrapper.find('[id^="name:"]')
        , (elm) => elm.getAttribute('id').slice('name:'.length)
        )
        .sort()
    ; const toc = [].slice.call(wrapper.find('h1,h2,h3,h4'), 0)
    ; toc.forEach((h) =>
        { if (!h.id)
            { h.id = 'ds-h-' + idCount++
            }
        })
    ; return (
        { html: wrapper
        , names: names
        , toc: toc
        , meta: meta || {}
        })
    }

; const jobs = []

; const cancelJobs = ($rootScope) =>
    { while (jobs.length > 0)
        { let job = jobs.pop()
        ; job.parser.events.offAll()
        ; $rootScope.$broadcast('renderer-cancel', job.file)
        }
    }

; const parseRenderSrc =
    ( $q, $http, $rootScope, $timeout, $injector, srcParser
    , file, text, meta
    )
    =>
    { const parser = srcParser(file.lang, text)
    ; let html = ''
    ; const render = $injector.get(file.markup + 'Renderer')
    ; const handle = (evt, ...args) =>
        { switch (evt)
            { case 'html'
                : html += args[0]
                ; break
              case 'comment'
                : try
                    { html += render(...args)
                    }
                  catch (err)
                    { parser.events.offAll()
                    ; throw (
                        { name: 'renderer-error'
                        , error: err
                        , file: file
                        })
                    }
                ; break
              case 'end'
                : parser.events.offAll()
                ; $rootScope.$broadcast
                    ( 'renderer-result'
                    , file
                    , processResult(html, meta)
                    )
                ; break
            }
        }
    ; cancelJobs($rootScope)
    ; jobs.push({parser, file})
    ; parser.events.onAll(handle)
    ; $timeout
        ( () => $rootScope.$broadcast('renderer-timeout', file)
        , 10000 // TODO parameterise
        )
    ; parser.parse().then(null, (err) =>
        { throw {name: 'parser-error', error: err}
        })
    }

; parseRenderSrcService.$inject = ['$q', '$http', '$rootScope', '$timeout', '$injector', 'srcParser']

; export module _test
    { export processResult
    ; export readFile
    ; export jobs
    ; export cancelJobs
    }
