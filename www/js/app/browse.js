; import bindNodeDirective from 'browse/directive/bind_node.js'
; import createRepoService from 'browse/service/create_repo.js'
; import exceptionHandlerService from 'browse/service/exception_handler.js'
; import fileNavDirective from 'browse/directive/file_nav.js'
; import manifestParserService from 'browse/service/manifest_parser.js'
; import nextTickService from 'browse/service/next_tick.js'
; import parseMetaService from 'browse/service/parse_meta.js'
; import parseRenderSrcService from 'browse/service/parse_render_src.js'
; import readFileService from 'browse/service/read_file.js'
; import scrollToHashService from 'browse/service/scroll_to_hash.js'
; import srcParserService from 'browse/service/src_parser.js'
; import tickService from 'browse/service/tick.js'
; import httpRepoType from 'browse/repo_type/http.js'
; import githubRepoType from 'browse/repo_type/github.js'
; import repoController from 'browse/repo_controller.js'
; import {alertController, alertService} from 'browse/alert_controller.js'
; import markdownRenderer from 'browse/renderer/markdown.js'
; import textRenderer from 'browse/renderer/text.js'

; export const browse = angular.module('BrowseModule', ['ngSanitize', 'ui.directives', 'ui.bootstrap'])
    .controller('RepoController', repoController)
    .controller('AlertController', alertController)
    .factory('githubRepo', githubRepoType)
    .factory('httpRepo', httpRepoType)
    .factory('alert', alertService)
    .factory('createRepoObj', createRepoService)
    .factory('parseManifest', manifestParserService)
    .factory('parseMeta', parseMetaService)
    .factory('parseRenderSrc', parseRenderSrcService)
    .factory('scrollToHash', scrollToHashService)
    .factory('tick', tickService)
    .factory('nextTick', nextTickService)
    .factory('srcParser', srcParserService)
    .factory('readFile', readFileService)
    .factory('$exceptionHandler', exceptionHandlerService)
    .factory('markdownRenderer', markdownRenderer)
    .factory('textRenderer', textRenderer)
    .directive('dsFileNav', fileNavDirective)
    .directive('dsBindNode', bindNodeDirective)
    .config(['$locationProvider', function($locationProvider)
        { $locationProvider.hashPrefix('!')
        }])
