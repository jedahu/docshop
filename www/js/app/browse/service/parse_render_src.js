define(['util/src_parser'], function(srcParser)

{ var parseRenderSrcService = function($injector)
  { return function parseRenderSrc(repo, file)
    { var convert = $injector.get(/*file.markup*/ 'text' + 'Render')
    ; if (convert)
      { return file
        . then
          ( function(file1)
            { return repo.readFile(file1.path)
              . then
                ( function(text)
                  { return convert
                      ( file1.lang
                      , srcParser(file1.lang, text)
                      )
                  }
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

