define
  ( [ 'browse'
    , 'browse/repo_type/git'
    , 'browse/service/spawn_capture'
    ]
  , function(browse, gitRepoType, spawnCaptureService)

{ browse
  . factory('gitRepo', gitRepoType)
  . factory('spawnCapture', spawnCaptureService)

});
