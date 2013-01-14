define(function()

{ var createRepoService = function($injector, $q)
  { return function createRepo(repoId)
    { var repoTypeMatch = repoId.match(/.+?(?=:)/)
        , repoType = repoTypeMatch && repoTypeMatch[0]
        , createRepoOfType = $injector.get(repoType + 'Repo')
        , deferred = $q.defer()
    ; if (createRepoOfType) deferred.resolve(createRepoOfType(repoId))
      else deferred.reject({msg: 'No such repository type: ' + repoType})
    ; return deferred.promise
    }
  }

; createRepoService.$inject = ['$injector', '$q']

; return createRepoService

});
