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
            ( ([info, tags, branches]) =>
                { for (let t of tags.data.data) repo.tags.push(t.name)
                ; repo.tags.sort()
                ; for (let b of branches.data.data) repo.branches.push(b.name)
                ; repo.branches.sort()
                ; repo.name = info.data.data.name
                ; repo.ref = repoRef || info.data.data.master_branch
                ; repo.refs = repo.branches.concat(repo.tags)
                ; getFile('doc_manifest')
                    .success((ret) =>
                        { if (ret.meta.status === 401)
                            { deferred.reject(
                                { type: 'auth-error'
                                , message: ret.data.message
                                    + '. Click to check your github token'
                                    + ' settings.'
                                , action: 'show-settings'
                                })
                            ; return
                            }
                        ; if (ret.meta.status !== 200)
                            { deferred.reject(
                                { type: 'repo-error'
                                , message: ret.data.message
                                })
                            ; return
                            }
                        ; const text = ret.data.content.replace(/\n/g, '')
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
