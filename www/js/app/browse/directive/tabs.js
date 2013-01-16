define(function()

{ var tabsDirective = function()
  { return function tabs(scope, elem, attr)
    { elem.tabs(scope.$eval(attr.dsTabs))
    }
  }

; return tabsDirective

});
