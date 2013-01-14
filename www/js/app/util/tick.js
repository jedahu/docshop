define(

{ nextTick: typeof process !== 'undefined'
    && process.nextTick
    || function(fn) { setTimeout(fn, 0) }

, forEach: function(list, fn, cb, eb)
  { var self = this
      , i = 0
      , next = function()
        { if (i === list.length) cb()
          else self.nextTick(fn.bind(null, list[i++], next, eb))
        }
  ; next()
  }

, for: function(init, test, incr, fn, cb, eb)
  { var self = this
      , next = function(val)
        { init = typeof val === 'undefined' || val === null ? incr(init) : val
        ; if (test(init))
          { self.nextTick(fn.bind(null, init, next, eb))
          }
          else cb(init)
        }
  ; next(init)
  }

});
