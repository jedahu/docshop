; const API_PREFIX = 'https://api.github.com/'

; export const githubRepoType = ($q, $http, parseManifest) =>
    (repoId, repoRef) =>
      { const id = repoId.substr('github:'.length)
      ; const deferred = $q.defer()
      ; const getFile = (path) => $http.jsonp
          ( API_PREFIX + 'repos/' + id + '/contents/' + path
              + '?access_token=' + (localStorage.githubOauthToken || '')
              + '&callback=JSON_CALLBACK'
          , { params: {ref: repoRef}
            }
          )
      ; const repo =
          { id: repoId
          , githubId: id
          , ref: repoRef
          , tags: []
          , branches: []
          , readFile: function(path)
              { return getFile(path).then((ret) =>
                  { return atob(ret.data.data.content.replace(/\n/g, ''))
                  })
              }
          }
      ; $q
          .all
            ( [ $http.jsonp(API_PREFIX + 'repos/' + id
                  + '?callback=JSON_CALLBACK')
              , $http.jsonp(API_PREFIX + 'repos/' + id + '/tags'
                  + '?callback=JSON_CALLBACK')
              , $http.jsonp(API_PREFIX + 'repos/' + id + '/branches'
                  + '?callback=JSON_CALLBACK')
              ]
            )
          .then
            ( (list) =>
                { const data0 = list[0].data
                ; const data1 = list[1].data
                ; const data2 = list[2].data
                ; for (let i in data1) repo.tags.push(data1[i].name)
                ; repo.tags.sort()
                ; for (let i in data2) repo.branches.push(data2[i].name)
                ; repo.branches.sort()
                ; repo.name = data0.name
                ; repo.ref = repoRef || data0.master_branch
                ; repo.refs = repo.branches.concat(repo.tags)
                ; getFile('doc_manifest')
                    .success((ret) =>
                        { const text = ret.data.content.replace(/\n/g, '')
                        ; repo.manifest = parseManifest(atob(text))
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
