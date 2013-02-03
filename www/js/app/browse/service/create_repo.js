; export const createRepoService = ($injector, $q) =>
    (repoId, repoRef) =>
      { const repoTypeMatch = repoId.match(/.+?(?=:)/)
      ; const repoType = repoTypeMatch && repoTypeMatch[0]
      ; const createRepoOfType = $injector.get(repoType + 'Repo')
      ; const deferred = $q.defer()
      ; if (createRepoOfType) deferred.resolve(createRepoOfType(repoId, repoRef))
        else deferred.reject({msg: 'No such repository type: ' + repoType})
      ; return deferred.promise
      }

; createRepoService.$inject = ['$injector', '$q']
