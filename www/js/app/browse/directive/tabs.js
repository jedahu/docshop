define(function()

{ var tabsDirective = function()
  { return function tabs(scope, elem, attr)
    { console.log(scope.$eval(attr.dsTabs));elem.tabs(scope.$eval(attr.dsTabs))
    }
  }

; return tabsDirective

});
