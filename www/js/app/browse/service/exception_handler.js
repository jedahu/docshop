; export const exceptionHandlerService = ($log) =>
    (err, cause) => $log.error('ERR:', err, cause)

; exceptionHandlerService.$inject = ['$log']
