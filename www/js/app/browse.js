define
  ( [ 'lib/angular'
    , 'lib/angular-sanitize'
    , 'lib/angular-ui'
    , 'browse/repo_controller'
    , 'browse/repo_type/github'
    , 'browse/repo_type/http'
    , 'browse/service/create_repo'
    , 'browse/service/manifest_parser'
    , 'browse/service/parse_render_src'
    , 'browse/service/scroll_to_hash'
    , 'browse/directive/file_nav'
    , 'browse/directive/bind_node'
    ]
  , function
      ( angular
      , _sanitize
      , _ui
      , RepoController
      , githubRepoType
      , httpRepoType
      , createRepoService
      , manifestParser
      , parseRenderSrcService
      , scrollToHashService
      , fileNavDirective
      , bindNodeDirective
      )

{ var browse = globalObj['angular'].module('BrowseModule', ['ngSanitize', 'ui.directives'])
  . controller('RepoController', RepoController)
  . factory('githubRepo', githubRepoType)
  . factory('httpRepo', httpRepoType)
  . factory('createRepoObj', createRepoService)
  . value('parseManifest', manifestParser.service())
  . factory('parseRenderSrc', parseRenderSrcService)
  . factory('scrollToHash', scrollToHashService)
  . directive('dsFileNav', fileNavDirective)
  . directive('dsBindNode', bindNodeDirective)
  . config(['$locationProvider', function($locationProvider)
      { $locationProvider.hashPrefix('!')
      }])

; return browse

});
