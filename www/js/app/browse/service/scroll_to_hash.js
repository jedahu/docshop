define(['es6!util/tick'], function(tick)

{ var scrollToHashService = function($location)
  { return scrollToHash = function(id)
    { var elem = document.getElementById(id)
    ; $location.hash(id)
    ; tick.nextTick(function() {elem && elem.scrollIntoView()})
    }
  }

; scrollToHashService.$inject = ['$location']
; return scrollToHashService

});
