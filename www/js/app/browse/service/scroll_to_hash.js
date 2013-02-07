; export const scrollToHashService = ($location, tick) =>
    (id) =>
      { const elem = document.getElementById(id)
      ; $location.hash(id)
      ; tick.nextTick(() => {elem && elem.scrollIntoView()})
      }

; scrollToHashService.$inject = ['$location', 'tick']
