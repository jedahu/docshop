define
  ( [ './browse_module'
    , './git_repo'
    , './spawn_capture_service'
    ]
  , function(browse, gitRepo, spawnCaptureService)

{ browse
  . factory('gitRepo', gitRepo)
  . factory('spawnCapture', spawnCaptureService)

});
