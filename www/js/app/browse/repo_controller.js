; export const repoController =
    ( $scope
    , $q
    , $location
    , createRepoObj
    , parseRenderSrc
    , scrollToHash
    )
    =>
    { $scope.repo = null
    ; $scope.repoForm = {}
    ; $scope.renderedSrc = null

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

    ; const fileFromPath = (repo, path) =>
        repo.manifest.fileMap[path]

    ; const parseRepoString = (str) =>
        { const match = str && str.match(/([^@]+)(?:@([^:]+):?(.*))?/)
        ; return match
            ? {id: match[1], ref: {id: match[2], text: match[2]}, path: match[3]}
            : null
        }

    ; const setPath = () =>
        { const repo = $scope.repo
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
            ; createRepoObj($scope.repoForm.id)
                .then
                  ( (repo) =>
                      { if (!repo) return $q.reject('No repo produced')
                      ; const renderFile = repo.ref !== $scope.repoForm.ref.text
                          || repo.path !== $scope.repoForm.path
                          || !repo.path
                      ; repo.ref = $scope.repoForm.ref.text || repo.ref
                      ; repo.path = $scope.repoForm.path
                          || repo.path
                          || repo.manifest.files[0].path
                      ; $scope.repo = repo
                      ; if (renderFile) changePath()
                      }
                  , (err) =>
                      { console.log('err:', err) // TODO handle error
                      ; $scope.repo = null
                      }
                  )
            }
          else
            { // handle error
            ; console.log('err: no repo')
            }
        }

    ; const changePath = () =>
        { parseRenderSrc
            ( $scope.repo
            , fileFromPath($scope.repo, $scope.repo.path)
            )
            .then((result) =>
                { result.html.prepend('<div id="ds-float-fix">&nbsp;</div>')
                ; $scope.renderedSrc = result
                ; return $location.hash()
                })
            .then
              ( (hash) =>
                  { scrollToHash(hash, false)
                  }
              , (err) =>
                  { $scope.renderedSrc.html = angular.element('<b>ERROR</b>')
                  }
              )
        ; setPath()
        ; $scope.repoForm.updateHack = new Date().getTime()
        }

    ; $scope.changePathTo = (path) =>
        { if (!path || !$scope.repo) return
        ; $scope.repo.path = path
        ; changePath()
        }

    ; $scope.$on('$locationChangeSuccess', function(_new, _old)
        { $scope.repoForm = parseRepoString($location.path().slice(1))
        ; $scope.changeRepo()
        })

    ; $scope.$watch
        ( () => $scope.repoForm && $scope.repoForm.ref
        , (newVal, _old) =>
            { if (newVal) $scope.changeRepo
            }
        )

    ; $scope.scrollToHash = scrollToHash

    ; $scope.console = console

    ; $scope.resizeOpts = (direction) =>
        { const content = jQuery('#ds-content')
        ; let originalWidth
        ; let originalOffset
        ; return (
            { start: (evt, ui) =>
                { originalWidth = content.width()
                ; originalOffset = content.offset().left
                }
            , resize: (evt, ui) =>
                { const travel = ui.size.width - ui.originalSize.width
                ; if (direction === 'reverse')
                    { content.offset({left: originalOffset + travel})
                    }
                }
            , handles: direction === 'reverse' ? 'e' : 'w'
            })
        }

    ; $scope.openExternal =
        false
          ? require('nw.gui').Shell.openExternal
          : (url) => { window.location = url }

    }

; repoController.$inject = ['$scope', '$q', '$location', 'createRepoObj', 'parseRenderSrc', 'scrollToHash']
