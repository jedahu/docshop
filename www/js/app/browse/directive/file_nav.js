define(function()

{ var fileNavDirective = function($compile)
  { return function fileNav(scope, elem, attr)
    { var headingTemplate = elem[0].firstElementChild
        , fileTemplate = elem[0].lastElementChild
        , parts = attr.dsFileNav.split(/\s+/)
        , varname = parts[0]
        , tree = parts[2]
        , item
        , i
        , sublist
        , heading
        , headingText
        , file
        , newScope
    ; if (scope._wrapperScope) scope._wrapperScope.$destroy()
    ; scope._wrapperScope = scope.$new()
    ; scope.$watch
        ( tree
        , function(value)
          { elem[0].innerHTML = ''
          ; (function populate(parent, items)
            { for (i in items)
              { item = items[i]
              ; newScope = scope._wrapperScope.$new()
              ; if (Object.keys(item).length === 1) // sublist
                { sublist = document.createElement(elem[0].tagName)
                ; heading = headingTemplate.cloneNode(true)
                ; headingText = Object.keys(item)[0]
                ; sublist.appendChild(heading)
                ; parent.appendChild(sublist)
                ; newScope[varname] = {text: headingText}
                ; $compile(heading)(newScope)
                ; populate(sublist, item[headingText])
                }
                else // file
                { file = fileTemplate.cloneNode(true)
                ; parent.appendChild(file)
                ; newScope[varname] = item
                ; $compile(file)(newScope)
                }
              }
            })(elem[0], value)
          }
        )
    //; $compile(elem.contents())(scope)
    }
  }

; fileNavDirective.$inject = ['$compile']
; return fileNavDirective

});
