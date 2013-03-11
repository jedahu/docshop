; const cp = require('child_process' + '')
; export const gitRepoType = ($q, spawnCapture, parseManifest) =>
    (repoId, repoRef) =>
      { const repoPath = repoId.substr('git:'.length)
      ; const repo =
          { id: repoId
          , tags: []
          , branches: []
          , ref: repoRef
          , name: repoPath
          , readFile: function(path) {
              return spawnCapture
                ( 'git'
                , ['show', this.ref + ':' + path]
                , {cwd: repoPath}
                )
            }
          }
      ; return spawnCapture('git', ['branch', '--list'], {cwd: repoPath})
          .then((branchesStr) =>
            { branchesStr.split('\n').forEach((str) =>
                { const branch = str.slice(1).trim()
                ; if (branch == '') return
                ; if (branch == '(no branch)') return
                ; if (!ref && str[0] == '*')
                    { repo.ref = branch
                    }
                ; repo.branches.push(branch)
                })
            ; if (!repo.ref) repo.ref = repo.branches[0]
            ; return spawnCapture('git', ['tag', '--list'], {cwd: repoPath})
            })
          .then((tagsStr) =>
            { tagsStr.split('\n').forEach((str) =>
                { const tag = str.trim()
                ; if (tag != '') repo.tags.push(tag)
                })
            ; repo.refs = repo.branches.concat(repo.tags)
            ; return spawnCapture
                ( 'git'
                , ['show', repo.ref + ':doc_manifest']
                , { cwd: repoPath
                  , transformResponse: (x) => x
                  }
                )
            })
          .then((manifestStr) =>
            { repo.manifest = parseManifest(manifestStr)
            ; return repo
            })
      }

; gitRepoType.$inject = ['$q', 'spawnCapture', 'parseManifest']
