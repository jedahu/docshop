/* !meta
title: File repository constructor
author: Jeremy Hughes <jedahu@gmail.com>
*/

/*
A service that constructs a repository object for reading files from a local
directory. This is useful for checking out how some documentation renders
without having to check it in to one of Docshop's supported SCMs.
*/

; const fs = require('fs' + '')

/*
The service requires the `$q` and `$rootScope` services from AngularJs and
`parseManifest` from Docshop. The `$rootScope` service is used only to trigger a digest after resolving a deferred object.
*/
; export const fileRepoType = ($q, $rootScope, parseManifest) =>
    (repoId) =>
      { const repoPath = repoId.substr('file:'.length)
      ; const deferredRepo = $q.defer()
      ; const repo =
          { id: repoId
          , url: repoPath
          , tags: null
          , branches: null
          , refs: null
          , ref: 'master'
          , name: repoPath
          , readFile: (path) =>
              { const deferred = $q.defer()
              ; fs.readFile
                  ( repoPath + path
                  , 'utf8'
                  , (err, data) =>
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
          , (err, data) =>
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

; fileRepoType.$inject = ['$q', '$rootScope', 'parseManifest']
