define
  ( [ 'lib/angular'
    , 'lib/angular-sanitize'
    , 'lib/angular-ui'
    , 'es6!browse/repo_controller'
    , 'es6!browse/repo_type/github'
    , 'es6!browse/repo_type/http'
    , 'es6!browse/service/create_repo'
    , 'es6!browse/service/manifest_parser'
    , 'es6!browse/service/parse_render_src'
    , 'es6!browse/service/scroll_to_hash'
    , 'es6!browse/directive/file_nav'
    , 'es6!browse/directive/bind_node'
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
