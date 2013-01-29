; const cp = require('child_process' + '')
; export const gitRepoType = ($q, spawnCapture, parseManifest) =>
    (repoId) =>
      { const repoPath = repoId.substr('git:'.length)
      ; const repo =
          { id: repoId
          , tags: []
          , branches: []
          , name: repoPath
          , readFile: (path) =>
              spawnCapture
                ( 'git'
                , ['show', this.ref + ':' + path]
                , {cwd: repoPath}
                )
          }
      ; return spawnCapture('git', ['branch', '--list'], {cwd: repoPath})
          .then((branchesStr) =>
            { branchesStr.split('\n').forEach((str) =>
                { const branch = str.slice(1).trim()
                ; if (branch == '') return
                ; if (branch == '(no branch)') return
                ; if (str[0] == '*')
                    { repo.ref = branch
                    }
                ; repo.branches.push(branch)
                })
            // FIXME repo.ref must be set to what is in $location and only
            // fall back to the *rred branch if $location is not set.
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
