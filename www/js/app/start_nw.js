define
  ( [ 'browse'
    , 'browse/repo_type/git'
    , 'browse/repo_type/file'
    , 'browse/service/spawn_capture'
    ]
  , function(browse, gitRepoType, fileRepoType, spawnCaptureService)

{ browse
  . factory('gitRepo', gitRepoType)
  . factory('fileRepo', fileRepoType)
  . factory('spawnCapture', spawnCaptureService)

});
