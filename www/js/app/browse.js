define
  ( [ 'lib/angular'
    , 'lib/angular-sanitize'
    , 'browse/repo_controller'
    , 'browse/repo_type/github'
    , 'browse/repo_type/http'
    , 'browse/service/create_repo'
    , 'browse/service/manifest_parser'
    , 'browse/service/parse_render_src'
    , 'browse/renderer/text'
    , 'browse/directive/file_nav'
    ]
  , function
      ( angular
      , _sanitize
      , RepoController
      , githubRepoType
      , httpRepoType
      , createRepoService
      , manifestParser
      , parseRenderSrcService
      , textRenderService
      , fileNavDirective
      )

{ var browse = angular.module('BrowseModule', ['ngSanitize'])
  . controller('RepoController', RepoController)
  . factory('githubRepo', githubRepoType)
  . factory('httpRepo', httpRepoType)
  . factory('createRepoObj', createRepoService)
  . value('parseManifest', manifestParser.service())
  . factory('parseRenderSrc', parseRenderSrcService)
  . factory('textRender', textRenderService)
  . directive('dsFileNav', fileNavDirective)
  . config(['$locationProvider', function($locationProvider)
      { $locationProvider.hashPrefix('!')
      }])

; return browse

});
