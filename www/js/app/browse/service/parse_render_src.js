; import HTMLOutline from '/util/HTMLOutliner.js'
; import htmlVar from '/util/html_var.js'

; const workerCache = {}

; export const parseRenderSrcService =
    ($q, $http, $rootScope, $timeout, srcParser) =>
      (repo, file) =>
        parseRenderSrc($q, $http, $rootScope, $timeout, srcParser, repo, file)

; const process = (result) =>
    { const wrapper = angular.element('<div>')
    ; let idCount = 0
    ; wrapper.html(result.html)
    ; HTMLOutline(wrapper[0])
    ; const names =
        result.names
        || [].map.call
             ( wrapper.find('[id^="id:"]')
             , (elm) => elm.getAttribute('id').slice(3)
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
        , names: names.length > 0 ? names : null
        , toc: toc.length > 0 ? toc : null
        , meta: result.meta
        })
    }

; const parseRenderSrc =
    ($q, $http, $rootScope, $timeout, srcParser, repo, file) =>
      { if (!workerCache[file.markup])
          { const deferredWorker = $q.defer()
          ; workerCache[file.markup] = deferredWorker.promise
          ; $http(
              { method: 'GET'
              , url: htmlVar('ds:var:rendererParserUrl')[file.markup]
              , transformResponse: (x) => x
              })
              .then(({data: rendererSrc}) =>
                { const worker =
                    new Worker(htmlVar('ds:var:rendererWorkerUrl').value)
                ; console.log('new worker')
                ; worker.postMessage
                    ( JSON.stringify(
                        { type: 'ds-renderer-src'
                        , data: rendererSrc
                        })
                    )
                ; deferredWorker.resolve(worker)
                })
          }
      ; return workerCache[file.markup].then((worker) =>
          repo.readFile(file.path).then((text) =>
            { const out = {html: ''}
            ; const parser = srcParser(file.lang, text)
            ; const deferredOut = $q.defer()
            ; $timeout(() => deferredOut.reject('timeout'), 10000)
            ; worker.addEventListener('message', (evt) =>
                { const msg = JSON.parse(evt.data)
                ; switch (msg.type)
                  { case 'html'
                      : out.html += msg.data
                      ; break
                    case 'toc'
                      : out.toc = msg.data
                      ; break
                    case 'names'
                      : out.names = msg.data
                      ; break
                    case 'ack'
                      : if (msg.data === 'end')
                        { out.meta = parser.metaData
                        ; deferredOut.resolve(process(out))
                        ; $rootScope.$apply()
                        }
                      ; break
                    case 'log'
                      : console.log('LOG', msg.data)
                      ; break
                  }
                })
            ; worker.postMessage
                ( JSON.stringify(
                    { type: 'start'
                    , data: file.lang.name
                    })
                )
            ; parser.on('*', (evtName, arg) =>
                { worker.postMessage
                    ( JSON.stringify({type: evtName, data: arg})
                    )
                })
            ; return deferredOut.promise
            })
          )
      }

; parseRenderSrcService.$inject = ['$q', '$http', '$rootScope', '$timeout', 'srcParser']
