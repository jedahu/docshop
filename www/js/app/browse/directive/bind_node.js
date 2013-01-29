; export const bindNodeDirective = () =>
    (scope, elem, attr) =>
      scope.$watch(attr.dsBindNode, (value) =>
        { elem.html('')
        ; if (value) elem.append(value)
        })
