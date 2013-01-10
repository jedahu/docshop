define(function()

{ var service = function($q, $http, parseManifest)
  { return function(repoId)
    { var repo = {}
        , deferred = $q.defer()
    ; Object.defineProperties
        ( repo
        , { id: {value: repoId}
          , tags: {value: []}
          , branches: {value: []}
          , refs: {value: []}
          , ref: {value: 'N/A'}
          , name: {value: repoId}
          }
        )
    ; $http
        ( { method: 'GET'
          , url: repoId + 'doc_manifest'
          , transformResponse: function(x) { return x }
          }
        )
      . success
        ( function(data)
          { Object.defineProperties
              ( repo
              , { manifest: {value: parseManifest(data)}
                }
              )
          ; console.log(repo)
          ; deferred.resolve(repo)
          }
        )
      . error
        ( function(err)
          { deferred.reject(err)
          }
        )
    ; return deferred.promise
    }
  }

; service.$inject = ['$q', '$http', 'parseManifest']
; return service

});
