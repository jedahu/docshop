; export const exceptionHandlerService = ($log, alert) =>
    (err, cause) =>
      { $log.error('ERR:', err, cause)
      ; alert.addError(err, cause)
      }

; exceptionHandlerService.$inject = ['$log', 'alert']
