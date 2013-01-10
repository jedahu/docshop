define(function()

{ var cp = require('child_process')
; var gitRepoService = function($q, spawnCapture, parseManifest)
  { return function gitRepo(repoId)
    { var repoPath = repoId.substr('git:'.length)
        , repo = {}
    ; Object.defineProperties
        ( repo
        , { id: {value: repoId}
          , tags: {value: []}
          , branches: {value: []}
          , name: {value: repoPath}
          , readFile:
            { value: function(path)
              { return spawnCapture
                  ( 'git'
                  , ['show', this.ref + ':' + path]
                  , {cwd: repoPath}
                  )
              }
            }
          }
        )
    ; return spawnCapture('git', ['branch', '--list'], {cwd: repoPath})
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
          ; return spawnCapture('git', ['tag', '--list'], {cwd: repoPath})
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
              , { cwd: repoPath
                , transformResponse: function(x) { return x }
                }
              )
          }
        )
      . then
        ( function(manifestStr)
          { Object.defineProperties
              ( repo
              , { manifest: {value: parseManifest(manifestStr)}
                }
              )
          ; return repo
          }
        )
    }
  }

; gitRepoService.$inject = ['$q', 'spawnCapture', 'parseManifest']
; return gitRepoService

});
