; var mainModule = null
; if (typeof process === 'undefined')
  { mainModule = 'app/start_browser'
  }
  else if (process.versions['node-webkit'])
  { mainModule = 'app/start_nw'
  }
  else if (process.versions.node)
  { mainModule = 'app/start_node'
  }
  else
  { throw new Error('Not able to start.')
  }

; var inNodeJs = typeof process !== 'undefined' && process.versions.node

; requirejs.config
    ( { baseUrl: 'js/lib'
      , paths:
          { app: '../app'
          }
      , hm: {}
      , urlArgs: 'bust=' + new Date().getTime()
      , shim:
          { angular:
              { exports: 'angular'
              }
          }
      , nodeRequire: inNodeJs ? require : undefined
      }
    )

; requirejs
    ( ['angular', mainModule]
    , function(angular)
      { angular.bootstrap(document, ['BrowseModule'])
      }
    )
