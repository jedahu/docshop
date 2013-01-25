define
  ( [ 'es6!browse'
    , 'es6!browse/repo_type/git'
    , 'es6!browse/repo_type/file'
    , 'es6!browse/service/spawn_capture'
    ]
  , function(browse, gitRepoType, fileRepoType, spawnCaptureService)

{ browse
  . factory('gitRepo', gitRepoType)
  . factory('fileRepo', fileRepoType)
  . factory('spawnCapture', spawnCaptureService)

});
