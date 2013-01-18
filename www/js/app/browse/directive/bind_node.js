define(function()

{ return function bindNodeDirective()
  { return function bindNode(scope, elem, attr)
    { scope.$watch
        ( attr.dsBindNode
        , function(value)
          { elem.html('')
          ; if (value)
            { elem.append(value)
            }
          }
        )
    }
  }

});
