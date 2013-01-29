; const API_PREFIX = 'https://api.github.com/'

; export const githubRepoType = ($q, $http, parseManifest) =>
    (repoId) =>
      { const id = repoId.substr('github:'.length)
      ; const deferred = $q.defer()
      ; const repo =
          { id: id
          , tags: []
          , branches: []
          }
      ; $q
          .all
            ( [ $http.get(API_PREFIX + 'repos/' + id)
              , $http.get(API_PREFIX + 'repos/' + id + '/tags')
              , $http.get(API_PREFIX + 'repos/' + id + '/branches')
              ]
            )
          .then
            ( (list) =>
                { const data0 = list[0].data
                ; const data1 = list[1].data
                ; const data2 = list[2].data
                ; console.log('args', arguments)
                ; for (let i in data1) repo.tags.push(data1[i].name)
                ; repo.tags.sort()
                ; for (let i in data2) repo.branches.push(data2[i].name)
                ; repo.branches.sort()
                ; repo.name = data0.name
                ; repo.ref = data0.master_branch
                ; repo.refs = repo.branches.concat(repo.tags)
                ; $http
                    ( { method: 'GET'
                      , url: API_PREFIX + 'repos/' + id +
                          '/contents/doc_manifest'
                      , params: {ref: repo.ref}
                      }
                    )
                    .success((data) =>
                        { repo.manifest = parseManifest(data.content)
                        ; deferred.resolve(repo)
                        })
                    .error((err) =>
                        { deferred.reject(err)
                        })
                }
            , (err) =>
                { deferred.reject(err)
                }
            )
      ; return deferred.promise
      }

; githubRepoType.$inject = ['$q', '$http', 'parseManifest']
