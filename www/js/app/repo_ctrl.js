define(function()

{ var RepoCtrl = function($scope, createRepoObj)
  { $scope.repo = {}
  ; $scope.newRepoId = null
  ; $scope.newRepoRef = null
  ; $scope.changeRepo = function()
    { if ($scope.repo.id == $scope.newRepoId)
      { $scope.repo.ref = $scope.newRepoRef
      }
      else
      { $scope.repo = createRepoObj($scope.newRepoId)
      ; $scope.repo.then
          ( function(repo)
            { $scope.newRepoRef = repo.ref
            }
          , function(err)
            { // TODO handle error
            ; console.log('err', err)
            }
          )
      }
    }
  }

; RepoCtrl.$inject = ['$scope', 'createRepoObj']
; return RepoCtrl

});
