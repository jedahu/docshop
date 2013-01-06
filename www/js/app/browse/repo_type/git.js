define(function()

{ var service = function($q, spawnCapture, manifestParser)
  { return function(repoId)
    { var id = repoId.substr('git:'.length)
        , repo = {}
    ; Object.defineProperties
        ( repo
        , { id: {value: id}
          , tags: {value: []}
          , branches: {value: []}
          , name: {value: id}
          }
        )
    ; return spawnCapture('git', ['branch', '--list'], {cwd: id})
      . then
        ( function(branchesStr)
          { branchesStr.split('\n').forEach
              ( function(str)
                { var branch = str.slice(1).trim()
                ; if (branch == '') return
                ; if (str[0] == '*')
                  { Object.defineProperties
                      ( repo
                      , { ref: {value: branch}
                        }
                      )
                  }
                ; repo.branches.push(branch)
                }
              )
          ; Object.freeze(repo.branches)
          ; return spawnCapture('git', ['tag', '--list'], {cwd: id})
          }
        )
      . then
        ( function(tagsStr)
          { tagsStr.split('\n').forEach
            ( function(str)
              { var tag = str.trim()
              ; if (tag != '') repo.tags.push(tag)
              }
            )
          ; Object.freeze(repo.tags)
          ; Object.defineProperties
              ( repo
              , { refs: {value: repo.branches.concat(repo.tags)}
                }
              )
          ; Object.freeze(repo.refs)
          ; return spawnCapture
              ('git'
              , ['show', repo.ref + ':doc_manifest']
              , { cwd: id
                , transformResponse: function(x) { return x }
                }
              )
          }
        )
      . then
        ( function(manifestStr)
          { Object.defineProperties
              ( repo
              , { manifest: {value: manifestParser.parse(manifestStr)}
                }
              )
          ; Object.freeze(repo)
          ; return repo
          }
        )
    }
  }

; service.$inject = ['$q', 'spawnCapture', 'manifestParser']
; return service

});
