define
  ( [ 'util/src_parser'
    , 'lib/HTMLOutliner'
    ]
  , function
      ( srcParser
      , h5o
      )

{ var parseRenderSrcService = function($q, $http, $rootScope)
  { var process = function(result)
    { var wrapper = document.createElement('div')
        , names
        , toc
        , idCount = 0
    ; wrapper.innerHTML = result.html
    ; h5o(wrapper)
    ; names =
        result.names
        || [].map.call
             ( wrapper.querySelectorAll('[id^="id:"]')
             , function(elm)
               { return elm.getAttribute('id').slice(3)
               }
             )
           . sort()
    ; toc = [].slice.call(wrapper.querySelectorAll('h1,h2,h3,h4'), 0)
    ; toc.forEach
        ( function(h)
          { if (!h.id)
            { h.id = 'ds-h-' + idCount++
            }
          }
        )
    ; return {
          html: wrapper
        , names: names.length > 0 ? names : null
        , toc: toc.length > 0 ? toc : null
        }
    }
  ; return function parseRenderSrc(repo, file)
    { var deferred = $q.defer()
    ; $http
        ( { method: 'GET'
          , url: 'worker/renderer/' + file.markup + '.js?' + new Date()
          , transformResponse: function(x) { return x }
          }
        )
      . success
        ( function(rendererSrc)
          { return repo.readFile(file.path)
            . then
              ( function(text)
                { var worker = new Worker('worker/renderer.js?' + new Date())
                    , out = {html: ''}
                ; worker.addEventListener
                    ( 'message'
                    , function(evt)
                      { var msg = JSON.parse(evt.data)
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
                              { deferred.resolve(process(out))
                              ; $rootScope.$digest()
                              }
                            ; break
                        }
                      }
                    )
                ; worker.postMessage
                    ( JSON.stringify
                        ( { type: 'ds-renderer-src'
                          , data: rendererSrc
                          }
                        )
                    )
                ; worker.postMessage
                    ( JSON.stringify({type: 'lang', data: file.lang})
                    )
                ; srcParser(file.lang, text)
                  . on
                    ( [ 'comment', '/comment'
                      , 'code', '/code'
                      , 'line', 'end'
                      ]
                    , function(evtName, arg)
                      { worker.postMessage
                          ( JSON.stringify({type: evtName, data: arg})
                          )
                      }
                    )
                }
              , function(err)
                { deferred.reject(err)
                  ; $rootScope.$digest()
                }
              )
          }
        )
      . error
        ( function(err)
          { deferred.reject(err)
          ; $rootScope.$digest()
          }
        )
    ; return deferred.promise
    }
  }

; parseRenderSrcService.$inject = ['$q', '$http', '$rootScope']
; return parseRenderSrcService

});

