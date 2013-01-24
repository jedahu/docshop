; var globalObj =
          typeof window !== 'undefined' && window
        ||typeof global !== 'undefined' && global

; var mainModule = null
; if (typeof process === 'undefined')
  { mainModule = 'start_browser'
  }
  else if (process.versions['node-webkit'])
  { mainModule = 'start_nw'
  }
  else
  { throw new Error('Not able to start.')
  }

; var inNodeWebkit = typeof process !== 'undefined' && process.versions['node-webkit']

; globalObj.inNodeWebkit = inNodeWebkit

; var rconfig =
    { baseUrl: 'js/app'
    , paths:
        { lib: '../lib'
        }
    , urlArgs: 'bust=' + new Date().getTime()
    , shim:
        { 'lib/angular':
            { exports: 'angular'
            , deps: ['lib/jquery']
            }
        , 'lib/select2':
            { deps: ['lib/jquery', 'lib/jquery-ui']
            }
        , 'lib/angular-ui':
            { deps: ['lib/angular', 'lib/select2', 'lib/bootstrap-modal']
            }
        , 'lib/angular-sanitize':
            { deps: ['lib/angular']
            }
        , 'lib/js-yaml':
            { exports: 'jsyaml'
            }
        , 'lib/bootstrap-modal':
            { deps: ['lib/jquery']
            }
        }
    , nodeRequire: inNodeWebkit ? require : undefined
    }

; if (!inNodeWebkit)
  { rconfig.paths['stream'] = '../lib/stream'
  ; rconfig.paths['buffer'] = '../lib/buffer'
  }

; if (globalObj._docshop_runTests)
  { rconfig.shim['test/mocha'] =
      { init: function()
        { this.mocha.ui('bdd')
        ; return this.mocha
        }
      }
  ; rconfig.shim['test/sinon'] =
      { exports: 'sinon'
      }
  ; rconfig.paths['test'] = '../test'
  ; requirejs.config(rconfig)
  ; requirejs
      ( ['test/mocha' + '']
      , function(mocha)
        { requirejs
            ( ['test/all' + '']
            , function(_all)
              { mocha.run()
              }
            )
        }
      )
  }
  else
  { requirejs.config(rconfig)
  ; requirejs
      ( [mainModule]
      , function(_)
        { globalObj['angular'].bootstrap(document, ['BrowseModule'])
        }
      )
}
