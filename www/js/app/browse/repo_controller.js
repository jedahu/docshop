; export const repoController =
    ( $scope
    , $q
    , $location
    , createRepoObj
    , parseRenderSrc
    , scrollToHash
    , readFile
    , alert
    )
    =>
    { $scope.repo = null
    ; $scope.repoForm = {}
    ; $scope.renderedSrc = null

    ; var updateFromLocation = true

    ; $scope.refQuery =
        { initSelection: (elem, cb) =>
            cb($scope.repoForm.ref)
        , query: (q) =>
            { const data = {results: [{id: q.term, text: q.term}]}
            ; angular.forEach($scope.repo.refs || [], (item, key) =>
                { if (q.term.toUpperCase() ===
                      item.substring(0, q.term.length)
                        .toUpperCase())
                    { data.results.push({id: item, text: item})
                    }
                })
            ; q.callback(data)
            }
        }

    ; const parseRepoString = (str) =>
        { const match = str && str.match(/([^@]+)(?:@([^:]+):?(.*))?/)
        ; return match
            ? {id: match[1], ref: {id: match[2], text: match[2]}, path: match[3]}
            : null
        }

    ; const setPath = () =>
        { const repo = $scope.repo
        ; updateFromLocation = false
        ; $location.path(repo.id + '@' + repo.ref + ':' + repo.path)
        }

    ; $scope.changeRepo = () =>
        { if ($scope.repo && $scope.repoForm.ref.text && $scope.repo.ref !== $scope.repoForm.ref.text)
            { $scope.repo.ref = $scope.repoForm.ref.text
            ; changePath()
            }
          else if ($scope.repo && $scope.repo.id === $scope.repoForm.id)
            { // do nothing
            }
          else if ($scope.repoForm)
            { if (!$scope.repoForm.ref) $scope.repoForm.ref = {}
            ; createRepoObj($scope.repoForm.id, $scope.repoForm.ref.text)
                .then
                  ( (repo) =>
                      { if (!repo) return $q.reject('No repo produced')
                      ; const renderFile = repo.ref !== $scope.repoForm.ref.text
                          || repo.path !== $scope.repoForm.path
                          || !repo.path
                      ; repo.path = $scope.repoForm.path
                          || repo.path
                          || repo.manifest.files[0].path
                      ; $scope.repo = repo
                      ; if (renderFile) changePath()
                      }
                  , (err) =>
                      { //console.log('err:', err) // TODO handle error
                      ; $scope.repo = null
                      ; throw err
                      }
                  )
            }
          else
            { // handle error
            ; console.log('err: no repo')
            }
        }

    ; const changePath = () =>
        { readFile($scope.repo, $scope.repo.path).then((args) =>
            { parseRenderSrc(...args)
            })
        ; setPath()
        //; $scope.repoForm.updateHack = new Date().getTime()
        }

    ; $scope.$on('renderer-result', (_evt, file, result) =>
        { result.html.prepend('<div id="ds-float-fix">&nbsp;</div>')
        ; $scope.renderedSrc = result
        ; scrollToHash($location.hash(), false)
        })

    ; $scope.$on('renderer-cancel', (_evt, file) =>
        { console.log('cancel', file.name)
        })

    ; $scope.$on('renderer-timeout', (_evt, file) =>
        { console.log('timeout', file.name)
        })

    ; $scope.$on('renderer-error', (_evt, file, err) =>
        { console.log('error', file.name, err)
        })

    ; $scope.changePathTo = (path) =>
        { if (!path || !$scope.repo) return
        ; $scope.repo.path = path
        ; changePath()
        }

    ; $scope.$on('$locationChangeSuccess', function(_new, _old)
        { if (!updateFromLocation)
            { updateFromLocation = true
            ; return
            }
        ; $scope.repoForm = parseRepoString($location.path().slice(1))
        ; $scope.changeRepo()
        })

    ; $scope.scrollToHash = scrollToHash

    ; $scope.console = console

    ; $scope.fileNavResizeOpts =
        { handles: 'w'
        , resize: (evt, ui) => ui.element.css('left', 'auto')
        }

    ; $scope.openExternal =
        false
          ? require('nw.gui').Shell.openExternal
          : (url) => { window.location = url }

    ; $scope.show =
        { body: true
        , settings: false
        }

    ; $scope.toggleSettings = (action) =>
        $scope.show.settings =
          action === 'hide'
          ? false
          : !$scope.show.settings

    ; $scope.performAction = (action) => alert.performAction(action)
    ; alert.addAction('show-settings', $scope.toggleSettings)

    }

; repoController.$inject =
    [ '$scope'
    , '$q'
    , '$location'
    , 'createRepoObj'
    , 'parseRenderSrc'
    , 'scrollToHash'
    , 'readFile'
    , 'alert'
    ]
