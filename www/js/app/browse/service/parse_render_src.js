define
  ( ['util/src_parser'
    ]
  , function
      ( srcParser
      )

{ var parseRenderSrcService = function($q, $http, $rootScope)
  { var process = function(result)
    { var wrapper = document.createElement('div')
        , out =
            { html: wrapper
            , names:
                result.names
                ||[].map.call
                    ( wrapper.querySelectorAll('[id^="id:"]')
                    , function(elm)
                      { return elm.getAttribute('id').slice(3)
                      }
                    )
                  . sort()
            , toc:
                result.toc
                || [].slice.call(wrapper.querySelectorAll('h1,h2,h3'), 0)
            }
    ; wrapper.innerHTML = result.html
    ; return out
    }
  ; return function parseRenderSrc(repo, file)
    { var deferred = $q.defer()
    ; $http
        ( { method: 'GET'
          , url: 'worker/renderer/' + file.markup + '.js'
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
                }
              )
          }
        )
      . error
        ( function(err)
          { deferred.reject(err)
          }
        )
    ; return deferred.promise
    }
  }

; parseRenderSrcService.$inject = ['$q', '$http', '$rootScope']
; return parseRenderSrcService

});

