; export const createRepoService = ($injector, $q) =>
    (repoId, repoRef) =>
      { const repoTypeMatch = repoId.match(/.+?(?=:)/)
      ; const repoType = repoTypeMatch && repoTypeMatch[0]
      ; const createRepoOfType = $injector.get(repoType + 'Repo')
      ; if (createRepoOfType) return createRepoOfType(repoId, repoRef)
      ; throw new Error('No such repository type: ' + repoType)
      }

; createRepoService.$inject = ['$injector', '$q']
