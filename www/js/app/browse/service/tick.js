; export const tickService = ($q, nextTick) =>
    { const forEach = (list, fn, cb, eb) =>
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

    ; const recurseWhile = (test, fn, finish, ...args) =>
        { const finish = finish || $q.defer()
        ; const eb = (err) => {finish.reject(err)}
        ; if (test())
            { let sync = true
            ; const next = (...args) =>
                { if (sync)
                    { nextTick(() =>
                        { recurseWhile(test, fn, finish, ...args)
                        })
                    }
                  else
                    { recurseWhile(test, fn, finish, ...args)
                    }
                }
            ; fn(next, eb, ...args)
            ; sync = false
            }
          else
            { finish.resolve(args)
            }
        ; return finish.promise
        }

    ; return {forEach, loop, recurseWhile}
    }

tickService.$inject = ['$q', 'nextTick']
