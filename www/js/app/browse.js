define
  ( [ 'angular'
    , './browse/repo_controller'
    , './browse/file_controller'
    , './browse/repo_type/github'
    , './browse/repo_type/http'
    , './browse/service/create_repo'
    , './browse/service/manifest_parser'
    ]
  , function
      ( angular
      , RepoController
      , FileController
      , githubRepoType
      , httpRepoType
      , createRepoService
      , manifestParser
      )

{ var browse = angular.module('BrowseModule', [])
  . controller('RepoController', RepoController)
  . controller('FileController', FileController)
  . factory('githubRepo', githubRepoType)
  . factory('httpRepo', httpRepoType)
  . factory('createRepoObj', createRepoService)
  . value('manifestParser', manifestParser)

; return browse

});
