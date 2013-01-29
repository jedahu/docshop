//define(['util/tick'], function(tick)
; import nextTick from '../../util/tick.js'

; export const scrollToHashService = ($location) =>
    (id) =>
      { const elem = document.getElementById(id)
      ; $location.hash(id)
      ; nextTick(() => {elem && elem.scrollIntoView()})
      }

; scrollToHashService.$inject = ['$location']
