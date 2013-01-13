define(function()

{ var fileNavDirective = function($compile)
  { return function fileNav(scope, elem, attr)
    { var headingTemplate = angular.element(elem[0].firstElementChild)
        , fileTemplate = angular.element(elem[0].lastElementChild)
        , parts = attr.dsFileNav.split(/\s+/)
        , varname = parts[0]
        , tree = parts[2]
        , item
        , i
        , sublist
        , subitems
        , index
        , heading
        , headingText
        , file
        , newScope
    ; if (scope._wrapperScope) scope._wrapperScope.$destroy()
    ; scope._wrapperScope = scope.$new()
    ; scope.$watch
        ( tree
        , function(value)
          { elem.html('')
          ; (function populate(parent, items)
            { for (i in items)
              { item = items[i]
              ; if (item.name === '!index') continue
              ; newScope = scope._wrapperScope.$new()
              ; if (Object.keys(item).length === 1) // sublist
                { sublist = angular.element(document.createElement(elem[0].tagName))
                ; heading = headingTemplate.clone(true)
                ; headingText = Object.keys(item)[0]
                ; sublist.append(heading)
                ; parent.append(sublist)
                ; subitems = item[headingText]
                ; if ((index = subitems.filter
                        ( function(x)
                          { return x.name === '!index'
                          }
                        )
                      )
                      . length > 0)
                  { newScope[varname] = index[0]
                  ; heading.data('path', index[0].path)
                  }
                  else newScope[varname] = {}
                ; newScope[varname].text = headingText
                ; $compile(heading)(newScope)
                ; populate(sublist, subitems)
                }
                else // file
                { file = fileTemplate.clone(true)
                ; parent.append(file)
                ; newScope[varname] = item
                ; file.data('path', item.path)
                ; $compile(file)(newScope)
                }
              }
            })(elem, value)
          }
        )
    ; elem.bind
        ( 'click'
        , function(evt)
          { var elem = angular.element(evt.target)
              , path = elem.data('path')
          ; if (path) scope.$apply(function() { scope.changePathTo(path) })
          }
        )
    }
  }

; fileNavDirective.$inject = ['$compile']
; return fileNavDirective

});
