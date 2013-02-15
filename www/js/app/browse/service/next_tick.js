; export const nextTickService = ($rootScope) =>
    (fn) => $rootScope.$evalAsync(fn)

; nextTickService.$inject = ['$rootScope']


