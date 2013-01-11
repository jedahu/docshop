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
  ; $scope.newRepoId = null
  ; $scope.newRepoRef = null
  ; $scope.renderedSrc = null

  ; var fileFromPath = function(repo, path)
    { return repo.manifest.fileMap[path]
    }

  ; var parseRepoString = function(str)
    { var match = str.match(/([^@]+)(?:@([^:]+):?(.*))?/)
      return {id: match[1], ref: match[2], path: match[3]}
    }

  ; var setPath = function(repo)
    { $location.path(repo.id + '@' + repo.ref + ':' + repo.path)
    }

  ; $scope.changeRepo = function()
    { var query
    ; if (!$scope.newRepoString) return
    ; query = parseRepoString($scope.newRepoString)
    ; $scope.repo = $scope.repo
      . then
        ( function(repo)
          { if (repo && repo.id === query.id) return repo
            return createRepoObj(query.id)
          }
        )
      . then
        ( function(repo)
          { var renderFile = repo.ref !== query.ref
              || repo.path !== query.path
              || !repo.path
          ; repo.ref = query.ref || repo.ref
          ; repo.path = query.path
              || repo.path
              || repo.manifest.files[0].path
          ; if (renderFile) changePath(repo)
          ; return repo
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
          { $scope.renderedSrc = result
          ; document.getElementById('content').innerHTML = ''
          ; document.getElementById('content').appendChild(result.html)
          ; return null
          }
        , function(err)
          { document.getElementById('content').innerHTML = '<b>ERROR</b>'
          }
        )
    ; setPath(repo)
    }

  ; $scope.changePathTo = function(path)
    { $scope.repo.then
        ( function(repo)
          { repo.path = path
          ; changePath(repo)
          }
        )
    }

  ; $scope.$on
      ( '$locationChangeSuccess'
      , function(_new, _old)
        { $scope.newRepoString = $location.path().slice(1)
        ; $scope.changeRepo()
        }
      )

  ; $scope.scrollToHash = scrollToHash
  }

; RepoController.$inject = ['$scope', '$q', '$location', 'createRepoObj', 'parseRenderSrc', 'scrollToHash']
; return RepoController

});
