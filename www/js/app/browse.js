; import fileNavDirective from 'browse/directive/file_nav.js'
; import bindNodeDirective from 'browse/directive/bind_node.js'
; import scrollToHashService from 'browse/service/scroll_to_hash.js'
; import parseRenderSrcService from 'browse/service/parse_render_src.js'
; import manifestParserService from 'browse/service/manifest_parser.js'
; import tickService from 'browse/service/tick.js'
; import srcParserService from 'browse/service/src_parser.js'
; import createRepoService from 'browse/service/create_repo.js'
; import exceptionHandlerService from 'browse/service/exception_handler.js'
; import httpRepoType from 'browse/repo_type/http.js'
; import githubRepoType from 'browse/repo_type/github.js'
; import repoController from 'browse/repo_controller.js'

; export const browse = angular.module('BrowseModule', ['ngSanitize', 'ui.directives'])
    .controller('RepoController', repoController)
    .factory('githubRepo', githubRepoType)
    .factory('httpRepo', httpRepoType)
    .factory('createRepoObj', createRepoService)
    .factory('parseManifest', manifestParserService)
    .factory('parseRenderSrc', parseRenderSrcService)
    .factory('scrollToHash', scrollToHashService)
    .factory('tick', tickService)
    .factory('srcParser', srcParserService)
    .factory('$exceptionHandler', exceptionHandlerService)
    .directive('dsFileNav', fileNavDirective)
    .directive('dsBindNode', bindNodeDirective)
    .config(['$locationProvider', function($locationProvider)
        { $locationProvider.hashPrefix('!')
        }])
