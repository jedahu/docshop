define(function()

{ var cp = require('child_process' + '')

; var spawnCaptureService = function($q, $rootScope)
  { return function spawnCapture(cmd, args, opts)
    { var outStr = ''
        , errStr = ''
        , proc = cp.spawn(cmd, args, opts)
        , deferred = $q.defer()
        , done = false
    ; proc.stdout.setEncoding('utf8')
    ; proc.stderr.setEncoding('utf8')
    ; proc.stdout.on('data', function(data) { outStr += data })
    ; proc.stderr.on('data', function(data) { errStr += data })
    ; proc.stdout.on
        ( 'end'
        , function()
          { if (!done)
            { deferred.resolve(outStr)
            ; $rootScope.$digest()
            ; done = true
            }
          }
        )
    ; proc.on
        ( 'exit'
        , function(code, _signal)
          { if (code != 0 && !done)
            { deferred.reject({cmdErr: errStr, cmd: cmd, args: args})
            ; $rootScope.$digest()
            ; done = true
            }
          }
        )
    ; return deferred.promise
    }
  }

; spawnCaptureService.$inject = ['$q', '$rootScope']
; return spawnCaptureService

});
