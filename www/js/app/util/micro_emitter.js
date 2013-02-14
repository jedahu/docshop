; export const microEmitter =
    { on: function (channel, fn)
      { var events = this._events = this._events || {}
          , i
      ; if (channel.constructor === Array)
        { for (i in channel)
          { (events[channel[i]] = events[channel[i]] || []).push(fn)
          }
        }
        else
        { (events[channel] = events[channel] || []).push(fn)
        }
      ; return this
      }

    , onAll: function (fn)
      { var allChannel = this._allChannel = this._allChannel || []
      ; allChannel.push(fn)
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

    , offAll: function (fn)
      { var allChannel, i
      ; if (!fn)
          { delete this._events
          ; delete this._allChannel
          ; return this
          }
      ; allChannel = this._allChannel = this._allChannel || []
      ; i = allChannel.length
      ; while (i--)
        { if (allChannel[i] === fn)
          { allChannel.splice(i, 1)
          }
        }
      ; return this
      }

    , emit: function(channel /* , args... */)
      { var events = this._events = this._events || {}
          , channelFns = (events[channel] || []).concat(this._allChannel || [])
          , fn
      ; while (fn = channelFns.pop())
        { fn.apply(this, arguments)
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

    }
