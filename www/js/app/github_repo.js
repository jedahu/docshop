define(['./manifest_parser'], function(mp)

{ var API_PREFIX = 'https://api.github.com/'

; var createRepo = function($q, $http, repoId)
  { var id = repoId.substr('github:'.length)
      , repo = {}
      , deferred = $q.defer()
  ; Object.defineProperties
      ( repo
      , { id: {value: id}
        , tags: {value: []}
        , branches: {value: []}
        }
      )
  ; $q
    . all
      ( [ $http.get(API_PREFIX + 'repos/' + id)
        , $http.get(API_PREFIX + 'repos/' + id + '/tags')
        , $http.get(API_PREFIX + 'repos/' + id + '/branches')
        ]
      )
    . then
      ( function(list)
        { var data0 = list[0].data
            , data1 = list[1].data
            , data2 = list[2].data
            , i = null
        ; console.log('args', arguments)
        ; for (i in data1) repo.tags.push(data1[i].name)
        ; repo.tags.sort()
        ; Object.freeze(repo.tags)
        ; for (i in data2) repo.branches.push(data2[i].name)
        ; repo.branches.sort()
        ; Object.freeze(repo.branches)
        ; Object.defineProperties
            ( repo
            , { name: {value: data0.name}
              , ref: {value: data0.master_branch}
              , refs: {value: repo.branches.concat(repo.tags)}
              }
            )
        ; Object.freeze(repo.refs)
        ; $http
            ( { method: 'GET'
              , url: API_PREFIX + 'repos/' + id +
                  '/contents/doc_manifest'
              , params: {ref: repo.ref}
              }
            )
          . success
            ( function(data)
              { Object.defineProperties
                  ( repo
                  , { manifest: {value: mp.parse(data.content)} }
                  )
              ; deferred.resolve(repo)
              }
            )
          . error
            ( function(err)
              { deferred.reject(err)
              }
            )
        }
      , function(err)
        { deferred.reject(err)
        }
      )
  ; return deferred.promise
  }

; var service = function($q, $http)
    { return createRepo.bind(null, $q, $http)
    }
; service.$inject = ['$q', '$http']
; return service

});
