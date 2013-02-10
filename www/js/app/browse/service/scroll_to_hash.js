; export const scrollToHashService = ($location, $rootScope) =>
    (id) =>
      { const elem = document.getElementById(id)
      ; $location.hash(id)
      ; $rootScope.$evalAsync(() => {elem && elem.scrollIntoView()})
      }

; scrollToHashService.$inject = ['$location', '$rootScope']
