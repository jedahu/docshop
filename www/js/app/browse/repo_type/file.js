define(function()

/*
## File Repo Service
<a id='id:fileRepoService'></a>
A repo service that reads from disk. Useful *when* developing documentation.

# Foobar

## Blag
*/
{ var fs = require('fs' + '')
; var fileRepoService = function($q, $rootScope, parseManifest)
  { return function fileRepo(repoId)
    { var repoPath = repoId.substr('file:'.length)
        , deferredRepo = $q.defer()
        , repo =
            { id: repoId
            , tags: null
            , branches: null
            , refs: null
            , ref: 'master'
            , name: repoPath
            , readFile: function(path)
              { var deferred = $q.defer()
              ; fs.readFile
                  ( repoPath + path
                  , 'utf8'
                  , function(err, data)
                    { if (err) deferred.reject(err)
                      else deferred.resolve(data)
                    ; $rootScope.$digest()
                    }
                  )
              ; return deferred.promise
              }
            }
    ; fs.readFile
        ( repoPath + 'doc_manifest'
        , 'utf8'
        , function(err, data)
          { if (err) deferredRepo.reject(err)
            else
            { repo.manifest = parseManifest(data)
            ; deferredRepo.resolve(repo)
            }
          ; $rootScope.$digest()
          }
        )
    ; return deferredRepo.promise
    }
  }

; fileRepoService.$inject = ['$q', '$rootScope', 'parseManifest']
; return fileRepoService

});
