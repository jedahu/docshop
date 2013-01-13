define(

{ nextTick: typeof process !== 'undefined'
    && process.nextTick
    || function(fn) { setTimeout(fn, 0) }

, forEach: function(list, fn, cb)
  { var self = this
      , i = 0
      , _cb = function(err)
        { if (err) cb(err)
        ; else if (i === list.length) cb()
        ; else self.nextTick(fn.bind(null, list[i++], _cb))
        }
  ; _cb()
  }

, for: function(init, test, incr, fn, cb)
  { var self = this
      , _cb = function(err, val)
        { init = typeof val === 'undefined' || val === null ? incr(init) : val
        ; console.log('init:', init)
        ; if (err) cb(err)
          else if (test(init))
          { self.nextTick(fn.bind(null, init, _cb))
          }
          else cb(null, init)
        }
  ; _cb(null, init)
  }

});
