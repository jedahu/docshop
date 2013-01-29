; export const fileNavDirective = ($compile) =>
    (scope, elem, attr) =>
      { const ngelem = angular.element
      ; const headingTemplate = ngelem(elem[0].firstElementChild)
      ; const fileTemplate = ngelem(elem[0].lastElementChild)
      ; const parts = attr.dsFileNav.split(/\s+/)
      ; const varname = parts[0]
      ; const tree = parts[2]
      ; if (scope._wrapperScope) scope._wrapperScope.$destroy()
      ; scope._wrapperScope = scope.$new()
      ; scope.$watch(tree, function(value)
          { elem.html('')
          ; const populate = (parent, items) =>
              { for (const i in items)
                  { const item = items[i]
                  ; if (item.name === '~index') continue
                  ; const newScope = scope._wrapperScope.$new()
                  ; if (Object.keys(item).length === 1) // sublist
                      { const sublist = ngelem(document.createElement(elem[0].tagName))
                      ; const heading = headingTemplate.clone(true)
                      ; const headingText = Object.keys(item)[0]
                      ; sublist.append(heading)
                      ; parent.append(sublist)
                      ; const subitems = item[headingText]
                      ; const indexes = subitems.filter((x) => x.name === '~index')
                      ; if (indexes.length > 0)
                          { newScope[varname] = indexes[0]
                          ; heading.data('path', indexes[0].path)
                          }
                        else newScope[varname] = {}
                      ; newScope[varname].text = headingText
                      ; $compile(heading)(newScope)
                      ; populate(sublist, subitems)
                      }
                    else // file
                      { const file = fileTemplate.clone(true)
                      ; parent.append(file)
                      ; newScope[varname] = item
                      ; file.data('path', item.path)
                      ; $compile(file)(newScope)
                      }
                  }
              }
          ; populate(elem, value)
          })
      ; elem.bind('click', function(evt)
          { const elem = ngelem(evt.target)
          ; const path = elem.data('path')
          ; if (path) scope.$apply(function() { scope.changePathTo(path) })
          })
      }

; fileNavDirective.$inject = ['$compile']
