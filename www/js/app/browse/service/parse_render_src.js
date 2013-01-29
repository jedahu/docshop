//define
//  ( [ 'util/src_parser'
//    , 'lib/HTMLOutliner'
//    ]
//  , function
//      ( srcParser
//      , h5o
//      )
; import srcParser from '../../util/src_parser.js'
; import HTMLOutline from '../../util/HTMLOutliner.js'

; export const parseRenderSrcService = ($q, $http, $rootScope) =>
    { const process = (result) =>
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
    ; return (repo, file) =>
        { const deferred = $q.defer()
        ; $http
            ( { method: 'GET'
              , url: 'worker/renderer/' + file.markup + '.js?' + new Date()
              , transformResponse: (x) => x
              }
            )
            .success((rendererSrc) =>
              { return repo.readFile(file.path)
                  .then
                    ( (text) =>
                        { const worker = new Worker('worker/renderer.js?' + new Date())
                        ; const out = {html: ''}
                        ; const parser = srcParser(file.lang, text)
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
                                    ; deferred.resolve(process(out))
                                    ; $rootScope.$digest()
                                    }
                                  ; break
                              }
                            })
                        ; worker.postMessage
                            ( JSON.stringify
                                ( { type: 'ds-renderer-src'
                                  , data: rendererSrc
                                  }
                                )
                            )
                        ; if (file.lang)
                            { worker.postMessage
                                ( JSON.stringify({type: 'lang', data: file.lang.name})
                                )
                            }
                        ; parser.on('*', (evtName, arg) =>
                            {worker.postMessage
                              ( JSON.stringify({type: evtName, data: arg})
                              ); console.log(evtName, arg)})
                        }
                    , (err) =>
                        { deferred.reject(err)
                        ; $rootScope.$digest()
                        }
                    )
              })
            .error((err) =>
              { deferred.reject(err)
              ; $rootScope.$digest()
              })
        ; return deferred.promise
        }
    }

; parseRenderSrcService.$inject = ['$q', '$http', '$rootScope']
