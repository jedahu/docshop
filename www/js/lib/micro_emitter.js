define(

{ on: function (channel, fn)
  { var events = this._events = this._events || {}
  ; (events[channel] = events[channel] || []).push(fn)
  ; return this
  }

, off: function (channel, fn)
  { var events = this._events = this._events || {}
      , channelFns = events[channel] || []
      , i = channelFns.length
  ; while (i--)
    { if (channelFns[i] === fn)
      { channelFns.splice(i, 1)
      }
    }
  ; return this
  }

, emit: function(channel /* , args... */)
  { var events = this._events = this._events || {}
      , channelFns = (events[channel] || []).slice()
      , fn
  ; while (fn = channelFns.pop())
    { fn.apply(this, [].slice.call(arguments, 1))
    }
  ; return this
  }

, mixin: function(obj)
  { Object.defineProperties
      ( obj
      , { on: {value: this.on}
        , off: {value: this.off}
        , emit: {value: this.emit}
        }
      )
  }

});
