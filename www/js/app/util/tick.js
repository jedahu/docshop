; export const nextTick = typeof process !== 'undefined'
    && process.nextTick
    || (fn) => {setTimeout(fn, 0)}

; export const forEach = (list, fn, cb, eb) =>
    { let i = 0
    ; const next = () =>
        { if (i === list.length) cb()
          else nextTick(() => fn(list[i++], next, eb))
        }
    ; next()
    }

; export const loop = (init, test, incr, fn, cb, eb) =>
    { const next = (val) =>
        { init = typeof val === 'undefined' || val === null ? incr(init) : val
        ; if (test(init))
            { nextTick(() => fn(init, next, eb))
            }
          else cb(init)
        }
    ; next(init)
    }
