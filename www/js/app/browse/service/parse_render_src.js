define(['util/src_parser'], function(srcParser)

{ var parseRenderSrcService = function($injector)
  { return function parseRenderSrc(repo, file)
    { var convert = $injector.get(/*file.markup*/ 'text' + 'Render')
    ; if (convert)
      { return repo.readFile(file.path)
        . then
          ( function(text)
            { return convert
                ( file.lang
                , srcParser(file.lang, text)
                )
            }
          )
      }
      else
      { throw new Error('No such markup: ' + file.markup)
      }
    }
  }

; parseRenderSrcService.$inject = ['$injector']

; return parseRenderSrcService

});

