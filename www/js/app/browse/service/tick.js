; export const tickService = ($q, $rootScope) =>
    { const nextTick = typeof process !== 'undefined'
        && process.nextTick
        || (fn) => {setTimeout(fn, 0)}

    ; const forEach = (list, fn, cb, eb) =>
        { let i = 0
        ; const next = () =>
            { if (i === list.length) cb()
              else nextTick(() => fn(list[i++], next, eb))
            }
        ; next()
        }

    ; const loop = (init, test, incr, fn, cb, eb) =>
        { const next = (val) =>
            { init = typeof val === 'undefined' || val === null ? incr(init) : val
            ; if (test(init))
                { nextTick(() => fn(init, next, eb))
                }
              else cb(init)
            }
        ; next(init)
        }

    ; const doWhile = (test, fn) =>
        { const final = $q.defer()
        ; const eb = (err) =>
            { final.reject(err)
            ; $rootScope.$apply()
            }
        ; const next = (...args) =>
            { if (test()) fn(next, eb, ...args)
              else
                { final.resolve(args)
                ; $rootScope.$apply()
                }
            }
        ; next()
        ; return final.promise
        }

    ; const doWhileTick = (test, fn) =>
        doWhile(test, (...args) => nextTick(() => fn(...args)))

    ; return {nextTick, forEach, loop, doWhile, doWhileTick}
    }

tickService.$inject = ['$q', '$rootScope']
