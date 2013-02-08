; const cp = require('child_process' + '')

; export const spawnCaptureService = ($q, $rootScope) =>
    (cmd, args, opts) =>
      { let outStr = ''
      ; let errStr = ''
      ; const proc = cp.spawn(cmd, args, opts)
      ; const deferred = $q.defer()
      ; let done = false
      ; proc.stdout.setEncoding('utf8')
      ; proc.stderr.setEncoding('utf8')
      ; proc.stdout.on('data', (data) => {outStr += data})
      ; proc.stderr.on('data', (data) => {errStr += data})
      ; proc.stdout.on('end', () =>
          { if (!done)
              { deferred.resolve(outStr)
              ; $rootScope.$apply()
              ; done = true
              }
          })
      ; proc.on('exit', (code, _signal) =>
          { if (code != 0 && !done)
              { deferred.reject({cmdErr: errStr, cmd: cmd, args: args})
              ; $rootScope.$apply()
              ; done = true
              }
          })
      ; return deferred.promise
      }

; spawnCaptureService.$inject = ['$q', '$rootScope']
