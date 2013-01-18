/* !meta
title: File repository constructor
author: Jeremy Hughes <jedahu@gmail.com>
*/
define(function()

/*
A service that constructs a repository object for reading files from a local
directory. This is useful for checking out how some documentation renders
without having to check it in to one of Docshop's supported SCMs.
*/

{ var fs = require('fs' + '')

/*
The service requires the `$q` and `$rootScope` services from AngularJs and
`parseManifest` from Docshop. The `$rootScope` service is used only to trigger a digest after resolving a deferred object.
*/
; var fileRepoService = function($q, $rootScope, parseManifest)
  { return function fileRepo(repoId)
    { var repoPath = repoId.substr('file:'.length)
        , deferredRepo = $q.defer()
        , repo =
            { id: repoId
            , url: repoPath
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
