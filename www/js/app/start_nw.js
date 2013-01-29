//define
//  ( [ 'browse'
//    , 'browse/repo_type/git'
//    , 'browse/repo_type/file'
//    , 'browse/service/spawn_capture'
//    ]
//  , function(browse, gitRepoType, fileRepoType, spawnCaptureService)
; import browse from 'browse.js'
; import gitRepoType from 'browse/repo_type/git.js'
; import fileRepoType from 'browse/repo_type/file.js'
; import spawnCaptureService from 'browse/service/spawn_capture.js'

; browse
    .factory('gitRepo', gitRepoType)
    .factory('fileRepo', fileRepoType)
    .factory('spawnCapture', spawnCaptureService)

; angular.bootstrap(document, ['BrowseModule'])
