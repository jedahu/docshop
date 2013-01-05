define
  ( [ 'angular'
    , './repo_ctrl'
    , './github_repo'
    , './http_repo'
    , './create_repo_service'
    ]
  , function
      ( angular
      , RepoCtrl
      , FileCtrl
      , githubRepo
      , httpRepo
      , createRepoSrv
      )

{ var browse = angular.module('BrowseModule', [])
  . controller('RepoCtrl', RepoCtrl)
  . factory('githubRepo', githubRepo)
  . factory('httpRepo', httpRepo)
  . factory('createRepoObj', createRepoSrv)

; return browse

});
