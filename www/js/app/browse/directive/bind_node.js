define(function()

{ return function bindNodeDirective()
  { return function bindNode(scope, elem, attr)
    { scope.$watch
        ( attr.dsBindNode
        , function(value)
          { elem[0].innerHTML = ''
          ; if (value)
            { elem[0].appendChild(value)
            }
          }
        )
    }
  }

});
