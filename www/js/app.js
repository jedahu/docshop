; var mainModule = null
; if (typeof process === 'undefined')
  { mainModule = 'start_browser'
  }
  else if (process.versions['node-webkit'])
  { mainModule = 'start_nw'
  }
  else if (process.versions.node)
  { mainModule = 'start_node'
  }
  else
  { throw new Error('Not able to start.')
  }

; var inNodeJs = typeof process !== 'undefined' && process.versions.node

; requirejs.config
    ( { baseUrl: 'js/app'
      , paths:
          { lib: '../lib'
          }
      , hm: {}
      , urlArgs: 'bust=' + new Date().getTime()
      , shim:
          { 'lib/angular':
              { exports: 'angular'
              }
          }
      , nodeRequire: inNodeJs ? require : undefined
      }
    )

; requirejs
    ( ['lib/angular', mainModule]
    , function(angular)
      { angular.bootstrap(document, ['BrowseModule'])
      }
    )
