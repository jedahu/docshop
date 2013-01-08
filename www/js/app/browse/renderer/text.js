define(function()

{ var textRenderService = function($q, $rootScope)
  { return function textRender(lang, parser)
    { var deferred = $q.defer()
        , text = ''
    ; parser
      . on
        ( 'comment'
        , function()
          { text += '<pre class="comment">'
          }
        )
      . on
        ( '/comment'
        , function()
          { text += '</pre>'
          }
        )
      . on
        ( 'code'
        , function()
          { text += '<pre class="code prettyprint lang-' + lang + '">'
          }
        )
      . on
        ( '/code'
        , function()
          { text += '</pre>'
          }
        )
      . on
        ( 'line'
        , function(line)
          { text += line + '\n'
          }
        )
      . on
        ( 'end'
        , function()
          { deferred.resolve(text)
          }
        )
      . parse()
    ; return deferred.promise
    }
  }

; textRenderService.$inject = ['$q', '$rootScope']
; return textRenderService

});
