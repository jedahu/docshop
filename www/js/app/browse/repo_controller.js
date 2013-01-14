define(function()

{ var RepoController = function
    ( $scope
    , $q
    , $location
    , createRepoObj
    , parseRenderSrc
    , scrollToHash
    )
  { var initialRepo = $q.defer()
  ; initialRepo.resolve(null)
  ; $scope.repo = initialRepo.promise
  ; $scope.repoForm = {}
  ; $scope.renderedSrc = null

  ; var fileFromPath = function(repo, path)
    { return repo.manifest.fileMap[path]
    }

  ; var parseRepoString = function(str)
    { var match = str && str.match(/([^@]+)(?:@([^:]+):?(.*))?/)
      return match
        ? {id: match[1], ref: match[2], path: match[3]}
        : null
    }

  ; var setPath = function(repo)
    { $location.path(repo.id + '@' + repo.ref + ':' + repo.path)
    }

  ; $scope.changeRepo = function()
    { $scope.repo = $scope.repo
      . then
        ( function(repo)
          { if (repo && repo.id === $scope.repoForm.id)
            { return repo
            }
            else if ($scope.repoForm)
            { return createRepoObj($scope.repoForm.id)
            }
            else return $q.reject('No repo query')
          }
        )
      . then
        ( function(repo)
          { var renderFile
          ; if (!repo) return $q.reject('No repo produced')
          ; renderFile = repo.ref !== $scope.repoForm.ref
              || repo.path !== $scope.repoForm.path
              || !repo.path
          ; repo.ref = $scope.repoForm.ref || repo.ref
          ; repo.path = $scope.repoForm.path
              || repo.path
              || repo.manifest.files[0].path
          ; if (renderFile) changePath(repo)
          ; return repo
          }
        , function(err)
          { console.log('err:', err) // TODO handle error
          }
        )
    }

  ; var changePath = function(repo)
    { parseRenderSrc
        ( repo
        , fileFromPath(repo, repo.path)
        )
      . then
        ( function(result)
          { var hashElem
          ; $scope.renderedSrc = result
          ; document.getElementById('ds-content').innerHTML = ''
          ; document.getElementById('ds-content').appendChild(result.html)
          ; return $location.hash()
          }
        )
      . then
        ( function(hash)
          { scrollToHash(hash, false)
          }
        , function(err)
          { document.getElementById('ds-content').innerHTML = '<b>ERROR</b>'
          }
        )
    ; setPath(repo)
    }

  ; $scope.changePathTo = function(path)
    { if (!path) return
    ; $scope.repo.then
        ( function(repo)
          { repo.path = path
          ; changePath(repo)
          }
        )
    }

  ; $scope.$on
      ( '$locationChangeSuccess'
      , function(_new, _old)
        { $scope.repoForm = parseRepoString($location.path().slice(1))
        ; $scope.changeRepo()
        }
      )

  ; $scope.scrollToHash = scrollToHash
  }

; RepoController.$inject = ['$scope', '$q', '$location', 'createRepoObj', 'parseRenderSrc', 'scrollToHash']
; return RepoController

});
