define(function()

{ var RepoController = function($scope, createRepoObj, parseRenderSrc)
  { $scope.repo = {}
  ; $scope.newRepoId = null
  ; $scope.newRepoRef = null
  ; $scope.renderedSrc = null

  ; var fileFromPath = function(path)
    { return $scope.repo.then
        ( function(repo)
          { return repo.manifest.fileMap[path]
          }
        )
    }

  ; $scope.changeRepo = function()
    { if ($scope.repo.id == $scope.newRepoId)
      { $scope.repo.ref = $scope.newRepoRef
      }
      else
      { $scope.repo = createRepoObj($scope.newRepoId)
      ; $scope.repo.then
          ( function(repo)
            { $scope.newRepoRef = repo.ref
            ; repo.path = repo.manifest.files[0][1].path
            ; $scope.changePath()
            }
          , function(err)
            { // TODO handle error
            ; console.log('err', err)
            }
          )
      }
    }

  ; $scope.changePath = function()
    { $scope.repo.then
        ( function(repo)
          { $scope.renderedSrc = parseRenderSrc
              ( repo
              , fileFromPath(repo.path)
              )
          }
        )
    }
  }

; RepoController.$inject = ['$scope', 'createRepoObj', 'parseRenderSrc']
; return RepoController

});
