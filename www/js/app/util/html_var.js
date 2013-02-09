/* !meta
title: HTML Variable
author: Jeremy Hughes <jedahu@gmail.com>
*/

/*
Sometimes things just need to be stored in the DOM. This module provides a
memoized function for accessing these DOM equivalents of constant variables.
*/

/* !name htmlVar (id) => object
The function, `htmlVar`, returns the attributes of the HTML element identified
by `id` as a plain key-value object. The element is deleted.
*/
; export const htmlVar = (name) =>
    { if (cache[name]) return cache[name]
    ; const elem = document.getElementById(name)
    ; if (!elem) return null
    ; const attrs = elem.attributes
    ; const map = {}
    ; for (let i = 0; i < attrs.length; ++i)
        { const attr = attrs[i]
        ; map[attr.name] = attr.value
        }
    ; cache[name] = map
    ; elem.remove()
    ; return map
    }

; const cache = {}
