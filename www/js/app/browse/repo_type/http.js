; export const httpRepoType = ($q, $http, parseManifest) =>
    (repoId) =>
      { const deferred = $q.defer()
      ; const repo =
          { id: repoId
          , tags: []
          , branches: []
          , refs: []
          , ref: null
          , name: repoId
          }
      ; $http
          ( { method: 'GET'
            , url: repoId + 'doc_manifest'
            , transformResponse: (x) => x
            }
          )
          .success((data) =>
            { repo.manifest = parseManfiest(data)
            ; deferred.resolve(repo)
            })
          .error((err) =>
            { deferred.reject(err)
            })
      ; return deferred.promise
      }

; httpRepoType.$inject = ['$q', '$http', 'parseManifest']
