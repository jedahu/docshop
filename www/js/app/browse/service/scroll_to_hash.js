define(function()

{ var scrollToHashService = function($location)
  { return scrollToHash = function(id)
    { var elem = document.getElementById(id)
    ; elem.scrollIntoView()
    }
  }

; scrollToHashService.$inject = ['$location']
; return scrollToHashService

});
