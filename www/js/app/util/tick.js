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

});
