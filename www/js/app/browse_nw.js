; import browse from 'browse.js'
; import gitRepoType from 'browse/repo_type/git.js'
; import fileRepoType from 'browse/repo_type/file.js'
; import spawnCaptureService from 'browse/service/spawn_capture.js'

; browse
    .factory('gitRepo', gitRepoType)
    .factory('fileRepo', fileRepoType)
    .factory('spawnCapture', spawnCaptureService)

; export browse from 'browse.js'
