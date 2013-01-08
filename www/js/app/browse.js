define
  ( [ 'lib/angular'
    , 'lib/angular-sanitize'
    , 'browse/repo_controller'
    , 'browse/file_controller'
    , 'browse/repo_type/github'
    , 'browse/repo_type/http'
    , 'browse/service/create_repo'
    , 'browse/service/manifest_parser'
    , 'browse/service/parse_render_src'
    , 'browse/renderer/text'
    ]
  , function
      ( angular
      , _sanitize
      , RepoController
      , FileController
      , githubRepoType
      , httpRepoType
      , createRepoService
      , manifestParser
      , parseRenderSrcService
      , textRenderService
      )

{ var browse = angular.module('BrowseModule', ['ngSanitize'])
  . controller('RepoController', RepoController)
  . controller('FileController', FileController)
  . factory('githubRepo', githubRepoType)
  . factory('httpRepo', httpRepoType)
  . factory('createRepoObj', createRepoService)
  . value('manifestParser', manifestParser)
  . factory('parseRenderSrc', parseRenderSrcService)
  . factory('textRender', textRenderService)

; return browse

});
