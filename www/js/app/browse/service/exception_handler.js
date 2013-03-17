; export const exceptionHandlerService = ($log, alert) =>
    (err, cause) =>
      { $log.error('ERR:', err, cause)
      ; if (err.type && err.type.startsWith('ds-'))
          { alert.addError(err, cause)
          }
        else
          { alert.addError
              ( { error: err
                , message: 'Unknown error.'
                , type: 'ds-undefined'
                }
              , cause
              )
          }
      }

; exceptionHandlerService.$inject = ['$log', 'alert']
