define(function()

{ var cp = require('child_process' + '')
; var gitRepoService = function($q, spawnCapture, parseManifest)
  { return function gitRepo(repoId)
    { var repoPath = repoId.substr('git:'.length)
        , repo =
            { id: repoId
            , tags: []
            , branches: []
            , name: repoPath
            , readFile: function(path)
              { return spawnCapture
                  ( 'git'
                  , ['show', this.ref + ':' + path]
                  , {cwd: repoPath}
                  )
              }
            }
    ; return spawnCapture('git', ['branch', '--list'], {cwd: repoPath})
      . then
        ( function(branchesStr)
          { branchesStr.split('\n').forEach
              ( function(str)
                { var branch = str.slice(1).trim()
                ; if (branch == '') return
                ; if (str[0] == '*')
                  { repo.ref = branch
                  }
                ; repo.branches.push(branch)
                }
              )
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
          ; repo.refs = repo.branches.concat(repo.tags)
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
          { repo.manifest = parseManifest(manifestStr)
          ; return repo
          }
        )
    }
  }

; gitRepoService.$inject = ['$q', 'spawnCapture', 'parseManifest']
; return gitRepoService

});
