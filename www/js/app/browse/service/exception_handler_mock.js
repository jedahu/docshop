; export const exceptionHandlerMockService = () =>
    (err, cause) => {if (ehCallback) ehCallback(err, cause)}

; export var ehCallback = null

; export const setEhCallback = (fn) => {ehCallback = fn}
